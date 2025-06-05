/**
 * Statistics utility module
 * Provides functions for statistical analysis of data
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

import * as d3 from 'd3';

/**
 * Generate basic statistics for a dataset
 * 
 * @param {Array} data - Data to analyze
 * @param {string} valueField - Field containing the values to analyze (default: 'value')
 * @returns {Object} Statistics object
 */
export function generateStatistics(data, valueField = 'value') {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      min: 0,
      max: 0,
      range: 0,
      variance: 0,
      stdDev: 0
    };
  }
  
  // Extract values
  const values = data
    .map(d => d[valueField])
    .filter(v => v !== null && v !== undefined && !isNaN(v));
  
  if (values.length === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      min: 0,
      max: 0,
      range: 0,
      variance: 0,
      stdDev: 0
    };
  }
  
  // Calculate statistics
  const count = values.length;
  const sum = d3.sum(values);
  const mean = d3.mean(values);
  const median = d3.median(values);
  const min = d3.min(values);
  const max = d3.max(values);
  const range = max - min;
  const variance = d3.variance(values);
  const stdDev = d3.deviation(values);
  
  return {
    count,
    sum,
    mean,
    median,
    min,
    max,
    range,
    variance,
    stdDev
  };
}

/**
 * Calculate correlation between two variables
 * 
 * @param {Array} data - Data array
 * @param {string} xField - Field name for x variable
 * @param {string} yField - Field name for y variable
 * @returns {number} Correlation coefficient
 */
export function calculateCorrelation(data, xField, yField) {
  if (!Array.isArray(data) || data.length === 0) {
    return 0;
  }
  
  // Extract paired values
  const pairs = data
    .map(d => ({ x: d[xField], y: d[yField] }))
    .filter(p => p.x !== null && p.x !== undefined && !isNaN(p.x) &&
                 p.y !== null && p.y !== undefined && !isNaN(p.y));
  
  if (pairs.length < 2) {
    return 0;
  }
  
  // Calculate means
  const xMean = d3.mean(pairs, d => d.x);
  const yMean = d3.mean(pairs, d => d.y);
  
  // Calculate covariance and standard deviations
  let numerator = 0;
  let xDenom = 0;
  let yDenom = 0;
  
  for (const pair of pairs) {
    const xDiff = pair.x - xMean;
    const yDiff = pair.y - yMean;
    
    numerator += xDiff * yDiff;
    xDenom += xDiff * xDiff;
    yDenom += yDiff * yDiff;
  }
  
  // Avoid division by zero
  if (xDenom === 0 || yDenom === 0) {
    return 0;
  }
  
  // Calculate correlation coefficient
  return numerator / Math.sqrt(xDenom * yDenom);
}

/**
 * Calculate linear regression parameters
 * 
 * @param {Array} data - Data array
 * @param {string} xField - Field name for x variable
 * @param {string} yField - Field name for y variable
 * @returns {Object} Regression parameters (slope, intercept, rSquared)
 */
export function calculateLinearRegression(data, xField, yField) {
  if (!Array.isArray(data) || data.length === 0) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }
  
  // Extract paired values
  const pairs = data
    .map(d => ({ x: d[xField], y: d[yField] }))
    .filter(p => p.x !== null && p.x !== undefined && !isNaN(p.x) &&
                 p.y !== null && p.y !== undefined && !isNaN(p.y));
  
  if (pairs.length < 2) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }
  
  // Calculate means
  const xMean = d3.mean(pairs, d => d.x);
  const yMean = d3.mean(pairs, d => d.y);
  
  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;
  
  for (const pair of pairs) {
    const xDiff = pair.x - xMean;
    numerator += xDiff * (pair.y - yMean);
    denominator += xDiff * xDiff;
  }
  
  // Avoid division by zero
  if (denominator === 0) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Calculate R-squared
  let totalSS = 0;
  let residualSS = 0;
  
  for (const pair of pairs) {
    const predicted = slope * pair.x + intercept;
    totalSS += Math.pow(pair.y - yMean, 2);
    residualSS += Math.pow(pair.y - predicted, 2);
  }
  
  const rSquared = totalSS > 0 ? 1 - (residualSS / totalSS) : 0;
  
  return { slope, intercept, rSquared };
}

/**
 * Detect outliers in a dataset
 * 
 * @param {Array} data - Data array
 * @param {string} field - Field to analyze
 * @param {string} method - Method to use ('iqr', 'zscore', 'percentile')
 * @param {number} threshold - Threshold for outlier detection
 * @returns {Array} Array of outliers
 */
export function detectOutliers(data, field, method = 'iqr', threshold = 1.5) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  // Extract values
  const values = data
    .map(d => ({ value: d[field], original: d }))
    .filter(d => d.value !== null && d.value !== undefined && !isNaN(d.value));
  
  if (values.length === 0) {
    return [];
  }
  
  let outliers = [];
  
  if (method === 'iqr') {
    // Interquartile Range method
    const sortedValues = values.map(d => d.value).sort(d3.ascending);
    const q1 = d3.quantile(sortedValues, 0.25);
    const q3 = d3.quantile(sortedValues, 0.75);
    const iqr = q3 - q1;
    
    const lowerBound = q1 - threshold * iqr;
    const upperBound = q3 + threshold * iqr;
    
    outliers = values.filter(d => d.value < lowerBound || d.value > upperBound);
  } else if (method === 'zscore') {
    // Z-score method
    const mean = d3.mean(values, d => d.value);
    const std = d3.deviation(values, d => d.value);
    
    if (std === 0) return [];
    
    outliers = values.filter(d => Math.abs((d.value - mean) / std) > threshold);
  } else if (method === 'percentile') {
    // Percentile method
    const sortedValues = values.map(d => d.value).sort(d3.ascending);
    const lowerBound = d3.quantile(sortedValues, threshold / 100);
    const upperBound = d3.quantile(sortedValues, 1 - threshold / 100);
    
    outliers = values.filter(d => d.value < lowerBound || d.value > upperBound);
  }
  
  return outliers.map(d => d.original);
}

/**
 * Calculate frequency distribution
 * 
 * @param {Array} data - Data array
 * @param {string} field - Field to analyze
 * @param {number} bins - Number of bins for numeric data
 * @returns {Array} Frequency distribution
 */
export function calculateFrequencyDistribution(data, field, bins = 10) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  // Check if field contains numeric or categorical data
  const firstValue = data[0][field];
  const isNumeric = typeof firstValue === 'number';
  
  if (isNumeric) {
    // Numeric data - create histogram
    const values = data
      .map(d => d[field])
      .filter(v => v !== null && v !== undefined && !isNaN(v));
    
    if (values.length === 0) {
      return [];
    }
    
    // Create histogram generator
    const histogram = d3.histogram()
      .domain(d3.extent(values))
      .thresholds(bins);
    
    // Generate bins
    const bins = histogram(values);
    
    // Format result
    return bins.map(bin => ({
      min: bin.x0,
      max: bin.x1,
      count: bin.length,
      frequency: bin.length / values.length
    }));
  } else {
    // Categorical data - count occurrences
    const counts = d3.rollup(
      data,
      v => v.length,
      d => d[field]
    );
    
    // Convert Map to array
    const result = Array.from(counts, ([category, count]) => ({
      category,
      count,
      frequency: count / data.length
    }));
    
    // Sort by count in descending order
    return result.sort((a, b) => b.count - a.count);
  }
}

/**
 * Calculate moving average
 * 
 * @param {Array} data - Data array
 * @param {string} valueField - Field containing values
 * @param {number} windowSize - Window size for moving average
 * @returns {Array} Data with moving average
 */
export function calculateMovingAverage(data, valueField, windowSize = 3) {
  if (!Array.isArray(data) || data.length === 0 || windowSize < 1) {
    return [];
  }
  
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    const window = [];
    
    // Collect values in the window
    for (let j = Math.max(0, i - windowSize + 1); j <= i; j++) {
      const value = data[j][valueField];
      if (value !== null && value !== undefined && !isNaN(value)) {
        window.push(value);
      }
    }
    
    // Calculate average
    const average = window.length > 0 ? d3.mean(window) : null;
    
    // Create result object
    result.push({
      ...data[i],
      [`${valueField}_ma${windowSize}`]: average
    });
  }
  
  return result;
}

