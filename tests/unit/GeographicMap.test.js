import GeographicMap from '../../src/charts/GeographicMap.js';

describe('GeographicMap', () => {
  test('should be defined', () => {
    expect(GeographicMap).toBeDefined();
  });

  test('should instantiate without error', () => {
    expect(() => {
      new GeographicMap();
    }).not.toThrow();
  });
});
