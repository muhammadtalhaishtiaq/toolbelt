---
name: rule
description: Turns a standing instruction in plain words into an enforced project rule that the forge guard checks on every edit or command — e.g. "never call the payment API from the browser", "don't use moment.js", "always use the logger, not console.log", "block rm -rf". Use when the user says "never let it…", "always…", "stop doing X", "make sure it doesn't…". Writes .forge/rules/<name>.md and tests it.
argument-hint: "\"<rule in plain words>\""
---

# Rule

## Process
1. Restate the rule in one line and decide:
   - **on**: `edit` (file contents) and/or `bash` (commands);
   - **action**: `block` (stop the tool call) for anything security- or data-loss-related, else `warn` (Claude is told after the edit and must correct it);
   - **paths** (optional regex, for edit rules), e.g. `^src/` for browser code only;
   - **pattern**: a JavaScript regex that matches violations with few false positives.
2. Write `.forge/rules/<kebab-name>.md`:
   ```markdown
   ---
   name: no-client-provider-calls
   on: edit
   action: block
   paths: ^src/
   pattern: fetch\(['"]https://api\.provider\.com
   ---
   Call the provider from server routes in api/, never from browser code.
   ```
3. **Test it**: show one example that should match and one that shouldn't, and check the regex against both (`node -e "console.log(/<pattern>/i.test('<example>'))"`). Adjust until both are right.
4. Mention it in CLAUDE.md under "Product rules" so the intent is visible, and record the rule in DECISIONS.
5. To disable: `enabled: false` in the frontmatter (record why).

## Limits
Regex rules catch text patterns, not meaning. For rules that need judgement ("keep functions small"), add them to CONSTRAINTS.md and the review instead, and say so.
