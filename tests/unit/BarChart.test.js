// BarChart.test.js - Teste unitário Jest para a classe BarChart
import BarChart from '../../src/charts/BarChart.js';

describe('BarChart', () => {
  test('deve ser definida', () => {
    expect(BarChart).toBeDefined();
  });

  test('deve ser possível instanciar sem erros', () => {
    expect(() => {
      new BarChart();
    }).not.toThrow();
  });

  test('instância deve ser um objeto', () => {
    const barChart = new BarChart();
    expect(typeof barChart).toBe('object');
    expect(barChart).toBeInstanceOf(BarChart);
  });
});
