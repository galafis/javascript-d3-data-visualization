// Jest test for Heatmap component
import Heatmap from '../../src/charts/Heatmap.js';

describe('Heatmap', () => {
  test('should exist and be importable', () => {
    expect(Heatmap).toBeDefined();
    expect(typeof Heatmap).toBe('function');
  });

  test('should instantiate without errors', () => {
    expect(() => {
      const heatmap = new Heatmap();
    }).not.toThrow();
  });

  test('should create an instance of Heatmap', () => {
    const heatmap = new Heatmap();
    expect(heatmap).toBeInstanceOf(Heatmap);
  });
});
