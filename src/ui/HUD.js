/**
 * HUD — Heads-up display showing player info, clout, current city
 */

export class HUD {
  constructor(gameState) {
    this.gameState = gameState;
    this.els = {
      hud: document.getElementById('hud'),
      name: document.getElementById('hud-name'),
      clout: document.getElementById('hud-clout'),
      city: document.getElementById('hud-city'),
    };

    // Auto-update on state change
    gameState.onChange(() => this.refresh());
  }

  show() {
    this.els.hud.style.display = 'flex';
    this.refresh();
  }

  hide() {
    this.els.hud.style.display = 'none';
  }

  update(overrides = {}) {
    if (overrides.city) this.els.city.textContent = overrides.city;
    this.refresh();
  }

  refresh() {
    const d = this.gameState.data;
    this.els.name.textContent = d.playerName || 'PRODUCER';
    this.els.clout.textContent = d.clout.toLocaleString();
  }
}
