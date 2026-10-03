# Scroll / countdown fix

- Preview and Demo use a simulated 10-second countdown. It pauses while the template is scrolled out of view or the tab is hidden.
- Master Birthday editor scrolling now forwards touch/wheel gestures to the parent editor page when the active template element has no internal vertical scroll space.
- The scroll bridge uses direct touch coordinates (without adding the moving iframe offset), so parent-page scrolling does not double-count the gesture.
- Internal scrollable template areas such as the letter/photo/puzzle views can still consume the gesture when they have room to scroll.
