#!/usr/bin/env node
// Records a live page with the Chrome DevTools screencast while running a scripted plan, at 2x device pixels.
// usage: node rec.mjs <outDir> <name> <plan.json>      (start Chrome first: scripts/chrome.sh)
// plan: { url, size:[1920,1080], dpr:2, mobile:false, settle:5000, bg:"0xF4F3EF",
//         steps:[ {mark:"upload"}, {wait:800}, {js:"document.querySelector('button').click()"}, {file:{sel:"input[type=file]",path:"/abs/file.mp4"}},
//                 {untilJs:"!!document.querySelector('.done')", timeout:90000}, {js:"…", log:"label"} ] }
// writes: <name>.mp4 (30 fps, real frame timings), <name>-marks.json (beat times for the edit), <name>-frames/ (jpgs)
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const [, , out, name, planFile] = process.argv
if (!planFile) { console.error('usage: node rec.mjs <outDir> <name> <plan.json>'); process.exit(2) }
const plan = JSON.parse(readFileSync(planFile, 'utf8'))
const PORT = process.env.REEL_CDP_PORT ?? 9333
const dir = `${out}/${name}-frames`; mkdirSync(dir, { recursive: true })
const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl)
let id = 0; const pending = new Map(); const frames = []
const send = (method, params = {}) => new Promise(r => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })) })
ws.onmessage = e => {
  const m = JSON.parse(e.data)
  if (m.id) { pending.get(m.id)?.(m.result ?? m.error); pending.delete(m.id); return }
  if (m.method === 'Page.screencastFrame') {
    const f = `${dir}/${String(frames.length).padStart(5, '0')}.jpg`
    writeFileSync(f, Buffer.from(m.params.data, 'base64')); frames.push({ f, t: m.params.metadata.timestamp })
    send('Page.screencastFrameAck', { sessionId: m.params.sessionId })
  }
}
await new Promise(r => (ws.onopen = r))
const [W, H] = plan.size ?? [1920, 1080]; const DPR = plan.dpr ?? 2
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: !!plan.mobile })
await send('Page.enable'); await send('DOM.enable'); await send('Runtime.enable')
await send('Page.navigate', { url: plan.url }); await new Promise(r => setTimeout(r, plan.settle ?? 5000))
await send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: W * DPR, maxHeight: H * DPR, everyNthFrame: 1 })
const marks = []; const t0 = Date.now() / 1000
for (const a of plan.steps ?? []) {
  if (a.mark) marks.push({ mark: a.mark, t: +(Date.now() / 1000 - t0).toFixed(2) })
  if (a.wait) await new Promise(r => setTimeout(r, a.wait))
  if (a.js) { const r = await send('Runtime.evaluate', { expression: a.js, awaitPromise: true, returnByValue: true }); if (r?.exceptionDetails) console.log('JS error:', a.js.slice(0, 60)); else if (a.log && r?.result?.value !== undefined) console.log(a.log, r.result.value) }
  if (a.file) { const { root } = await send('DOM.getDocument', { depth: -1, pierce: true }); const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: a.file.sel }); await send('DOM.setFileInputFiles', { nodeId, files: [a.file.path] }) }
  if (a.untilJs) { const end = Date.now() + (a.timeout ?? 60000); for (;;) { const r = await send('Runtime.evaluate', { expression: a.untilJs, returnByValue: true }); if (r?.result?.value || Date.now() > end) { if (!r?.result?.value) console.log('TIMEOUT waiting for', a.untilJs.slice(0, 60)); break } await new Promise(z => setTimeout(z, 250)) } }
}
await send('Page.stopScreencast'); ws.close()
if (!frames.length) { console.error('no frames captured'); process.exit(1) }
// hold the last frame to the end, then encode with the real frame timings at 30 fps
const tEnd = Date.now() / 1000; frames.push({ f: frames.at(-1).f, t: tEnd })
const txt = frames.slice(0, -1).map((fr, i) => `file '${fr.f}'\nduration ${Math.max(0.001, frames[i + 1].t - fr.t).toFixed(4)}`).join('\n') + `\nfile '${frames.at(-1).f}'`
writeFileSync(`${dir}/list.txt`, txt)
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${dir}/list.txt`, '-vf', `fps=30,scale=${W * DPR}:${H * DPR}:force_original_aspect_ratio=decrease,pad=${W * DPR}:${H * DPR}:(ow-iw)/2:(oh-ih)/2:color=${plan.bg ?? '0x000000'},format=yuv420p`, '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', `${out}/${name}.mp4`])
writeFileSync(`${out}/${name}-marks.json`, JSON.stringify({ duration: +(tEnd - frames[0].t).toFixed(2), marks }, null, 1))
console.log(`${name}: ${frames.length} frames, ${(tEnd - frames[0].t).toFixed(1)} s, marks ${JSON.stringify(marks)}`)
