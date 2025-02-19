function Tabzy(selector) {
  this.container = document.querySelector(selector);
  if (!this.container) {
    console.error(`Tabzy: No container found for selector: ${selector}`);
    return;
  }

  this.tabs = Array.from(this.container.querySelectorAll("li a"));
  if (!this.tabs.length) {
    console.error(`Tabzy: No tab found inside the container`);
    return;
  }

  this.panels = this.tabs
    .map((tab) => {
      const panel = document.querySelector(tab.getAttribute("href"));
      if (!panel) {
        console.error(
          `Tabzy: No tab found for selector '${tab.getAttribute("href")}'`
        );
      }
      return panel;
    })
    .filter(Boolean);

  if (this.panels.length !== this.tabs.length) return;
}
