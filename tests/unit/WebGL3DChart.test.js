import WebGL3DChart from '../../src/charts/WebGL3DChart.js';

describe('WebGL3DChart', () => {
  test('should exist', () => {
    expect(WebGL3DChart).toBeDefined();
  });

  test('should instantiate without error', () => {
    expect(() => {
      new WebGL3DChart();
    }).not.toThrow();
  });
});
