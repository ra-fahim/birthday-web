# Scroll / countdown fix

- Preview and Demo use a simulated 10-second countdown. It used to keep running while the template was scrolled out of view, so scrolling back showed Greeting.
- `public/templates/master-birthday/runtime.html` now pauses that simulated timer while the template is off-screen or the tab is hidden, and resumes it when visible again.
- The real published birthday clock (live site) and editor mode are untouched.
