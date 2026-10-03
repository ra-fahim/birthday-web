Valentine 2026 - editable build
================================
Design = Valentine2026 standalone (premium dark-mode refined): styles.css, index.html and /public assets are that version.

script.js is NOT the plain standalone script. It renders everything from default-config.json (+ the owner's saved config) and contains the builder hooks:
  no query  = demo
  ?bb=1     = published site
  ?bbEdit=1 = click-to-edit canvas
If you overwrite script.js with the plain standalone file, nothing will be clickable/editable in the builder.
To change the DEFAULT wording, edit default-config.json (not script.js).
