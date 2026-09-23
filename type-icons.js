export const TYPE_DISPLAY_ORDER = [
  'Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel',
  'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy'
];

const glyphs = {
  Normal: '<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  Fighting: '<path d="M6 13V8a1.5 1.5 0 0 1 3 0v3-5a1.5 1.5 0 0 1 3 0v5-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5c0 3-2 5-5 5h-2c-2 0-3-1-4-3l-2-3a1.5 1.5 0 0 1 2-2z"/>',
  Flying: '<path d="M3 17c7-1 11-6 15-12 1 6-2 13-9 15l4-5c-3 2-6 2-10 2zm11-4 7-4-4 6z"/>',
  Poison: '<path d="M8 8 6 5m10 3 2-3M9 7h6l2 3v6a5 5 0 0 1-10 0v-6zm1 4h1m3 0h1M9 19l-3 2m9-2 3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/>',
  Ground: '<path d="m3 19 6-10 3 5 3-8 6 13z"/><path d="M6 17h3m4-2h3m1 2h2" stroke="#000" stroke-width="1.3"/>',
  Rock: '<path d="m4 16 2-7 5-4 7 2 3 7-4 5H8z"/><path d="m6 10 5 3 7-4m-7 4-3 6" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4"/>',
  Bug: '<path d="M12 7a5 5 0 0 0-5 5v5a5 5 0 0 0 10 0v-5a5 5 0 0 0-5-5zm-2-3 2 3 2-3M7 11l-4-2m4 7H3m14-5 4-2m-4 7h4M12 8v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  Ghost: '<path d="M5 20V11a7 7 0 0 1 14 0v9l-3-2-4 2-4-2z"/><ellipse cx="9" cy="12" rx="1.3" ry="2" fill="#6b3477"/><ellipse cx="15" cy="12" rx="1.3" ry="2" fill="#6b3477"/>',
  Steel: '<path d="M4 6h16v4H4zm2 6h12v3H6zm-2 5h16v3H4z"/>',
  Fire: '<path d="M13 2c1 5-4 6-2 10 1-2 3-3 4-5 4 5 5 8 3 12-2 4-10 4-13 0-3-5 1-9 4-12 0 4 1 5 2 6-1-5 3-7 2-11z"/>',
  Water: '<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z"/><path d="M9 16a3 3 0 0 0 3 3" fill="none" stroke="#42c8f5" stroke-width="1.8" stroke-linecap="round"/>',
  Grass: '<path d="M20 4C10 4 4 7 4 14c0 3 2 5 5 5 7 0 10-7 11-15z"/><path d="M4 21c4-6 8-9 13-12" fill="none" stroke="#4e9f24" stroke-width="1.8"/>',
  Electric: '<path d="M13 2 5 13h6l-1 9 9-12h-6z"/>',
  Psychic: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.2" fill="#7b48dc"/><circle cx="12" cy="12" r="1.3" fill="#fff"/>',
  Ice: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M12 2l-2 3m2-3 2 3m-2 17-2-3m2 3 2-3M3.3 7l3.7.3m-3.7-.3L5 10m14 7 1.7-3m-1.7 3-3.7-.3M3.3 17 5 14m-1.7 3 3.7-.3M20.7 7 17 6.7m3.7.3L19 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  Dragon: '<path d="M4 18c1-6 4-11 11-12l5 3-2 3 2 3-5 1-2 4-3-3-6 1zm9-8h.1"/><circle cx="14" cy="10" r="1" fill="#7551c7"/>',
  Dark: '<path d="M18 4a9 9 0 1 0 2 15A10 10 0 0 1 18 4z"/><path d="m5 6 1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>',
  Fairy: '<path d="m8 3 1.4 4.6L14 9l-4.6 1.4L8 15l-1.4-4.6L2 9l4.6-1.4zM17 12l1.2 3.8L22 17l-3.8 1.2L17 22l-1.2-3.8L12 17l3.8-1.2z"/>'
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export const typeSlug = type => TYPE_DISPLAY_ORDER.includes(type) ? type.toLowerCase() : 'unknown';

export function typeMark(type, showLabel = true) {
  if (!type) return '';
  const label = escapeHtml(type);
  const glyph = glyphs[type] || glyphs.Normal;
  return `<span class="type-mark type-${typeSlug(type)}" title="${label}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true">${glyph}</svg>${showLabel ? `<span class="type-mark-label">${label}</span>` : ''}</span>`;
}
