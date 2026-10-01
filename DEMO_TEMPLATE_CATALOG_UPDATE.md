# Demo + Template Catalog Update

## Changes

- The public `/demo` page now uses the same flat catalog layout as `/templates`.
- Demo cards are no longer grouped by occasion/category.
- Template cards now show a real live iframe preview of the installed template instead of a generated placeholder card.
- Live previews load with `bbDemo=1` and send the existing `BB_DEMO_MODE` message so preview media stays muted where supported.
- The preview iframe does not allow autoplay and is non-interactive inside the card; `See demo` opens the full live preview modal.
- Category template pages continue using the same flat card layout.
