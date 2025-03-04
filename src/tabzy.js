function Tabzy(selector, options = {}) {
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
          `Tabzy: No tab found for selector '${tab.getAttribute("href")}`
        );
      }

      return panel;
    })
    .filter(Boolean);

  if (this.panels.length !== this.tabs.length) return;

  this.opt = Object.assign(
    {
      remember: false,
    },
    options
  );

  this._originalHTML = this.container.innerHTML;

  this._init();
}

Tabzy.prototype._activatedTab = function (tab) {
  this.tabs.forEach((tab) => {
    tab.closest("li").classList.remove("tabzy--active");
  });

  tab.closest("li").classList.add("tabzy--active");

  this.panels.forEach((panel) => (panel.hidden = true));

  const panelActive = document.querySelector(tab.getAttribute("href"));
  panelActive.hidden = false;

  if (this.opt.remember) {
    history.replaceState(null, null, tab.getAttribute("href"));
  }
};

Tabzy.prototype._init = function () {
  const hash = location.hash;
  const tabToActive =
    (this.opt.remember &&
      hash &&
      this.tabs.find((tab) => tab.getAttribute("href") === hash)) ||
    this.tabs[0];
  console.log(hash);

  this._activatedTab(tabToActive);

  this.tabs.forEach((tab) => {
    tab.onclick = (e) => this._handleTabClick(e, tab);
  });
};

Tabzy.prototype._handleTabClick = function (e, tab) {
  e.preventDefault();

  this._activatedTab(tab);
};

Tabzy.prototype.switch = function (input) {
  let toActive = null;

  if (typeof input === "string") {
    toActive = this.tabs.find((tab) => tab.getAttribute("href") === input);

    if (!toActive) {
      console.error(`Tabzy: No panel found with ID ${input}`);
    }
  } else if (this.tabs.includes(input)) {
    toActive = input;
  }

  this._activatedTab(toActive);
};

Tabzy.prototype.destroy = function () {
  this.container.innerHTML = this._originalHTML;
  this.panels.forEach((panel) => (panel.hidden = false));
  this.container = null;
  this.panels = null;
  this.tabs = null;
};
