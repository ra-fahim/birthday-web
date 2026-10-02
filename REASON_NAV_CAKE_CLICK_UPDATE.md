# Reason internal navigation + cake grouped editing update

- Master Birthday cake text targets now share `mb.cake.group`, so clicking any of the three SVG text lines opens the single grouped Cake text editor.
- Reason cards now preserve their true 0-based item index when rendered, including when navigating backwards from Reason 4 to Reason 3/2/1.
- In Editor mode, Previous/Next moves through Reason 1 → 2 → 3 → 4 before leaving the Reasons screen.
- From Reason 3, Previous opens Reason 2; from Reason 2, Previous opens Reason 1; from Reason 1, Previous returns to Cake.
- From Reason 4, Next moves to Photos. Existing content edits remain stored in the selected reason index.
- Validation: preflight PASS; runtime inline JavaScript syntax PASS.
