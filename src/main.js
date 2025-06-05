/**
 * Main entry point for the D3 Data Visualization Platform
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

// Import styles
import './styles/main.css';
import './styles/charts.css';

// Import core modules
import { DataVisualizer } from './core/DataVisualizer';
import { DataProcessor } from './core/DataProcessor';
import { EventManager } from './core/EventManager';

// Import chart modules
import { ChartFactory } from './charts/ChartFactory';

// Import utility modules
import { loadDataset } from './utils/dataLoader';
import { generateStatistics } from './utils/statistics';
import { formatNumber, formatDate, formatPercentage } from './utils/formatters';

// Import sample datasets
import salesData from './data/sales-data.json';
import geographicData from './data/geographic-data.json';
import timeSeriesData from './data/time-series.json';

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
  console.log('Initializing D3 Data Visualization Platform...');
  
  // Initialize core components
  const eventManager = new EventManager();
  const dataProcessor = new DataProcessor();
  
  // Initialize visualizer with default configuration
  const visualizer = new DataVisualizer({
    container: '#chart-area',
    width: document.getElementById('chart-area').clientWidth,
    height: document.getElementById('chart-area').clientHeight,
    responsive: true,
    eventManager: eventManager
  });
  
  // Register available chart types
  registerChartTypes();
  
  // Load initial dataset
  const initialDataset = dataProcessor.process(salesData);
  
  // Create initial chart
  const barChart = ChartFactory.create('bar', {
    data: initialDataset,
    x: 'category',
    y: 'value',
    color: 'steelblue',
    animation: {
      duration: 1000,
      easing: 'cubic-in-out'
    }
  });
  
  // Render initial chart
  visualizer.render(barChart);
  
  // Display data statistics
  updateDataStatistics(initialDataset);
  
  // Set up event listeners
  setupEventListeners(visualizer, dataProcessor, eventManager);
  
  // Initialize advanced features
  initializeAdvancedFeatures(visualizer, dataProcessor, eventManager);
  
  console.log('Application initialized successfully');
}

/**
 * Register available chart types with the ChartFactory
 */
function registerChartTypes() {
  // Import chart types dynamically to avoid circular dependencies
  import('./charts/BarChart').then(module => {
    ChartFactory.register('bar', module.BarChart);
  });
  
  import('./charts/LineChart').then(module => {
    ChartFactory.register('line', module.LineChart);
  });
  
  import('./charts/ScatterPlot').then(module => {
    ChartFactory.register('scatter', module.ScatterPlot);
  });
  
  import('./charts/PieChart').then(module => {
    ChartFactory.register('pie', module.PieChart);
  });
  
  import('./charts/Heatmap').then(module => {
    ChartFactory.register('heatmap', module.Heatmap);
  });
  
  import('./charts/GeographicMap').then(module => {
    ChartFactory.register('geographic', module.GeographicMap);
  });
  
  import('./charts/RealTimeChart').then(module => {
    ChartFactory.register('realtime', module.RealTimeChart);
  });
  
  import('./charts/WebGL3DChart').then(module => {
    ChartFactory.register('webgl3d', module.WebGL3DChart);
  });
}

/**
 * Set up event listeners for user interactions
 * 
 * @param {DataVisualizer} visualizer - The main visualizer instance
 * @param {DataProcessor} dataProcessor - The data processor instance
 * @param {EventManager} eventManager - The event manager instance
 */
function setupEventListeners(visualizer, dataProcessor, eventManager) {
  // Dataset selection change
  document.getElementById('dataset-select').addEventListener('change', (e) => {
    const datasetType = e.target.value;
    loadDataset(datasetType)
      .then(data => {
        const processedData = dataProcessor.process(data);
        updateChart(visualizer, processedData);
        updateDataStatistics(processedData);
      })
      .catch(error => {
        console.error('Error loading dataset:', error);
        showError('Failed to load dataset');
      });
  });
  
  // Chart type selection change
  document.getElementById('chart-type').addEventListener('change', (e) => {
    const chartType = e.target.value;
    const currentData = visualizer.getCurrentData();
    
    if (currentData) {
      const newChart = ChartFactory.create(chartType, {
        data: currentData,
        x: 'category',
        y: 'value',
        animation: {
          duration: 1000,
          easing: 'cubic-in-out'
        }
      });
      
      visualizer.render(newChart);
    }
  });
  
  // Update button click
  document.getElementById('update-btn').addEventListener('click', () => {
    const currentData = visualizer.getCurrentData();
    if (currentData) {
      // Simulate data update
      const updatedData = dataProcessor.updateRandomValues(currentData);
      updateChart(visualizer, updatedData);
      updateDataStatistics(updatedData);
    }
  });
  
  // Export button click
  document.getElementById('export-btn').addEventListener('click', () => {
    visualizer.exportChart();
  });
  
  // Navigation menu clicks
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.getAttribute('data-section');
      
      if (section === 'basic') {
        document.getElementById('visualization-container').classList.remove('hidden');
        document.getElementById('advanced-features').classList.add('hidden');
      } else if (section === 'advanced' || section === 'realtime' || 
                section === 'geographic' || section === '3d') {
        document.getElementById('visualization-container').classList.add('hidden');
        document.getElementById('advanced-features').classList.remove('hidden');
        
        // Initialize specific advanced feature
        initializeSpecificFeature(section, visualizer, dataProcessor);
      }
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    visualizer.resize(
      document.getElementById('chart-area').clientWidth,
      document.getElementById('chart-area').clientHeight
    );
  });
}

/**
 * Initialize advanced visualization features
 * 
 * @param {DataVisualizer} visualizer - The main visualizer instance
 * @param {DataProcessor} dataProcessor - The data processor instance
 * @param {EventManager} eventManager - The event manager instance
 */
function initializeAdvancedFeatures(visualizer, dataProcessor, eventManager) {
  // Real-time data streaming
  const toggleStreamBtn = document.getElementById('toggle-stream');
  let streamingChart = null;
  let isStreaming = false;
  
  toggleStreamBtn.addEventListener('click', () => {
    if (!isStreaming) {
      // Start streaming
      import('./charts/RealTimeChart').then(module => {
        const RealTimeChart = module.RealTimeChart;
        
        streamingChart = new RealTimeChart({
          container: '#realtime-chart',
          bufferSize: 100,
          updateInterval: 1000,
          yDomain: [0, 100]
        });
        
        streamingChart.start();
        toggleStreamBtn.textContent = 'Stop Stream';
        isStreaming = true;
      });
    } else {
      // Stop streaming
      if (streamingChart) {
        streamingChart.stop();
        toggleStreamBtn.textContent = 'Start Stream';
        isStreaming = false;
      }
    }
  });
  
  // Initialize geographic map
  import('./charts/GeographicMap').then(module => {
    const GeographicMap = module.GeographicMap;
    
    const geoMap = new GeographicMap({
      container: '#geo-chart',
      data: geographicData,
      projection: 'geoNaturalEarth1',
      colorScale: d3.scaleSequential(d3.interpolateBlues),
      tooltip: true
    });
    
    geoMap.render();
  });
  
  // Initialize 3D visualization
  import('./charts/WebGL3DChart').then(module => {
    const WebGL3DChart = module.WebGL3DChart;
    
    // Generate some 3D data
    const points3D = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      z: Math.random() * 100 - 50,
      value: Math.random() * 100,
      category: Math.floor(Math.random() * 3)
    }));
    
    const webgl3DChart = new WebGL3DChart({
      container: '#webgl-chart',
      data: points3D,
      x: 'x',
      y: 'y',
      z: 'z',
      color: 'category',
      size: 'value'
    });
    
    webgl3DChart.render();
  });
}

/**
 * Initialize a specific advanced feature
 * 
 * @param {string} featureType - The type of feature to initialize
 * @param {DataVisualizer} visualizer - The main visualizer instance
 * @param {DataProcessor} dataProcessor - The data processor instance
 */
function initializeSpecificFeature(featureType, visualizer, dataProcessor) {
  // Implementation for specific feature initialization
  console.log(`Initializing ${featureType} feature...`);
  
  // Feature-specific initialization would go here
}

/**
 * Update the current chart with new data
 * 
 * @param {DataVisualizer} visualizer - The visualizer instance
 * @param {Array} data - The new data to display
 */
function updateChart(visualizer, data) {
  const chartType = document.getElementById('chart-type').value;
  
  const chart = ChartFactory.create(chartType, {
    data: data,
    x: 'category',
    y: 'value',
    animation: {
      duration: 1000,
      easing: 'cubic-in-out'
    }
  });
  
  visualizer.render(chart);
}

/**
 * Update the data statistics panel
 * 
 * @param {Array} data - The data to analyze
 */
function updateDataStatistics(data) {
  const statsContainer = document.getElementById('data-statistics');
  const stats = generateStatistics(data);
  
  let statsHTML = '';
  
  for (const [key, value] of Object.entries(stats)) {
    statsHTML += `
      <div class="stat-item">
        <span class="stat-label">${key}:</span>
        <span class="stat-value">${formatStatValue(key, value)}</span>
      </div>
    `;
  }
  
  statsContainer.innerHTML = statsHTML;
}

/**
 * Format a statistical value based on its type
 * 
 * @param {string} key - The statistic name
 * @param {*} value - The value to format
 * @returns {string} The formatted value
 */
function formatStatValue(key, value) {
  if (key.includes('count')) {
    return formatNumber(value, 0);
  } else if (key.includes('percentage') || key.includes('ratio')) {
    return formatPercentage(value);
  } else if (key.includes('date')) {
    return formatDate(value);
  } else if (typeof value === 'number') {
    return formatNumber(value, 2);
  }
  
  return value;
}

/**
 * Show an error message
 * 
 * @param {string} message - The error message to display
 */
function showError(message) {
  const chartArea = document.getElementById('chart-area');
  
  const errorElement = document.createElement('div');
  errorElement.className = 'chart-error';
  errorElement.innerHTML = `
    <div class="chart-error-icon">⚠️</div>
    <div class="chart-error-message">${message}</div>
  `;
  
  chartArea.innerHTML = '';
  chartArea.appendChild(errorElement);
}

