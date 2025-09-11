// PieChart.test.js
// Jest test file for PieChart component

import PieChart from '../../src/charts/PieChart.js';

describe('PieChart', () => {
  test('should exist and be importable', () => {
    expect(PieChart).toBeDefined();
    expect(typeof PieChart).toBe('function');
  });

  test('should instantiate without error', () => {
    expect(() => {
      const pieChart = new PieChart();
    }).not.toThrow();
  });

  test('should create an instance with correct constructor', () => {
    const pieChart = new PieChart();
    expect(pieChart).toBeInstanceOf(PieChart);
  });
});
