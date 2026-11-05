#!/usr/bin/env node
// Renders IDEA-BOARD.html — a self-contained, offline page of a seed run — from the run's JSON files.
//   node board.mjs <run-dir> [out.html]
// Reads: brief.json, ideas.json, world.json, crowd.json, tally.json, (optional) realcheck.json, summary.json
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const pct = x => `${Math.round((x ?? 0) * 100)}%`
const VERDICT = { go: ['Go', 'Build it — then run the real check'], pivot: ['Pivot', 'Interest without commitment: change the angle'], kill: ['Kill', 'The crowd scrolled past'], unclear: ['Unclear', 'Too few people or the runs disagree'] }
const ACTION_ORDER = ['pay', 'try', 'share', 'reply', 'like', 'object', 'scroll', 'ignore']

function bars(f) {
  return [['Stopped', f.stopped], ['Engaged', f.engaged], ['Tried', f.tried], ['Would pay', f.pay]].map(([l, v]) =>
    `<div class="bar"><span>${l}</span><i style="--w:${Math.round((v ?? 0) * 100)}%"></i><b>${pct(v)}</b></div>`).join('')
}

export function render(d) {
  const { brief = {}, ideas = [], world = {}, crowd = [], tally, realcheck = [], summary = {} } = d
  const byId = Object.fromEntries(ideas.map(i => [i.id, i]))
  const top = tally.ranking[0], T = tally.ideas[top], [vLabel, vLine] = VERDICT[T.verdict]
  const cards = tally.ranking.slice(0, 3).map(k => { const x = tally.ideas[k], i = byId[k] ?? { name: k }; return `
    <article class="card v-${x.verdict}"><header><h3>${esc(i.name)}</h3><span class="stamp">${VERDICT[x.verdict][0]}</span></header>
      <p class="pitch">${esc(i.pitch)}</p>${bars(x.runs[0])}
      <p class="obj"><b>Top objection:</b> ${esc(x.objections[0]?.tag ?? 'none')}${x.objections[0] ? ` (${x.objections[0].count})` : ''}</p></article>` }).join('')
  const segRows = Object.entries(T.segments).map(([s, f]) => { const name = world.segments?.find(x => x.id === s)?.name ?? s; return `<tr><th>${esc(name)}</th><td>${f.n}</td>${['stopped', 'engaged', 'tried', 'pay'].map(k => `<td><span class="cell" style="--w:${Math.round(f[k] * 100)}%">${pct(f[k])}</span></td>`).join('')}</tr>` }).join('')
  const rounds = Object.entries(T.rounds).map(([r, f]) => `<div class="round"><h4>Round ${esc(r)}${r === '3' ? ' · after the shock' : r === '2' ? ' · after seeing others' : ' · first look'}</h4>${bars(f)}</div>`).join('')
  const dots = crowd.map(p => { const a = T.people[p.id]?.action ?? 'ignore'; return `<button class="dot a-${a}" data-p="${esc(p.id)}" aria-label="${esc(p.id)}: ${a}"></button>` }).join('')
  const people = Object.fromEntries(crowd.map(p => [p.id, { ...p, ...(T.people[p.id] ?? { action: 'ignore', quote: '' }) }]))
  const objections = T.objections.map(o => `<li><div class="ohead"><b>${esc(o.tag)}</b><span>${o.count} people</span></div>${o.quotes.map(q => `<blockquote>“${esc(q.quote)}” <cite>${esc(q.persona)}</cite></blockquote>`).join('')}</li>`).join('') || '<li>No objections recorded.</li>'
  const fans = T.fans.map(q => `<blockquote>“${esc(q.quote)}” <cite>${esc(q.persona)} · ${q.action === 'pay' ? 'would pay' : 'would try'}</cite></blockquote>`).join('') || '<p class="muted">Nobody in this crowd tried it.</p>'
  const ev = [...(world.rivals ?? []).map(r => ({ k: 'Rival', t: `${r.name}${r.price ? ' · ' + r.price : ''}`, u: r.url, d: r.date })), ...(world.evidence ?? []).map(e => ({ k: e.kind ?? 'Evidence', t: e.text, u: e.url, d: e.date }))]
  const evRows = ev.map(e => `<tr><td>${esc(e.k)}</td><td>${esc(e.t)}</td><td>${e.u ? `<a href="${esc(e.u)}" rel="noopener">${esc(new URL(e.u).hostname)}</a>` : '<span class="muted">no source</span>'}</td><td>${esc(e.d ?? '')}</td></tr>`).join('')
  const runs = T.runs.map(r => `<li>Run ${r.run}: <b>${VERDICT[r.verdict][0]}</b> · tried ${pct(r.tried)} · pay ${pct(r.pay)} (n=${r.n})</li>`).join('')
  const checks = realcheck.map((c, i) => `<li><label><input type="checkbox" data-k="${i}"> ${esc(c)}</label></li>`).join('')

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(byId[top]?.name ?? top)} · Idea board</title>
<style>
/* Field-notebook layout: a ruled research sheet, a stamped verdict, one column of evidence. System fonts only (offline). */
:root{--paper:#f1f3ef;--sheet:#fbfcfa;--ink:#1b2420;--muted:#5d6b64;--rule:#d3dbd5;--go:#1f7a4d;--pivot:#a3640b;--kill:#a8322b;--unclear:#5b5f9a;--hi:#2a6f97;
--serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;--sans:ui-sans-serif,-apple-system,"Segoe UI",system-ui,sans-serif;--mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
@media (prefers-color-scheme:dark){:root{--paper:#111613;--sheet:#171d19;--ink:#e3ebe6;--muted:#9aaba2;--rule:#2b3630;--go:#5fd09a;--pivot:#f0b04e;--kill:#ff8c80;--unclear:#a9adf0;--hi:#7cc4ea;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.6 var(--sans)}
main{max-width:1040px;margin:0 auto;padding:28px max(16px,env(safe-area-inset-left)) 64px;display:flex;flex-direction:column;gap:22px}
section{background:var(--sheet);border:1px solid var(--rule);border-radius:3px;padding:22px clamp(16px,3vw,32px)}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.15;text-wrap:balance;margin:0}h1{font-size:clamp(28px,4.5vw,44px)}h2{font-size:22px;margin-bottom:12px}h3{font-size:18px}
.k{font:600 11px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.muted{color:var(--muted)}
.verdict{display:grid;grid-template-columns:auto minmax(0,1fr);gap:22px;align-items:center}
.bigstamp{font:800 30px var(--mono);letter-spacing:.08em;text-transform:uppercase;border:4px solid currentColor;padding:10px 18px;transform:rotate(-4deg);border-radius:4px}
.v-go .bigstamp,.v-go .stamp{color:var(--go)}.v-pivot .bigstamp,.v-pivot .stamp{color:var(--pivot)}.v-kill .bigstamp,.v-kill .stamp{color:var(--kill)}.v-unclear .bigstamp,.v-unclear .stamp{color:var(--unclear)}
.warn{font-size:13px;color:var(--muted);border-top:1px dashed var(--rule);margin-top:12px;padding-top:8px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}
.card{border:1px solid var(--rule);border-radius:3px;padding:14px;min-width:0}.card header{display:flex;justify-content:space-between;gap:8px;align-items:start}
.stamp{font:700 12px var(--mono);text-transform:uppercase;border:2px solid currentColor;padding:1px 6px;border-radius:3px;white-space:nowrap}
.pitch{font-size:14px;color:var(--muted);margin:6px 0 10px}.obj{font-size:13px;margin:10px 0 0}
.bar{display:grid;grid-template-columns:78px minmax(0,1fr) 40px;gap:8px;align-items:center;font-size:12px;margin:4px 0}
.bar i{height:9px;background:linear-gradient(90deg,var(--hi) var(--w),var(--rule) var(--w));border-radius:2px}.bar b{font:600 12px var(--mono);text-align:right}
.tbl{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--rule);vertical-align:top}thead th{font:600 11px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.cell{display:inline-block;min-width:56px;padding:1px 6px;font:600 12px var(--mono);background:linear-gradient(90deg,color-mix(in srgb,var(--hi) 28%,transparent) var(--w),transparent var(--w));border-radius:2px}
.rounds{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.round h4{margin:0 0 6px;font:600 13px var(--sans)}
.map{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}.dot{width:16px;height:16px;border-radius:50%;border:1px solid var(--rule);padding:0;cursor:pointer;background:var(--paper)}
.dot:focus-visible{outline:2px solid var(--hi);outline-offset:2px}.a-pay{background:var(--go);border-color:var(--go)}.a-try{background:color-mix(in srgb,var(--go) 55%,transparent)}.a-share,.a-reply,.a-like{background:color-mix(in srgb,var(--hi) 45%,transparent)}.a-object{background:var(--kill);border-color:var(--kill)}.a-scroll{background:var(--rule)}
.legend{display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:var(--muted)}.legend span{display:inline-flex;gap:5px;align-items:center}.legend i{width:11px;height:11px;border-radius:50%;display:inline-block;border:1px solid var(--rule)}
#who{min-height:64px;font-size:14px;border-left:3px solid var(--hi);padding:6px 12px;background:var(--paper)}
ul.objs{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px}.ohead{display:flex;justify-content:space-between}.ohead span{font:12px var(--mono);color:var(--muted)}
blockquote{margin:6px 0;padding:6px 12px;border-left:2px solid var(--rule);font-family:var(--serif);font-size:15px}cite{display:block;font:12px var(--mono);font-style:normal;color:var(--muted)}
.checks{list-style:none;padding:0}.checks li{padding:6px 0;border-bottom:1px dashed var(--rule)}input[type=checkbox]{width:18px;height:18px;vertical-align:-3px;margin-right:8px;accent-color:var(--go)}
a{color:var(--hi)}@media (max-width:560px){.verdict{grid-template-columns:1fr}.bigstamp{justify-self:start}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body><main>
<section class="verdict v-${T.verdict}"><div class="bigstamp">${vLabel}</div><div>
  <span class="k">seed · ${esc(brief.date ?? '')} · ${crowd.length} simulated people · ${T.runs.length} run(s)</span>
  <h1>${esc(byId[top]?.name ?? top)}</h1><p style="margin:6px 0 0">${esc(summary.reason ?? vLine)}</p>
  <p class="warn">This is a simulation of AI personas, not evidence of demand. Treat it as a rehearsal; the real check below decides.</p></div></section>
<section><h2>Finalists side by side</h2><div class="cards">${cards}</div></section>
<section><h2>How each group reacted</h2><p class="muted" style="margin-top:-6px">${esc(byId[top]?.name ?? top)} · share of each group at each step</p>
  <div class="tbl"><table><thead><tr><th>Group</th><th>People</th><th>Stopped</th><th>Engaged</th><th>Tried</th><th>Would pay</th></tr></thead><tbody>${segRows}</tbody></table></div></section>
<section><h2>Round by round</h2><div class="rounds">${rounds}</div>${brief.shock ? `<p class="muted">Shock in round 3: ${esc(brief.shock)}</p>` : ''}</section>
<section><h2>The crowd</h2><p class="muted" style="margin-top:-6px">One dot per simulated person. Select a dot to see who they are and what they said.</p>
  <div class="legend"><span><i class="a-pay"></i>would pay</span><span><i class="a-try"></i>would try</span><span><i class="a-like"></i>liked / replied / shared</span><span><i class="a-object"></i>objected</span><span><i class="a-scroll"></i>scrolled on</span><span><i></i>ignored</span></div>
  <div class="map">${dots}</div><div id="who" aria-live="polite"><span class="muted">Select a dot.</span></div></section>
<section><h2>Why people said no</h2><ul class="objs">${objections}</ul></section>
<section><h2>Who liked it</h2>${fans}</section>
<section><h2>Evidence from the real world</h2><div class="tbl"><table><thead><tr><th>Kind</th><th>What</th><th>Source</th><th>Date</th></tr></thead><tbody>${evRows || '<tr><td colspan="4" class="muted">No research in this run.</td></tr>'}</tbody></table></div></section>
<section><h2>Real check this week</h2><p class="muted" style="margin-top:-6px">${esc(summary.killSignal ? 'Kill signal: ' + summary.killSignal : 'Talk to five real people before building.')}</p><ul class="checks">${checks || '<li class="muted">No real-check plan in this run.</li>'}</ul></section>
<section><h2>Is the verdict stable?</h2><ul>${runs}</ul><p class="muted">${T.stable ? 'Both runs agree.' : 'The runs disagree, so the verdict is "unclear".'}</p></section>
</main>
<script>
const P=${JSON.stringify(people).replace(/</g, '\\u003c')};
const who=document.getElementById('who'),e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelectorAll('.dot').forEach(b=>b.addEventListener('click',()=>{const p=P[b.dataset.p];who.innerHTML='<b>'+e(p.id)+'</b> · '+e(p.segment)+' · '+e(p.attitude)+' · '+e(p.age)+' · budget '+e(p.monthly_budget)+'/mo<br>Uses today: '+e(p.current)+' · Pain: '+e(p.pain)+'<br><b>'+e(p.action)+'</b>'+(p.quote?' — “'+e(p.quote)+'”':'')}));
const K='seed-board-'+${JSON.stringify(String(brief.id ?? top))};let s={};try{s=JSON.parse(localStorage.getItem(K)||'{}')}catch(_){}
document.querySelectorAll('.checks input').forEach(c=>{c.checked=!!s[c.dataset.k];c.addEventListener('change',()=>{s[c.dataset.k]=c.checked;try{localStorage.setItem(K,JSON.stringify(s))}catch(_){}})});
</script></body></html>`
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [dir, out] = process.argv.slice(2); if (!dir) { console.error('usage: board.mjs <run-dir> [out.html]'); process.exit(2) }
  const j = f => existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), 'utf8')) : undefined
  const html = render({ brief: j('brief.json'), ideas: j('ideas.json'), world: j('world.json'), crowd: j('crowd.json'), tally: j('tally.json'), realcheck: j('realcheck.json'), summary: j('summary.json') })
  const dest = out ?? join(dir, 'IDEA-BOARD.html'); writeFileSync(dest, html); console.log(`wrote ${dest}`)
}
