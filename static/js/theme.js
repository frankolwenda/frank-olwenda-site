(function () {
  var btn = document.getElementById("theme-toggle");
  var iconSlot = document.getElementById("theme-toggle-icon");
  if (!btn || !iconSlot) return;

  var icons = {
    // Sun — shown when it's currently dark, so clicking switches to light
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>',
    // Moon — shown when it's currently light, so clicking switches to dark
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.7 6.7 0 0 0 10.7 10.7Z"/></svg>'
  };

  function render() {
    var theme = document.documentElement.getAttribute("data-theme") || "dark";
    iconSlot.innerHTML = icons[theme] || icons.dark;
  }

  btn.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* localStorage unavailable (private browsing, etc.) — theme still
         switches for this page view, it just won't persist. */
    }
    render();
  });

  render();
})();
