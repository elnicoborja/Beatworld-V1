/**
 * WorldMapScene — Three.js overworld map with clickable city nodes
 * Pixel-art styled 3D world map with city markers and camera controls
 */
import * as THREE from 'three';
import { CITIES, CITIES_LIST, LEVEL_COLORS } from '../GameData.js';

// City 3D positions on the map (mapped from V1's SVG coordinates to 3D space)
const CITY_3D_POSITIONS = {};
function mapSvgTo3D(svgX, svgY) {
  // Map from V1's ~1000x500 SVG space to ~30x15 3D space
  return new THREE.Vector3(
    (svgX - 500) * 0.03,
    0.3,
    (svgY - 250) * 0.03
  );
}

// Pre-calculate city positions from V1 data
const CITY_SVG_APPROX = {
  'new-york': [290, 105], 'los-angeles': [180, 135], 'detroit': [265, 95],
  'puerto-rico': [300, 236], 'dominican-republic': [284, 232],
  'medellin': [260, 310], 'rio': [350, 360], 'fortaleza': [370, 310],
  'sao-paulo': [340, 380], 'luanda': [510, 350], 'bogota': [248, 300],
  'buenos-aires': [310, 420], 'santiago': [280, 430], 'mexico-city': [210, 250],
  'monterrey': [205, 235], 'tulum': [230, 260], 'london': [488, 110],
  'newcastle': [486, 100], 'brighton': [490, 118], 'amsterdam': [505, 100],
  'paris': [500, 125], 'berlin': [530, 100], 'moscow': [580, 85],
  'sydney': [870, 420],
};

for (const [id, [x, y]] of Object.entries(CITY_SVG_APPROX)) {
  CITY_3D_POSITIONS[id] = mapSvgTo3D(x, y);
}

export class WorldMapScene {
  constructor(scene, camera, gameState, onCitySelect) {
    this.scene = scene;
    this.camera = camera;
    this.gameState = gameState;
    this.onCitySelect = onCitySelect;
    this.group = new THREE.Group();
    this.group.visible = false;
    this.cityMeshes = new Map();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredCity = null;
    this.labelContainer = null;
    this.pulseTime = 0;

    this._build();
    this._setupInput();
    scene.add(this.group);
  }

  _build() {
    // Ocean floor
    const oceanGeo = new THREE.PlaneGeometry(40, 25);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x1a4558, roughness: 0.8, metalness: 0.1,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.05;
    this.group.add(ocean);

    // Grid lines on ocean
    const gridHelper = new THREE.GridHelper(40, 40, 0x1d5468, 0x1d5468);
    gridHelper.position.y = 0;
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    this.group.add(gridHelper);

    // Continent shapes (simplified 3D blocks)
    this._buildContinents();

    // City markers
    this._buildCityMarkers();
  }

  _buildContinents() {
    const continents = [
      { name: 'North America', x: -6, z: -3, w: 8, d: 6, color: 0x3d8b3d },
      { name: 'Central America', x: -7, z: 1, w: 3, d: 2.5, color: 0x5aad5a },
      { name: 'South America', x: -4, z: 2, w: 5, d: 8, color: 0x3d8b3d },
      { name: 'Europe', x: 0, z: -4, w: 6, d: 4, color: 0x5aad5a },
      { name: 'Africa', x: 1, z: 0, w: 5, d: 8, color: 0x3d8b3d },
      { name: 'Asia', x: 6, z: -4, w: 10, d: 7, color: 0x2a6a2a },
      { name: 'Oceania', x: 11, z: 4, w: 4, d: 3, color: 0x5aad5a },
    ];

    for (const c of continents) {
      const geo = new THREE.BoxGeometry(c.w, 0.2, c.d);
      const mat = new THREE.MeshStandardMaterial({
        color: c.color, roughness: 0.9, flatShading: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(c.x, 0.1, c.z);
      this.group.add(mesh);

      // Slight elevation variation
      const hillGeo = new THREE.BoxGeometry(c.w * 0.6, 0.15, c.d * 0.5);
      const hillMat = new THREE.MeshStandardMaterial({
        color: c.color + 0x111111, roughness: 0.85, flatShading: true,
      });
      const hill = new THREE.Mesh(hillGeo, hillMat);
      hill.position.set(c.x + 0.3, 0.25, c.z - 0.3);
      this.group.add(hill);
    }
  }

  _buildCityMarkers() {
    for (const city of CITIES_LIST) {
      const pos = CITY_3D_POSITIONS[city.id];
      if (!pos) continue;

      // Marker base (pixel-art style cube)
      const markerGeo = new THREE.BoxGeometry(0.25, 0.5, 0.25);
      const levelColor = LEVEL_COLORS[city.level] || '#ffaa00';
      const color = new THREE.Color(levelColor);

      const completed = this.gameState.isCityCompleted(city.id);
      const markerMat = new THREE.MeshStandardMaterial({
        color: completed ? 0x44cc00 : color,
        emissive: completed ? 0x224400 : color,
        emissiveIntensity: 0.3,
        roughness: 0.4,
        metalness: 0.3,
      });

      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.userData = { cityId: city.id, type: 'city-marker' };
      this.group.add(marker);
      this.cityMeshes.set(city.id, marker);

      // Glow ring at base
      const ringGeo = new THREE.RingGeometry(0.2, 0.35, 6);
      const ringMat = new THREE.MeshBasicMaterial({
        color: completed ? 0x44cc00 : color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(pos.x, 0.22, pos.z);
      ring.userData = { cityId: city.id, type: 'city-ring' };
      this.group.add(ring);
    }
  }

  _setupInput() {
    this._onClick = (e) => {
      if (!this.group.visible) return;
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      const meshes = Array.from(this.cityMeshes.values());
      const hits = this.raycaster.intersectObjects(meshes);
      if (hits.length > 0) {
        const cityId = hits[0].object.userData.cityId;
        if (cityId && this.onCitySelect) {
          this.onCitySelect(cityId);
        }
      }
    };

    this._onMouseMove = (e) => {
      if (!this.group.visible) return;
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      const meshes = Array.from(this.cityMeshes.values());
      const hits = this.raycaster.intersectObjects(meshes);
      const newHover = hits.length > 0 ? hits[0].object.userData.cityId : null;

      if (newHover !== this.hoveredCity) {
        // Reset previous
        if (this.hoveredCity) {
          const prev = this.cityMeshes.get(this.hoveredCity);
          if (prev) prev.scale.setScalar(1);
        }
        // Highlight new
        if (newHover) {
          const curr = this.cityMeshes.get(newHover);
          if (curr) curr.scale.setScalar(1.4);
          document.body.style.cursor = 'pointer';
          this._showLabel(newHover);
        } else {
          document.body.style.cursor = 'default';
          this._hideLabel();
        }
        this.hoveredCity = newHover;
      }
    };

    window.addEventListener('click', this._onClick);
    window.addEventListener('mousemove', this._onMouseMove);
  }

  _showLabel(cityId) {
    const city = CITIES[cityId];
    if (!city) return;

    if (!this.labelContainer) {
      this.labelContainer = document.createElement('div');
      this.labelContainer.style.cssText = `
        position: absolute; padding: 6px 12px; background: rgba(0,0,0,0.85);
        border: 1px solid #ffaa00; font-family: 'Press Start 2P', monospace;
        font-size: 7px; color: #ffaa00; pointer-events: none; z-index: 20;
        white-space: nowrap; transition: opacity 0.15s;
      `;
      document.getElementById('ui-overlay').appendChild(this.labelContainer);
    }

    const completed = this.gameState.isCityCompleted(cityId) ? ' ✓' : '';
    this.labelContainer.innerHTML = `${city.emoji} ${city.name}${completed}<br><span style="color:#888;font-size:6px;">${city.genre} · LVL ${city.level}</span>`;
    this.labelContainer.style.opacity = '1';

    // Position label near mouse
    const updatePos = (e) => {
      if (this.labelContainer) {
        this.labelContainer.style.left = (e || window.event).clientX + 15 + 'px';
        this.labelContainer.style.top = (e || window.event).clientY - 10 + 'px';
      }
    };
    window.addEventListener('mousemove', updatePos);
    this._labelMoveHandler = updatePos;
  }

  _hideLabel() {
    if (this.labelContainer) {
      this.labelContainer.style.opacity = '0';
    }
    if (this._labelMoveHandler) {
      window.removeEventListener('mousemove', this._labelMoveHandler);
      this._labelMoveHandler = null;
    }
  }

  show() {
    this.group.visible = true;
    // Position camera for map view
    this.camera.position.set(0, 12, 10);
    this.camera.lookAt(0, 0, 0);

    // Refresh city completion states
    for (const [cityId, mesh] of this.cityMeshes) {
      const completed = this.gameState.isCityCompleted(cityId);
      mesh.material.color.set(completed ? 0x44cc00 : mesh.material.color);
    }
  }

  hide() {
    this.group.visible = false;
    this._hideLabel();
    document.body.style.cursor = 'default';
  }

  update(delta, elapsed) {
    if (!this.group.visible) return;
    this.pulseTime += delta;

    // Pulse city markers
    for (const [cityId, mesh] of this.cityMeshes) {
      if (cityId === this.hoveredCity) continue;
      const pulse = 1 + Math.sin(elapsed * 2 + mesh.position.x) * 0.05;
      mesh.scale.setScalar(pulse);
    }

    // Gentle camera bob
    this.camera.position.y = 12 + Math.sin(elapsed * 0.3) * 0.15;
  }

  dispose() {
    window.removeEventListener('click', this._onClick);
    window.removeEventListener('mousemove', this._onMouseMove);
    this.scene.remove(this.group);
  }
}
