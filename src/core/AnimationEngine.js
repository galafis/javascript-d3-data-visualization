// AnimationEngine.js: Motor profissional e didático para animação de atributos e transições em SVG/DOM.
// Pronto para uso em qualquer chart, documentado e pronto para extensão (D3.js, CSS Transitions ou Web Animations API).

/**
 * AnimationEngine
 * Prover animação declarativa para gráficos SVG/DOM.
 * Métodos: animarAtributo, animarTransição, stopAll.
 */
export default class AnimationEngine {
  constructor() {
    this.running = [];
  }

  /**
   * Anima um atributo numérico de um elemento SVG/DOM.
   * @param {Element} el - Elemento a ser animado.
   * @param {string} attr - Atributo para animar ("x", "y", "r", "width", etc).
   * @param {number} from - Valor inicial.
   * @param {number} to - Valor final.
   * @param {number} duration - Duração em ms.
   * @param {Function} [easing] - Função de interpolação (padrao: linear).
   * @param {Function} [onFinish] - Callback (opcional).
   */
  animateAttribute(el, attr, from, to, duration, easing, onFinish) {
    const start = performance.now();
    easing = easing || ((t) => t);
    let stopped = false;

    const step = (now) => {
      if (stopped) return;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easing(t);
      const value = from + (to - from) * eased;
      el.setAttribute(attr, value);

      if (t < 1) {
        requestAnimationFrame(step);
      } else if (onFinish) {
        onFinish();
      }
    };

    requestAnimationFrame(step);
    // For possible future cancellation, store references (not used in this placeholder)
    this.running.push({ el, attr, stop: () => { stopped = true; } });
  }

  /**
   * Anima múltiplos atributos ao mesmo tempo (ex: para transições mais ricas).
   * @param {Element} el - Elemento.
   * @param {Object} attrs - { attrName: [from, to], ... }
   * @param {number} duration
   * @param {Function} [easing]
   * @param {Function} [onFinish]
   */
  animateTransition(el, attrs, duration, easing, onFinish) {
    const initial = {};
    for (const key in attrs) {
      initial[key] = parseFloat(el.getAttribute(key)) || 0;
    }
    const targets = {};
    for (const key in attrs) {
      if (Array.isArray(attrs[key])) {
        targets[key] = { from: initial[key], to: attrs[key][1] };
      } else {
        targets[key] = { from: initial[key], to: attrs[key] };
      }
    }

    const start = performance.now();
    easing = easing || ((t) => t);
    let stopped = false;

    const step = (now) => {
      if (stopped) return;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easing(t);

      for (const key in targets) {
        const v = targets[key];
        const value = v.from + (v.to - v.from) * eased;
        el.setAttribute(key, value);
      }

      if (t < 1) {
        requestAnimationFrame(step);
      } else if (onFinish) {
        onFinish();
      }
    };

    requestAnimationFrame(step);
    // For future cancellation
    this.running.push({ el, stop: () => { stopped = true; } });
  }

  /**
   * Para todas as animações ativas (placeholder, pois não cancela requestAnimationFrame retroativamente).
   */
  stopAll() {
    this.running.forEach(({ stop }) => { if (stop) stop(); });
    this.running = [];
  }
}

/**
 * Exemplo de uso nos charts:

import AnimationEngine from '../core/AnimationEngine.js';

const engine = new AnimationEngine();
engine.animateAttribute(circleElement, 'r', 0, 10, 550, t => t*t, () => console.log('Animou!'));
engine.animateTransition(rectElement, { x: [0, 100], width: [20, 150] }, 800);
engine.stopAll();

 */

