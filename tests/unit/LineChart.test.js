// LineChart.test.js - Teste unitário Jest para a classe LineChart
import LineChart from '../../src/charts/LineChart.js';

describe('LineChart', () => {
  test('deve ser definida', () => {
    expect(LineChart).toBeDefined();
  });

  test('deve ser possível instanciar sem erros', () => {
    expect(() => {
      new LineChart();
    }).not.toThrow();
  });

  test('instância deve ser um objeto', () => {
    const lineChart = new LineChart();
    expect(typeof lineChart).toBe('object');
    expect(lineChart).toBeInstanceOf(LineChart);
  });
});
