/**
 * Heatmap class
 * Creates a heat map visualization with colored matrix cells
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */
import BaseChart from './BaseChart.js';
import * as d3 from 'd3';

/**
 * Heatmap class extends BaseChart to create heat map visualizations
 * Displays data as a matrix of colored cells where color intensity represents values
 */
export default class Heatmap extends BaseChart {
  /**
   * Create a new Heatmap instance
   * 
   * @param {Object} options - Chart configuration options
   * @param {Array} options.data - Array of data objects
   * @param {string} [options.xField='x'] - Field name for x-axis categories
   * @param {string} [options.yField='y'] - Field name for y-axis categories  
   * @param {string} [options.valueField='value'] - Field name for cell values
   * @param {Array} [options.colorRange] - Custom color range for heatmap
   * @param {Object} [options.cell] - Cell styling options
   */
  constructor(options = {}) {
    // Set default heatmap-specific options
    const heatmapDefaults = {
      xField: 'x',
      yField: 'y', 
      valueField: 'value',
      colorRange: ['#f7fbff', '#08519c'], // Light blue to dark blue
      cell: {
        stroke: '#fff',
        strokeWidth: 1,
        rx: 0, // Rounded corners
        ry: 0
      },
      tooltip: true,
      legend: true
    };
    
    // Merge defaults with provided options
    super({ ...heatmapDefaults, ...options });
    
    // Set chart type
    this.type = 'heatmap';
    
    // Initialize with sample data if no data provided
    if (!this.data || this.data.length === 0) {
      this.data = this.generateSampleData();
    }
    
    // Initialize scales
    this.xScale = null;
    this.yScale = null;
    this.colorScale = null;
  }
  
  /**
   * Generate sample heatmap data for demonstration
   * Creates a 7x5 matrix representing days of week vs hours
   * 
   * @returns {Array} Array of data objects with x, y, and value properties
   */
  generateSampleData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['9AM', '11AM', '1PM', '3PM', '5PM'];
    const data = [];
    
    // Generate random values for each day/hour combination
    days.forEach(day => {
      hours.forEach(hour => {
        data.push({
          x: day,
          y: hour, 
          value: Math.floor(Math.random() * 100) // Random value 0-99
        });
      });
    });
    
    return data;
  }
  
  /**
   * Create and configure scales for the heatmap
   * Sets up x/y band scales and color scale based on data
   * 
   * @private
   */
  createScales() {
    const { xField, yField, valueField, colorRange } = this.options;
    const margin = { top: 50, right: 80, bottom: 50, left: 80 };
    
    // Calculate available space
    const chartWidth = this.width - margin.left - margin.right;
    const chartHeight = this.height - margin.top - margin.bottom;
    
    // Get unique values for x and y domains
    const xDomain = [...new Set(this.data.map(d => d[xField]))];
    const yDomain = [...new Set(this.data.map(d => d[yField]))]; 
    
    // Create band scales for positioning cells
    this.xScale = d3.scaleBand()
      .domain(xDomain)
      .range([0, chartWidth])
      .padding(0.1);
      
    this.yScale = d3.scaleBand()
      .domain(yDomain)
      .range([0, chartHeight])
      .padding(0.1);
    
    // Create color scale based on value range
    const valueExtent = d3.extent(this.data, d => d[valueField]);
    this.colorScale = d3.scaleSequential()
      .domain(valueExtent)
      .interpolator(d3.interpolateBlues);
      
    // Use custom color range if provided
    if (colorRange && colorRange.length >= 2) {
      this.colorScale = d3.scaleLinear()
        .domain(valueExtent)
        .range(colorRange);
    }
  }
  
  /**
   * Render the heatmap visualization
   * Creates SVG elements and draws the heatmap cells with colors based on values
   */
  render() {
    // Call parent render method for base setup
    super.render();
    
    if (!this.data || this.data.length === 0) {
      return;
    }
    
    // Create scales
    this.createScales();
    
    const { dataGroup } = this.container;
    const { xField, yField, valueField, cell, tooltip } = this.options;
    const margin = { top: 50, right: 80, bottom: 50, left: 80 };
    
    // Set up container transform
    dataGroup.attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Create tooltip div if enabled
    let tooltipDiv = null;
    if (tooltip) {
      tooltipDiv = d3.select('body').append('div')
        .attr('class', 'heatmap-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', '1000');
    }
    
    // Draw heatmap cells
    const cells = dataGroup.selectAll('.heatmap-cell')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-cell')
      .attr('x', d => this.xScale(d[xField]))
      .attr('y', d => this.yScale(d[yField]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', this.yScale.bandwidth())
      .attr('rx', cell.rx)
      .attr('ry', cell.ry)
      .attr('fill', d => this.colorScale(d[valueField]))
      .attr('stroke', cell.stroke)
      .attr('stroke-width', cell.strokeWidth);
      
    // Add tooltip interactions if enabled
    if (tooltip && tooltipDiv) {
      cells
        .on('mouseover', (event, d) => {
          tooltipDiv
            .style('visibility', 'visible')
            .html(`${d[xField]} - ${d[yField]}<br/>Value: ${d[valueField]}`);
        })
        .on('mousemove', (event) => {
          tooltipDiv
            .style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', () => {
          tooltipDiv.style('visibility', 'hidden');
        });
    }
    
    // Draw axes
    this.drawAxes(margin);
    
    // Draw legend if enabled
    if (this.options.legend) {
      this.drawColorLegend(margin);
    }
  }
  
  /**
   * Draw x and y axes for the heatmap
   * 
   * @param {Object} margin - Margin object with top, right, bottom, left
   * @private
   */
  drawAxes(margin) {
    const { chart } = this.container;
    const chartHeight = this.height - margin.top - margin.bottom;
    
    // X-axis
    const xAxis = d3.axisBottom(this.xScale);
    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${margin.left}, ${margin.top + chartHeight})`)
      .call(xAxis);
    
    // Y-axis 
    const yAxis = d3.axisLeft(this.yScale);
    chart.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);
      
    // Add axis labels if specified
    if (this.options.xAxisLabel) {
      chart.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', margin.left + (this.width - margin.left - margin.right) / 2)
        .attr('y', this.height - 10)
        .text(this.options.xAxisLabel);
    }
    
    if (this.options.yAxisLabel) {
      chart.append('text')
        .attr('class', 'y-axis-label')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(margin.top + chartHeight / 2))
        .attr('y', 20)
        .text(this.options.yAxisLabel);
    }
  }
  
  /**
   * Draw color legend for the heatmap
   * Shows the color scale mapping values to colors
   * 
   * @param {Object} margin - Margin object
   * @private  
   */
  drawColorLegend(margin) {
    const { chart } = this.container;
    const { valueField } = this.options;
    
    // Legend dimensions
    const legendWidth = 200;
    const legendHeight = 20;
    const legendX = this.width - margin.right + 20;
    const legendY = margin.top;
    
    // Create gradient for legend
    const defs = chart.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'heatmap-legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');
    
    // Add color stops to gradient
    const colorStops = 10;
    for (let i = 0; i <= colorStops; i++) {
      const offset = i / colorStops;
      const value = d3.min(this.data, d => d[valueField]) + 
        offset * (d3.max(this.data, d => d[valueField]) - d3.min(this.data, d => d[valueField]));
      
      gradient.append('stop')
        .attr('offset', `${offset * 100}%`)
        .attr('stop-color', this.colorScale(value));
    }
    
    // Draw legend rectangle
    chart.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', 'url(#heatmap-legend-gradient)')
      .attr('stroke', '#ccc');
    
    // Add legend labels
    const valueExtent = d3.extent(this.data, d => d[valueField]);
    
    chart.append('text')
      .attr('x', legendX)
      .attr('y', legendY - 5)
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .text(valueExtent[0]);
      
    chart.append('text')
      .attr('x', legendX + legendWidth)
      .attr('y', legendY - 5)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .text(valueExtent[1]);
      
    chart.append('text')
      .attr('x', legendX + legendWidth / 2)
      .attr('y', legendY + legendHeight + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Value');
  }
  
  /**
   * Update the heatmap with new data
   * Redraws the visualization with new data while maintaining smooth transitions
   * 
   * @param {Array} newData - New dataset to visualize
   */
  update(newData) {
    // Update data
    super.update(newData);
    
    // Re-render with new data
    if (this.container) {
      this.container.chart.selectAll('*').remove();
      this.render();
    }
  }
  
  /**
   * Resize the heatmap chart
   * Adjusts dimensions and redraws the visualization
   */
  resize() {
    super.resize();
    
    // Re-render with new dimensions
    if (this.container && this.data) {
      this.container.chart.selectAll('*').remove();
      this.render();
    }
  }
  
  /**
   * Clean up resources when chart is destroyed
   * Removes tooltips and event listeners
   */
  destroy() {
    super.destroy();
    
    // Remove tooltip if it exists
    d3.select('body').selectAll('.heatmap-tooltip').remove();
  }
}
