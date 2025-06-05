/**
 * ChartFactory class
 * Factory pattern for creating chart instances
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

export class ChartFactory {
  /**
   * Registry of available chart types
   * @private
   * @static
   */
  static chartRegistry = {};
  
  /**
   * Create a chart instance of the specified type
   * 
   * @param {string} type - Chart type
   * @param {Object} options - Chart options
   * @returns {Object} Chart instance
   */
  static create(type, options) {
    // Check if chart type exists in registry
    if (!ChartFactory.chartRegistry[type]) {
      throw new Error(`Chart type '${type}' is not registered`);
    }
    
    // Create and return chart instance
    const ChartClass = ChartFactory.chartRegistry[type];
    return new ChartClass(options);
  }
  
  /**
   * Register a chart type
   * 
   * @param {string} type - Chart type identifier
   * @param {Class} chartClass - Chart class constructor
   */
  static register(type, chartClass) {
    ChartFactory.chartRegistry[type] = chartClass;
  }
  
  /**
   * Unregister a chart type
   * 
   * @param {string} type - Chart type to unregister
   */
  static unregister(type) {
    delete ChartFactory.chartRegistry[type];
  }
  
  /**
   * Check if a chart type is registered
   * 
   * @param {string} type - Chart type to check
   * @returns {boolean} True if the chart type is registered
   */
  static isRegistered(type) {
    return !!ChartFactory.chartRegistry[type];
  }
  
  /**
   * Get all available chart types
   * 
   * @returns {Array} Array of registered chart type names
   */
  static getAvailableTypes() {
    return Object.keys(ChartFactory.chartRegistry);
  }
  
  /**
   * Get chart class for a specific type
   * 
   * @param {string} type - Chart type
   * @returns {Class} Chart class constructor
   */
  static getChartClass(type) {
    return ChartFactory.chartRegistry[type];
  }
}

