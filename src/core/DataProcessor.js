/**
 * DataProcessor class
 * Handles data processing, transformation, and analysis
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

import * as d3 from 'd3';

export class DataProcessor {
  /**
   * Create a new DataProcessor instance
   * 
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      // Default options
      cleanData: true,
      normalizeValues: false,
      detectOutliers: true,
      outlierMethod: 'iqr', // 'iqr', 'zscore', 'percentile'
      outlierThreshold: 1.5, // For IQR method
      ...options
    };
  }
  
  /**
   * Process data for visualization
   * 
   * @param {Array} data - Raw data to process
   * @param {Object} options - Processing options (overrides instance options)
   * @returns {Array} Processed data
   */
  process(data, options = {}) {
    // Merge options
    const processingOptions = { ...this.options, ...options };
    
    // Make a deep copy to avoid modifying the original data
    let processedData = JSON.parse(JSON.stringify(data));
    
    // Apply processing steps based on options
    if (processingOptions.cleanData) {
      processedData = this.cleanData(processedData);
    }
    
    if (processingOptions.detectOutliers) {
      processedData = this.handleOutliers(
        processedData, 
        processingOptions.outlierMethod,
        processingOptions.outlierThreshold
      );
    }
    
    if (processingOptions.normalizeValues) {
      processedData = this.normalizeValues(processedData);
    }
    
    return processedData;
  }
  
  /**
   * Clean data by removing null/undefined values and fixing data types
   * 
   * @param {Array} data - Data to clean
   * @returns {Array} Cleaned data
   */
  cleanData(data) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    // Filter out null/undefined entries
    const filtered = data.filter(item => item !== null && item !== undefined);
    
    // Fix data types (convert string numbers to actual numbers)
    return filtered.map(item => {
      if (typeof item !== 'object') return item;
      
      const result = { ...item };
      
      // Convert string numbers to actual numbers
      Object.keys(result).forEach(key => {
        const value = result[key];
        if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
          result[key] = parseFloat(value);
        }
      });
      
      return result;
    });
  }
  
  /**
   * Handle outliers in the data
   * 
   * @param {Array} data - Data to process
   * @param {string} method - Method to detect outliers ('iqr', 'zscore', 'percentile')
   * @param {number} threshold - Threshold for outlier detection
   * @returns {Array} Data with outliers handled
   */
  handleOutliers(data, method = 'iqr', threshold = 1.5) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    // Find numeric columns
    const firstItem = data[0] || {};
    const numericColumns = Object.keys(firstItem).filter(key => {
      return typeof firstItem[key] === 'number';
    });
    
    if (numericColumns.length === 0) {
      return data; // No numeric columns to process
    }
    
    // Process each numeric column
    numericColumns.forEach(column => {
      const values = data.map(item => item[column]).filter(val => typeof val === 'number');
      
      if (values.length === 0) return;
      
      let lowerBound, upperBound;
      
      if (method === 'iqr') {
        // Interquartile Range method
        const q1 = d3.quantile(values.sort(d3.ascending), 0.25);
        const q3 = d3.quantile(values.sort(d3.ascending), 0.75);
        const iqr = q3 - q1;
        
        lowerBound = q1 - threshold * iqr;
        upperBound = q3 + threshold * iqr;
      } else if (method === 'zscore') {
        // Z-score method
        const mean = d3.mean(values);
        const std = d3.deviation(values);
        
        lowerBound = mean - threshold * std;
        upperBound = mean + threshold * std;
      } else if (method === 'percentile') {
        // Percentile method
        lowerBound = d3.quantile(values.sort(d3.ascending), threshold / 100);
        upperBound = d3.quantile(values.sort(d3.ascending), 1 - threshold / 100);
      }
      
      // Mark outliers (add an outlier flag rather than removing them)
      data.forEach(item => {
        if (typeof item[column] === 'number') {
          item[`${column}_isOutlier`] = item[column] < lowerBound || item[column] > upperBound;
        }
      });
    });
    
    return data;
  }
  
  /**
   * Normalize numeric values to a 0-1 range
   * 
   * @param {Array} data - Data to normalize
   * @returns {Array} Normalized data
   */
  normalizeValues(data) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    // Find numeric columns
    const firstItem = data[0] || {};
    const numericColumns = Object.keys(firstItem).filter(key => {
      return typeof firstItem[key] === 'number' && !key.endsWith('_isOutlier');
    });
    
    if (numericColumns.length === 0) {
      return data; // No numeric columns to normalize
    }
    
    // Process each numeric column
    numericColumns.forEach(column => {
      const values = data.map(item => item[column]).filter(val => typeof val === 'number');
      
      if (values.length === 0) return;
      
      const min = d3.min(values);
      const max = d3.max(values);
      const range = max - min;
      
      if (range === 0) return; // Avoid division by zero
      
      // Add normalized values as a new column
      data.forEach(item => {
        if (typeof item[column] === 'number') {
          item[`${column}_normalized`] = (item[column] - min) / range;
        }
      });
    });
    
    return data;
  }
  
  /**
   * Group data by a specific field
   * 
   * @param {Array} data - Data to group
   * @param {string} field - Field to group by
   * @param {string} aggregateField - Field to aggregate
   * @param {string} aggregateFunction - Aggregation function ('sum', 'avg', 'count', 'min', 'max')
   * @returns {Array} Grouped data
   */
  groupBy(data, field, aggregateField, aggregateFunction = 'sum') {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    // Group data using d3.group
    const grouped = d3.group(data, d => d[field]);
    
    // Apply aggregation function
    const result = Array.from(grouped, ([key, values]) => {
      let aggregatedValue;
      
      switch (aggregateFunction.toLowerCase()) {
        case 'sum':
          aggregatedValue = d3.sum(values, d => d[aggregateField]);
          break;
        case 'avg':
        case 'average':
        case 'mean':
          aggregatedValue = d3.mean(values, d => d[aggregateField]);
          break;
        case 'count':
          aggregatedValue = values.length;
          break;
        case 'min':
          aggregatedValue = d3.min(values, d => d[aggregateField]);
          break;
        case 'max':
          aggregatedValue = d3.max(values, d => d[aggregateField]);
          break;
        case 'median':
          aggregatedValue = d3.median(values, d => d[aggregateField]);
          break;
        default:
          aggregatedValue = d3.sum(values, d => d[aggregateField]);
      }
      
      return {
        [field]: key,
        [aggregateField]: aggregatedValue,
        count: values.length
      };
    });
    
    return result;
  }
  
  /**
   * Filter data based on conditions
   * 
   * @param {Array} data - Data to filter
   * @param {Object} conditions - Filter conditions as key-value pairs
   * @returns {Array} Filtered data
   */
  filter(data, conditions) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    if (!conditions || Object.keys(conditions).length === 0) {
      return data;
    }
    
    return data.filter(item => {
      return Object.entries(conditions).every(([key, value]) => {
        if (Array.isArray(value)) {
          return value.includes(item[key]);
        }
        
        if (typeof value === 'object' && value !== null) {
          // Range filter with min/max
          const { min, max } = value;
          const itemValue = item[key];
          
          if (min !== undefined && max !== undefined) {
            return itemValue >= min && itemValue <= max;
          } else if (min !== undefined) {
            return itemValue >= min;
          } else if (max !== undefined) {
            return itemValue <= max;
          }
        }
        
        return item[key] === value;
      });
    });
  }
  
  /**
   * Sort data by a specific field
   * 
   * @param {Array} data - Data to sort
   * @param {string} field - Field to sort by
   * @param {boolean} ascending - Sort direction
   * @returns {Array} Sorted data
   */
  sort(data, field, ascending = true) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    return [...data].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (valueA === valueB) return 0;
      
      if (ascending) {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
  }
  
  /**
   * Calculate statistics for a dataset
   * 
   * @param {Array} data - Data to analyze
   * @param {string} field - Field to calculate statistics for (if not provided, uses all numeric fields)
   * @returns {Object} Statistics object
   */
  calculateStatistics(data, field) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    // If no specific field is provided, find all numeric fields
    const fields = field ? [field] : this.getNumericFields(data);
    
    const statistics = {};
    
    fields.forEach(field => {
      const values = data
        .map(item => item[field])
        .filter(val => typeof val === 'number');
      
      if (values.length === 0) {
        statistics[field] = {
          count: 0,
          min: null,
          max: null,
          mean: null,
          median: null,
          std: null
        };
        return;
      }
      
      statistics[field] = {
        count: values.length,
        min: d3.min(values),
        max: d3.max(values),
        mean: d3.mean(values),
        median: d3.median(values),
        std: d3.deviation(values),
        sum: d3.sum(values),
        q1: d3.quantile(values.sort(d3.ascending), 0.25),
        q3: d3.quantile(values.sort(d3.ascending), 0.75)
      };
    });
    
    return statistics;
  }
  
  /**
   * Get all numeric fields in a dataset
   * 
   * @param {Array} data - Data to analyze
   * @returns {Array} List of numeric field names
   */
  getNumericFields(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    const firstItem = data[0];
    
    return Object.keys(firstItem).filter(key => {
      // Check if the field contains numeric values
      return data.some(item => typeof item[key] === 'number');
    });
  }
  
  /**
   * Update random values in the dataset (for demo purposes)
   * 
   * @param {Array} data - Original data
   * @param {number} percentage - Percentage of values to update (0-100)
   * @param {number} variationFactor - Maximum variation factor (0-1)
   * @returns {Array} Updated data
   */
  updateRandomValues(data, percentage = 30, variationFactor = 0.2) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    // Make a deep copy
    const updatedData = JSON.parse(JSON.stringify(data));
    
    // Get numeric fields
    const numericFields = this.getNumericFields(updatedData);
    
    if (numericFields.length === 0) {
      return updatedData;
    }
    
    // Calculate how many items to update
    const itemsToUpdate = Math.ceil(updatedData.length * (percentage / 100));
    
    // Randomly select items to update
    const indices = new Set();
    while (indices.size < itemsToUpdate) {
      indices.add(Math.floor(Math.random() * updatedData.length));
    }
    
    // Update selected items
    indices.forEach(index => {
      const item = updatedData[index];
      
      // Randomly select a numeric field to update
      const fieldToUpdate = numericFields[Math.floor(Math.random() * numericFields.length)];
      
      // Update the value with a random variation
      const originalValue = item[fieldToUpdate];
      const variation = originalValue * variationFactor * (Math.random() * 2 - 1);
      item[fieldToUpdate] = originalValue + variation;
    });
    
    return updatedData;
  }
}

