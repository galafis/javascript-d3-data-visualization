import RealTimeChart from '../../src/charts/RealTimeChart.js';

describe('RealTimeChart', () => {
  test('should exist', () => {
    expect(RealTimeChart).toBeDefined();
  });

  test('should instantiate without error', () => {
    expect(() => {
      new RealTimeChart();
    }).not.toThrow();
  });
});
