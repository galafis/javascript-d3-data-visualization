/**
 * Data loader utility module
 * Provides functions for loading data from various sources
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

import * as d3 from 'd3';

// Import sample datasets
import salesData from '../data/sales-data.json';
import geographicData from '../data/geographic-data.json';
import timeSeriesData from '../data/time-series.json';

/**
 * Load a dataset by name
 * 
 * @param {string} datasetName - Name of the dataset to load
 * @returns {Promise<Array>} Promise resolving to the loaded data
 */
export function loadDataset(datasetName) {
  // Check for built-in datasets first
  switch (datasetName) {
    case 'sales':
      return Promise.resolve(salesData);
    case 'geographic':
      return Promise.resolve(geographicData);
    case 'timeseries':
      return Promise.resolve(timeSeriesData);
    default:
      // Try to load from URL if not a built-in dataset
      if (datasetName.startsWith('http') || datasetName.startsWith('/')) {
        return loadFromUrl(datasetName);
      }
      
      // Default to sales data if not found
      console.warn(`Dataset "${datasetName}" not found, using sales data as fallback`);
      return Promise.resolve(salesData);
  }
}

/**
 * Load data from a URL
 * 
 * @param {string} url - URL to load data from
 * @param {string} format - Data format ('json', 'csv', 'tsv', 'xml')
 * @returns {Promise<Array>} Promise resolving to the loaded data
 */
export function loadFromUrl(url, format) {
  // Determine format from URL if not specified
  if (!format) {
    const extension = url.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'json':
        format = 'json';
        break;
      case 'csv':
        format = 'csv';
        break;
      case 'tsv':
        format = 'tsv';
        break;
      case 'xml':
        format = 'xml';
        break;
      default:
        format = 'json'; // Default to JSON
    }
  }
  
  // Load data based on format
  switch (format) {
    case 'json':
      return d3.json(url);
    case 'csv':
      return d3.csv(url);
    case 'tsv':
      return d3.tsv(url);
    case 'xml':
      return d3.xml(url);
    default:
      return Promise.reject(new Error(`Unsupported format: ${format}`));
  }
}

/**
 * Load data from a file input element
 * 
 * @param {File} file - File object from input element
 * @returns {Promise<Array>} Promise resolving to the loaded data
 */
export function loadFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const extension = file.name.split('.').pop().toLowerCase();
        
        switch (extension) {
          case 'json':
            resolve(JSON.parse(event.target.result));
            break;
          case 'csv':
            resolve(d3.csvParse(event.target.result));
            break;
          case 'tsv':
            resolve(d3.tsvParse(event.target.result));
            break;
          default:
            reject(new Error(`Unsupported file format: ${extension}`));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Generate random data for testing
 * 
 * @param {number} count - Number of data points to generate
 * @param {string} type - Type of data to generate ('bar', 'line', 'scatter', 'pie')
 * @returns {Array} Generated data
 */
export function generateRandomData(count = 10, type = 'bar') {
  const data = [];
  
  switch (type) {
    case 'bar':
      // Generate bar chart data
      for (let i = 0; i < count; i++) {
        data.push({
          category: `Category ${i + 1}`,
          value: Math.floor(Math.random() * 100) + 20,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
        });
      }
      break;
      
    case 'line':
      // Generate line chart data (time series)
      const startDate = new Date();
      
      for (let i = 0; i < count; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 100) + 20
        });
      }
      break;
      
    case 'scatter':
      // Generate scatter plot data
      for (let i = 0; i < count; i++) {
        data.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 5,
          category: `Group ${Math.floor(Math.random() * 3) + 1}`
        });
      }
      break;
      
    case 'pie':
      // Generate pie chart data
      for (let i = 0; i < count; i++) {
        data.push({
          category: `Category ${i + 1}`,
          value: Math.floor(Math.random() * 100) + 10
        });
      }
      break;
      
    default:
      // Default to bar chart data
      return generateRandomData(count, 'bar');
  }
  
  return data;
}

/**
 * Parse CSV string into array of objects
 * 
 * @param {string} csvString - CSV string to parse
 * @param {boolean} hasHeader - Whether the CSV has a header row
 * @returns {Array} Parsed data
 */
export function parseCSV(csvString, hasHeader = true) {
  return hasHeader ? d3.csvParse(csvString) : d3.csvParseRows(csvString);
}

/**
 * Parse TSV string into array of objects
 * 
 * @param {string} tsvString - TSV string to parse
 * @param {boolean} hasHeader - Whether the TSV has a header row
 * @returns {Array} Parsed data
 */
export function parseTSV(tsvString, hasHeader = true) {
  return hasHeader ? d3.tsvParse(tsvString) : d3.tsvParseRows(tsvString);
}

