/**
 * Core DataVisualizer class
 * Main class for rendering and managing visualizations
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

import * as d3 from 'd3';

export class DataVisualizer {
  /**
   * Create a new DataVisualizer instance
   * 
   * @param {Object} options - Configuration options
   * @param {string} options.container - CSS selector for the container element
   * @param {number} options.width - Width of the visualization
   * @param {number} options.height - Height of the visualization
   * @param {boolean} options.responsive - Whether the visualization should be responsive
   * @param {Object} options.eventManager - Event manager instance
   * @param {Object} options.margin - Margin object with top, right, bottom, left properties
   */
  constructor(options) {
    this.container = options.container;
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.responsive = options.responsive !== undefined ? options.responsive : true;
    this.eventManager = options.eventManager;
    this.margin = options.margin || { top: 40, right: 40, bottom: 60, left: 60 };
    
    this.currentChart = null;
    this.currentData = null;
    this.svg = null;
    
    this.initialize();
  }
  
  /**
   * Initialize the visualization container
   * @private
   */
  initialize() {
    // Clear any existing content
    const containerElement = document.querySelector(this.container);
    if (!containerElement) {
      throw new Error(`Container element not found: ${this.container}`);
    }
    
    containerElement.innerHTML = '';
    
    // Create SVG element
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'visualization-svg');
    
    // Add a group for the visualization with margins applied
    this.chart = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    
    // Add groups for different chart elements
    this.axisGroup = this.chart.append('g').attr('class', 'axis-group');
    this.dataGroup = this.chart.append('g').attr('class', 'data-group');
    this.legendGroup = this.chart.append('g').attr('class', 'legend-group');
    this.annotationGroup = this.chart.append('g').attr('class', 'annotation-group');
    
    // Set up responsive behavior if enabled
    if (this.responsive) {
      this.setupResponsive();
    }
  }
  
  /**
   * Set up responsive behavior for the visualization
   * @private
   */
  setupResponsive() {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === document.querySelector(this.container)) {
          const { width, height } = entry.contentRect;
          this.resize(width, height);
        }
      }
    });
    
    resizeObserver.observe(document.querySelector(this.container));
  }
  
  /**
   * Render a chart
   * 
   * @param {Object} chart - The chart instance to render
   */
  render(chart) {
    if (!chart) {
      throw new Error('No chart provided to render');
    }
    
    // Store current chart and data
    this.currentChart = chart;
    this.currentData = chart.data;
    
    // Clear previous content
    this.dataGroup.selectAll('*').remove();
    this.axisGroup.selectAll('*').remove();
    this.legendGroup.selectAll('*').remove();
    this.annotationGroup.selectAll('*').remove();
    
    // Set chart dimensions
    chart.width = this.width - this.margin.left - this.margin.right;
    chart.height = this.height - this.margin.top - this.margin.bottom;
    
    // Set chart container elements
    chart.container = {
      svg: this.svg,
      chart: this.chart,
      axisGroup: this.axisGroup,
      dataGroup: this.dataGroup,
      legendGroup: this.legendGroup,
      annotationGroup: this.annotationGroup
    };
    
    // Render the chart
    chart.render();
    
    // Emit render event if event manager exists
    if (this.eventManager) {
      this.eventManager.emit('chart:rendered', {
        type: chart.type,
        data: chart.data
      });
    }
  }
  
  /**
   * Update the visualization with new data
   * 
   * @param {Array} data - New data to display
   */
  update(data) {
    if (!this.currentChart) {
      throw new Error('No chart has been rendered yet');
    }
    
    // Update current data
    this.currentData = data;
    this.currentChart.data = data;
    
    // Update the chart
    this.currentChart.update(data);
    
    // Emit update event if event manager exists
    if (this.eventManager) {
      this.eventManager.emit('chart:updated', {
        type: this.currentChart.type,
        data: data
      });
    }
  }
  
  /**
   * Resize the visualization
   * 
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    // Update dimensions
    this.width = width;
    this.height = height;
    
    // Update SVG size
    this.svg
      .attr('width', width)
      .attr('height', height);
    
    // Re-render current chart if exists
    if (this.currentChart) {
      this.currentChart.width = width - this.margin.left - this.margin.right;
      this.currentChart.height = height - this.margin.top - this.margin.bottom;
      this.currentChart.resize();
    }
    
    // Emit resize event if event manager exists
    if (this.eventManager) {
      this.eventManager.emit('chart:resized', {
        width: width,
        height: height
      });
    }
  }
  
  /**
   * Export the current chart as an image
   * 
   * @param {string} format - Export format (png, svg)
   * @returns {string} The exported chart data URL or SVG string
   */
  exportChart(format = 'png') {
    if (!this.svg) {
      throw new Error('No visualization to export');
    }
    
    if (format === 'svg') {
      // Export as SVG
      const svgString = new XMLSerializer().serializeToString(this.svg.node());
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      this.downloadFile(url, 'visualization.svg');
      return svgString;
    } else {
      // Export as PNG
      const svgString = new XMLSerializer().serializeToString(this.svg.node());
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Create a data URL from the SVG
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Return a promise that resolves with the data URL
      return new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png');
          this.downloadFile(pngUrl, 'visualization.png');
          URL.revokeObjectURL(url);
          resolve(pngUrl);
        };
        
        img.onerror = (error) => {
          URL.revokeObjectURL(url);
          reject(error);
        };
        
        img.src = url;
      });
    }
  }
  
  /**
   * Helper method to trigger file download
   * 
   * @private
   * @param {string} url - Data URL or object URL
   * @param {string} filename - Name for the downloaded file
   */
  downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  /**
   * Get the current data being displayed
   * 
   * @returns {Array} The current data
   */
  getCurrentData() {
    return this.currentData;
  }
  
  /**
   * Get the current chart instance
   * 
   * @returns {Object} The current chart
   */
  getCurrentChart() {
    return this.currentChart;
  }
  
  /**
   * Clean up resources when the visualizer is no longer needed
   */
  destroy() {
    // Remove SVG
    if (this.svg) {
      this.svg.remove();
    }
    
    // Clean up current chart if it has a destroy method
    if (this.currentChart && typeof this.currentChart.destroy === 'function') {
      this.currentChart.destroy();
    }
    
    // Clean up event listeners
    if (this.eventManager) {
      this.eventManager.removeAllListeners();
    }
    
    // Clear references
    this.svg = null;
    this.chart = null;
    this.axisGroup = null;
    this.dataGroup = null;
    this.legendGroup = null;
    this.annotationGroup = null;
    this.currentChart = null;
    this.currentData = null;
  }
}

