// @vitest-environment happy-dom
// (KeyboardControls sahá při stisku na document.activeElement – rozlišuje,
//  jestli klávesy patří kameře, nebo psaní do inputu)
import * as THREE from '../src/vendor/three/three.module.js';
import { describe, expect, it } from 'vitest';
import { KeyboardControls } from '../src/interact/keyboard.js';

/** Minimální náhrada OrbitControls – stačí cíl a dvě no-op metody. */
function fakeControls(target) {
  return { target, update() {}, dispatchEvent() {} };
}

/** Posluchač, přes který jde stisk stejnou cestou jako v prohlížeči. */
function fakeTarget() {
  const posluchaci = [];
  return {
    addEventListener(_type, fn) { posluchaci.push(fn); },
    press(code, { shiftKey = false } = {}) {
      for (const fn of posluchaci) fn({ code, shiftKey, preventDefault() {} });
    },
  };
}

function setup({ is2d = false } = {}) {
  const camera = is2d
    ? new THREE.OrthographicCamera(-100, 100, 100, -100, 1, 1000)
    : new THREE.PerspectiveCamera(60, 1, 1, 50000);
  camera.position.set(0, 0, 900);
  const controls = fakeControls(new THREE.Vector3(0, 0, 0));
  camera.lookAt(controls.target);
  camera.updateMatrix();
  camera.updateMatrixWorld(true);
  // `target: {addEventListener(){}}` – v testu nechceme globální posluchač
  const keys = new KeyboardControls(camera, controls,
    { is2d, target: { addEventListener() {} } });
  return { camera, controls, keys };
}

describe('KeyboardControls – posun pohledu (Shift+WASD)', () => {
  it('posune kameru i cíl o totéž, takže se pohled nevrací ke středu', () => {
    const { camera, controls, keys } = setup();
    const odstupPred = camera.position.distanceTo(controls.target);
    const kameraPred = camera.position.clone();
    const cilPred = controls.target.clone();

    expect(keys.handleKey('KeyD', true)).toBe(true);

    const posunKamery = camera.position.clone().sub(kameraPred);
    const posunCile = controls.target.clone().sub(cilPred);
    expect(posunKamery.distanceTo(posunCile)).toBeLessThan(1e-6);
    expect(posunKamery.length()).toBeGreaterThan(0);
    // vzdálenost od cíle se nesmí změnit – jinak by to byl zoom, ne posun
    expect(camera.position.distanceTo(controls.target))
      .toBeCloseTo(odstupPred, 6);
  });

  it('směry odpovídají obrazovce: D doprava, W nahoru, A/S opačně', () => {
    const { camera, controls, keys } = setup();
    keys.handleKey('KeyD', true);
    expect(controls.target.x).toBeGreaterThan(0);   // kamera hledí podél -Z
    keys.handleKey('KeyA', true);
    expect(controls.target.x).toBeCloseTo(0, 6);    // A vrátí D
    keys.handleKey('KeyW', true);
    expect(controls.target.y).toBeGreaterThan(0);
    keys.handleKey('KeyS', true);
    expect(controls.target.y).toBeCloseTo(0, 6);
  });

  it('krok roste se vzdáleností od cíle (velký graf = svižnější procházení)', () => {
    const blizko = setup();
    blizko.keys.handleKey('KeyD', true);
    const kratky = blizko.controls.target.length();

    const daleko = setup();
    daleko.camera.position.set(0, 0, 9000);
    daleko.camera.updateMatrix();
    daleko.keys.handleKey('KeyD', true);
    expect(daleko.controls.target.length()).toBeGreaterThan(kratky * 5);
  });

  it('bez shiftu se WASD chová dál jako orbit (vzdálenost drží, směr se mění)', () => {
    const { camera, controls, keys } = setup();
    const odstup = camera.position.distanceTo(controls.target);
    keys.handleKey('KeyD', false);
    expect(controls.target.length()).toBeCloseTo(0, 6);   // cíl zůstal
    expect(camera.position.distanceTo(controls.target)).toBeCloseTo(odstup, 4);
    expect(camera.position.x).not.toBeCloseTo(0, 3);      // ale kamera obeplula
  });

  it('funguje i ve 2D (ortografická kamera, krok podle zoomu)', () => {
    const { camera, controls, keys } = setup({ is2d: true });
    camera.zoom = 2;
    keys.handleKey('KeyD', true);
    const posun = controls.target.x;
    expect(posun).toBeGreaterThan(0);
    expect(Number.isFinite(posun)).toBe(true);
  });
});

describe('KeyboardControls – mezerník centruje na graf', () => {
  it('zavolá obsluhu centrování místo resetu na výchozí pohled', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 50000);
    camera.position.set(0, 0, 900);
    const controls = fakeControls(new THREE.Vector3(5, 5, 5));
    let volano = 0;
    const keys = new KeyboardControls(camera, controls, {
      target: { addEventListener() {} },
      onCenter: () => { volano += 1; return true; },
    });
    keys.handleKey('Space');
    expect(volano).toBe(1);
    // obsluha si pohled řídí sama – reset ho NESMÍ přepsat zpátky
    expect(controls.target.x).toBe(5);
  });

  it('bez obsluhy (nebo když nemá pozice) spadne zpět na reset', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 50000);
    camera.position.set(0, 0, 900);
    const controls = fakeControls(new THREE.Vector3(0, 0, 0));
    const keys = new KeyboardControls(camera, controls, {
      target: { addEventListener() {} },
      onCenter: () => false,          // graf ještě nemá žádné pozice
    });
    controls.target.set(400, 0, 0);
    camera.position.set(400, 0, 900);
    keys.handleKey('Space');
    expect(controls.target.x).toBeCloseTo(0, 6);      // vrátilo se domů
  });

  it('R zůstává resetem na výchozí pohled', () => {
    const { camera, controls, keys } = setup();
    keys.handleKey('KeyD', true);
    expect(controls.target.length()).toBeGreaterThan(0);
    keys.handleKey('KeyR');
    expect(controls.target.length()).toBeCloseTo(0, 6);
    expect(camera.position.z).toBeCloseTo(900, 6);
  });
});

describe('KeyboardControls – klávesy patří jen zaostřenému oknu', () => {
  it('nezaostřené okno stisk ignoruje, zaostřené ho obslouží', () => {
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 50000);
    camera.position.set(0, 0, 900);
    const controls = fakeControls(new THREE.Vector3(0, 0, 0));
    camera.lookAt(controls.target);
    camera.updateMatrix();
    const target = fakeTarget();
    let zaostreno = false;
    // eslint-disable-next-line no-new
    new KeyboardControls(camera, controls, { target, hasFocus: () => zaostreno });

    target.press('KeyD', { shiftKey: true });
    expect(controls.target.length()).toBe(0);        // nezaostřené: nic

    zaostreno = true;
    target.press('KeyD', { shiftKey: true });
    expect(controls.target.length()).toBeGreaterThan(0);
  });
});
