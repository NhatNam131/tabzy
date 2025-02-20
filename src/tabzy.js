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

  this._originalHTML = this.container.innerHTML;

  this._init();
}

Tabzy.prototype._activeTab = function (tab) {
  this.tabs.forEach((tab) => {
    tab.closest("li").classList.remove("tabzy--active");
  });

  tab.closest("li").classList.add("tabzy--active");

  this.panels.forEach((panel) => (panel.hidden = true));

  const panelActive = document.querySelector(tab.getAttribute("href"));
  panelActive.hidden = false;
};

Tabzy.prototype._handleTabClick = function (e, tab) {
  e.preventDefault();

  this._activeTab(tab);
};

Tabzy.prototype._init = function () {
  this._activeTab(this.tabs[0]);

  this.tabs.forEach((tab) => {
    tab.onclick = (e) => this._handleTabClick(e, tab);
  });
};

Tabzy.prototype.switch = function (input) {
  let toActive = null;

  if (typeof input === "string") {
    toActive = this.tabs.find((tab) => tab.getAttribute("href") === input);

    if (!toActive) {
      console.error(`Tabzy: No panel found with ID ${input}`);
      return;
    }
  } else if (this.tabs.includes(input)) {
    toActive = input;
  }

  if (!toActive) {
    console.error(`Tabzy: Invalid input '${input}`);
    return;
  }

  this._activeTab(toActive);
};

Tabzy.prototype.destroy = function () {
  this.container.innerHTML = this._originalHTML;
  this.panels.forEach((panel) => (panel.hidden = false));
  this.container = null;
  this.tabs = null;
  this.panels = null;
};
