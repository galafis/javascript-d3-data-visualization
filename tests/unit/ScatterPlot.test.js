// ScatterPlot.test.js - Teste unitário Jest para a classe ScatterPlot
import ScatterPlot from '../../src/charts/ScatterPlot.js';

describe('ScatterPlot', () => {
  test('deve ser definida', () => {
    expect(ScatterPlot).toBeDefined();
  });

  test('deve ser possível instanciar sem erros', () => {
    expect(() => {
      new ScatterPlot();
    }).not.toThrow();
  });

  test('instância deve ser um objeto', () => {
    const scatterPlot = new ScatterPlot();
    expect(typeof scatterPlot).toBe('object');
    expect(scatterPlot).toBeInstanceOf(ScatterPlot);
  });
});
