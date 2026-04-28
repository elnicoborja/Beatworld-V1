/**
 * Beat World 2.0 — Main Entry Point
 * Three.js scene bootstrap + linear-progression state machine (Level 1 vertical slice).
 */
import * as THREE from 'three';
import { GameState } from './GameState.js';
import { StudioScene } from './studio/StudioScene.js';
import { HUD } from './ui/HUD.js';
import { AudioEngine } from './studio/AudioEngine.js';
import { CharacterSelectScene } from './character-select/CharacterSelectScene.js';
import { LevelSelectScene } from './level-select/LevelSelectScene.js';
import { PerformanceScene } from './performance/PerformanceScene.js';
import { ReviewScene } from './review/ReviewScene.js';
import { SoundsystemRevealScene } from './soundsystem/SoundsystemRevealScene.js';
import { DirectoryScene } from './directory/DirectoryScene.js';

// ─── Renderer Setup ─────────────────────────────────────────
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0a1e);

// ─── Scene & Camera ─────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 12);
camera.lookAt(0, 0, 0);

// ─── Lighting ───────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x404060, 0.6));
const dirLight = new THREE.DirectionalLight(0xffaa00, 0.8);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);
const pointLight = new THREE.PointLight(0xff3399, 0.4, 50);
pointLight.position.set(-5, 5, -5);
scene.add(pointLight);

// ─── Game Systems ───────────────────────────────────────────
const gameState = new GameState();
const audioEngine = new AudioEngine();
const hud = new HUD(gameState);

// Sub-scenes (constructed in init)
let studioScene = null;
let characterSelect = null;
let levelSelect = null;
let performanceScene = null;
let reviewScene = null;
let soundsystemReveal = null;
let directoryScene = null;

let activeScene = 'loading';
// loading | characterSelect | levelSelect | studio | performance | review | soundsystemReveal | directory

// ─── Loading ────────────────────────────────────────────────
const loadBar = document.getElementById('load-bar');
const loadingScreen = document.getElementById('loading-screen');

function updateLoadProgress(pct) {
  if (loadBar) loadBar.style.width = `${pct}%`;
}

async function init() {
  updateLoadProgress(20);

  studioScene = new StudioScene(scene, camera, gameState, audioEngine);
  updateLoadProgress(40);

  characterSelect = new CharacterSelectScene(gameState, switchScene);
  levelSelect = new LevelSelectScene(gameState, switchScene, enterCity);
  performanceScene = new PerformanceScene(scene, camera, gameState, audioEngine, switchScene);
  reviewScene = new ReviewScene(gameState, switchScene);
  soundsystemReveal = new SoundsystemRevealScene(gameState, switchScene);
  directoryScene = new DirectoryScene(gameState, switchScene);
  updateLoadProgress(90);

  updateLoadProgress(100);

  // First-run vs returning player
  const target = gameState.hasOnboarded() ? 'levelSelect' : 'characterSelect';
  awaitClick(() => switchScene(target));
}

function awaitClick(callback) {
  const handler = async () => {
    document.removeEventListener('click', handler);
    await audioEngine.init();
    loadingScreen.classList.add('hidden');
    setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
    callback();
  };
  document.addEventListener('click', handler);
}

// ─── Scene Switching ────────────────────────────────────────
function hideActive() {
  switch (activeScene) {
    case 'characterSelect':   characterSelect?.hide(); break;
    case 'levelSelect':       levelSelect?.hide(); break;
    case 'studio':            studioScene?.hide(); break;
    case 'performance':       performanceScene?.hide(); break;
    case 'review':            reviewScene?.hide(); break;
    case 'soundsystemReveal': soundsystemReveal?.hide(); break;
    case 'directory':         directoryScene?.hide(); break;
  }
}

function switchScene(name) {
  hideActive();
  activeScene = name;

  const screenContainer = document.getElementById('screen-container');
  screenContainer.innerHTML = '';

  switch (name) {
    case 'characterSelect':
      document.getElementById('hud').style.display = 'none';
      characterSelect.show();
      break;
    case 'levelSelect':
      document.getElementById('hud').style.display = 'none';
      levelSelect.show();
      break;
    case 'studio':
      hud.show();
      studioScene.show();
      break;
    case 'performance':
      hud.show();
      performanceScene.show();
      break;
    case 'review':
      document.getElementById('hud').style.display = 'none';
      reviewScene.show();
      break;
    case 'soundsystemReveal':
      document.getElementById('hud').style.display = 'none';
      soundsystemReveal.show();
      break;
    case 'directory':
      document.getElementById('hud').style.display = 'none';
      directoryScene.show();
      break;
  }

  // Each scene mounts its own SoundOS footer (mountSoundOsFooter is idempotent).
}

function enterCity(cityId) {
  gameState.setCurrentCity(cityId);
  audioEngine.setCityId(cityId);
  studioScene.loadCity(cityId);
  switchScene('studio');
}

// Public API used by scenes' inline event handlers
window.__beatworld = {
  switchScene,
  enterCity,
  gameState,
  audioEngine,
  // Legacy aliases for the existing StudioScene buttons (will be removed when StudioScene is refactored)
  backToMap: () => switchScene('levelSelect'),
  backToLevels: () => switchScene('levelSelect'),
  finishBeat: () => switchScene('performance'),
};

// ─── Resize ─────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Animation Loop ─────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  if (activeScene === 'studio' && studioScene) studioScene.update(delta, elapsed);
  if (activeScene === 'performance' && performanceScene) performanceScene.update(delta, elapsed);

  renderer.render(scene, camera);
}

// ─── Start ──────────────────────────────────────────────────
init().then(() => {
  animate();
}).catch(err => {
  console.error('Beat World init failed:', err);
});
