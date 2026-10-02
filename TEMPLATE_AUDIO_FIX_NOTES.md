# Template-page audio fix

- Template catalog card previews no longer use `demo=1` / `bbDemo=1`; they use silent `bbCatalog=1&catalog=1`.
- Master Birthday runtime detects catalog mode before starting and keeps countdown/wishing audio disabled.
- A `BB_CATALOG_MODE` message also silences the runtime after iframe load.
- The actual Demo modal still uses `demo=1` and exposes its existing Audio on/off control.
- Updated preflight guards cover the catalog-mode audio safety rules.
