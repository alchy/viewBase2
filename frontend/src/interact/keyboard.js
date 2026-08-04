import * as THREE from 'three';

/** True, když má fokus editovatelný prvek (input/textarea/select/contenteditable).
 *  Tehdy klávesy patří psaní (např. do ovládacího okna), ne ovládání kamery. */
function isEditableFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
    || el.isContentEditable;
}

const ORBIT_STEP = 0.06;    // rad na krok (auto-repeat klávesy = plynulost)
const ZOOM_FACTOR = 0.92;   // násobek vzdálenosti (3D) / zoomu (2D) na krok
const PAN_STEP = 40;        // světové jednotky na krok (2D pan)
const MIN_POLAR = 0.05;     // rad – nepřeklápět kameru přes póly
// Posun pohledu je zlomek VZDÁLENOSTI od cíle, ne pevný počet jednotek:
// zblízka se tak posouvá jemně, z dálky svižně, a na malém i obřím grafu se
// ovládá stejně.
const PAN_FRACTION = 0.08;

/** Klávesy: W/S = orbit nahoru/dolů (polar), A/D = vlevo/vpravo (azimut),
 *  Q/E = zoom in/out, MEZERNÍK = nacentrovat na těžiště grafu (a nazoomovat
 *  tak, aby se celý vešel), R = reset na výchozí pohled.
 *  Ve 2D režimu WASD = pan, Q/E = zoom (ortografická kamera).
 *
 *  SHIFT + WASD posouvá POHLED po ploše obrazovky (vleze se do něj jiná část
 *  grafu) místo obíhání kolem středu – kamera i její cíl se posunou o totéž,
 *  takže se pohled nestáčí zpátky doprostřed. U velkého grafu je to jediný
 *  způsob, jak si prohlédnout okraj, aniž by ho orbit odtočil pryč. */
export class KeyboardControls {
  /** `hasFocus` rozhoduje, jestli klávesy patří tomuhle grafu – posluchač visí
   *  na `window` (jinak by canvas musel být fokusovatelný), takže při víc
   *  oknech nebo screenech by jinak jedna klávesa hýbala všemi najednou.
   *  `onCenter` obslouží mezerník; bez něj se spadne zpět na reset pohledu. */
  constructor(camera, controls, {
    is2d = false, target = window, hasFocus = () => true, onCenter = null,
  } = {}) {
    this._spherical = new THREE.Spherical();
    this._offset = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._delta = new THREE.Vector3();
    this.hasFocus = hasFocus;
    this.onCenter = onCenter;
    this.setCameraControls(camera, controls, is2d);
    target.addEventListener('keydown', (e) => {
      // píše-li uživatel do inputu (ovládací okno), klávesy nepatří kameře
      if (isEditableFocused()) return;
      if (!this.hasFocus()) return;         // klávesy patří jinému oknu
      if (this.handleKey(e.code, e.shiftKey)) e.preventDefault();
    });
  }

  /** Options „2D/3D" (§8a designu): živé přepnutí kamery/controls BEZ
   *  znovu-registrace `keydown` listeneru na `target` – ten dispose nemá
   *  (posluchač na `window` napořád), takže reinit celé instance by na
   *  každé přepnutí přidal další, natrvalo. Renderer.setDimensions volá
   *  tohle místo `new KeyboardControls(...)`. */
  setCameraControls(camera, controls, is2d = false) {
    this.camera = camera;
    this.controls = controls;
    this.is2d = is2d;
    this.home = {                       // výchozí stav pro reset mezerníkem
      position: camera.position.clone(),
      target: controls.target.clone(),
      zoom: camera.zoom,
    };
  }

  /** Vrací true, když byla klávesa obsloužená. */
  handleKey(code, shift = false) {
    if (shift) {
      switch (code) {
        case 'KeyW': this._panView(0, 1); return true;
        case 'KeyS': this._panView(0, -1); return true;
        case 'KeyA': this._panView(-1, 0); return true;
        case 'KeyD': this._panView(1, 0); return true;
        default: break;      // Shift+Q/E/R ať se chovají jako bez shiftu
      }
    }
    if (this.is2d) {
      switch (code) {
        case 'KeyW': this._pan(0, PAN_STEP); return true;
        case 'KeyS': this._pan(0, -PAN_STEP); return true;
        case 'KeyA': this._pan(-PAN_STEP, 0); return true;
        case 'KeyD': this._pan(PAN_STEP, 0); return true;
        case 'KeyQ': this._zoom(ZOOM_FACTOR); return true;
        case 'KeyE': this._zoom(1 / ZOOM_FACTOR); return true;
        case 'Space': this.center(); return true;
        case 'KeyR': this.reset(); return true;
        default: return false;
      }
    }
    switch (code) {
      case 'KeyW': this._orbit(0, -ORBIT_STEP); return true;
      case 'KeyS': this._orbit(0, ORBIT_STEP); return true;
      case 'KeyA': this._orbit(ORBIT_STEP, 0); return true;
      case 'KeyD': this._orbit(-ORBIT_STEP, 0); return true;
      case 'KeyQ': this._zoom(ZOOM_FACTOR); return true;
      case 'KeyE': this._zoom(1 / ZOOM_FACTOR); return true;
      case 'Space': this.center(); return true;
      case 'KeyR': this.reset(); return true;
      default: return false;
    }
  }

  /** Mezerník: nacentruj a nazoomuj na SKUTEČNÝ rozsah grafu (řeší okno,
   *  které jediné zná pozice uzlů). Bez obsluhy zbývá reset na výchozí
   *  pohled – to je ale jen pevná pozice kamery, ne střed grafu. */
  center() {
    if (this.onCenter && this.onCenter()) return;
    this.reset();
  }

  /** Orbit kolem controls.target přes sférické souřadnice. */
  _orbit(deltaAzimuth, deltaPolar) {
    this._offset.copy(this.camera.position).sub(this.controls.target);
    this._spherical.setFromVector3(this._offset);
    this._spherical.theta += deltaAzimuth;
    this._spherical.phi = Math.min(Math.PI - MIN_POLAR,
      Math.max(MIN_POLAR, this._spherical.phi + deltaPolar));
    this._offset.setFromSpherical(this._spherical);
    this.camera.position.copy(this.controls.target).add(this._offset);
    this.camera.lookAt(this.controls.target);
    this._changed();
  }

  /** factor < 1 přibližuje: 3D zmenší vzdálenost, 2D zvětší camera.zoom. */
  _zoom(factor) {
    if (this.is2d) {
      this.camera.zoom = Math.min(20, Math.max(0.05, this.camera.zoom / factor));
      this.camera.updateProjectionMatrix();
    } else {
      this._offset.copy(this.camera.position).sub(this.controls.target);
      this._offset.multiplyScalar(factor);
      this.camera.position.copy(this.controls.target).add(this._offset);
    }
    this._changed();
  }

  /** Posun POHLEDU po ploše obrazovky – „veze se plátno".
   *
   *  Kamera i její cíl se posunou o TENTÝŽ vektor, takže se pohled nestáčí
   *  zpět ke středu jako u orbitu; graf se dá takhle procházet od kraje ke
   *  kraji. Směry se berou z matice kamery (její osy vpravo/nahoru), aby
   *  posun odpovídal tomu, co uživatel vidí, ne světovým osám.
   *
   *  `dx`/`dy` jsou -1/0/1 (vlevo–vpravo / dolů–nahoru). */
  _panView(dx, dy) {
    const krok = this.is2d
      ? PAN_STEP / (this.camera.zoom || 1)
      : this.camera.position.distanceTo(this.controls.target) * PAN_FRACTION;
    this._right.setFromMatrixColumn(this.camera.matrix, 0).multiplyScalar(dx * krok);
    this._up.setFromMatrixColumn(this.camera.matrix, 1).multiplyScalar(dy * krok);
    this._delta.copy(this._right).add(this._up);
    this.camera.position.add(this._delta);
    this.controls.target.add(this._delta);
    this._changed();
  }

  /** Posun kamery i targetu v rovině XY (2D režim). */
  _pan(dx, dy) {
    this.camera.position.x += dx;
    this.camera.position.y += dy;
    this.controls.target.x += dx;
    this.controls.target.y += dy;
    this._changed();
  }

  reset() {
    this.camera.position.copy(this.home.position);
    this.controls.target.copy(this.home.target);
    this.camera.zoom = this.home.zoom;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.controls.target);
    this._changed();
  }

  _changed() {
    this.controls.update();
    // OrbitControls 'change' event => view_change odejde i pro klávesnici
    this.controls.dispatchEvent({ type: 'change' });
  }
}
