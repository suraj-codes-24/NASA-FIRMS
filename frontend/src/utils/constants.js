/**
 * IGNIS — Frontend Constants
 * 
 * Classification types, colors, and configuration constants.
 * Must stay in sync with backend/app/utils/constants.py
 */

export const FIRE_TYPES = {
  INDUSTRIAL_FIRE: 'industrial_fire',
  FOREST_FIRE: 'forest_fire',
  GAS_FLARE: 'gas_flare',
  AGRICULTURAL_BURN: 'agricultural_burn',
  MINING_THERMAL: 'mining_thermal',
  UNCLASSIFIED: 'unclassified',
}

export const FIRE_COLORS = {
  [FIRE_TYPES.INDUSTRIAL_FIRE]: '#e74c3c',
  [FIRE_TYPES.FOREST_FIRE]: '#e67e22',
  [FIRE_TYPES.GAS_FLARE]: '#f1c40f',
  [FIRE_TYPES.AGRICULTURAL_BURN]: '#2ecc71',
  [FIRE_TYPES.MINING_THERMAL]: '#3498db',
  [FIRE_TYPES.UNCLASSIFIED]: '#95a5a6',
}

export const FIRE_LABELS = {
  [FIRE_TYPES.INDUSTRIAL_FIRE]: 'Industrial Fire',
  [FIRE_TYPES.FOREST_FIRE]: 'Forest / Wildfire',
  [FIRE_TYPES.GAS_FLARE]: 'Gas Flare',
  [FIRE_TYPES.AGRICULTURAL_BURN]: 'Agricultural Burn',
  [FIRE_TYPES.MINING_THERMAL]: 'Mining / Thermal',
  [FIRE_TYPES.UNCLASSIFIED]: 'Unclassified',
}

export const FIRE_EMOJIS = {
  [FIRE_TYPES.INDUSTRIAL_FIRE]: '🔴',
  [FIRE_TYPES.FOREST_FIRE]: '🟠',
  [FIRE_TYPES.GAS_FLARE]: '🟡',
  [FIRE_TYPES.AGRICULTURAL_BURN]: '🟢',
  [FIRE_TYPES.MINING_THERMAL]: '🔵',
  [FIRE_TYPES.UNCLASSIFIED]: '⚪',
}

export const SEVERITY_COLORS = {
  critical: '#e74c3c',
  high: '#e67e22',
  medium: '#f1c40f',
  low: '#3498db',
}

// India map center and default zoom
export const INDIA_CENTER = [22.5, 82.0]
export const DEFAULT_ZOOM = 5

// CartoDB Dark Matter tile layer (§9.4)
export const MAP_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
export const MAP_TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
