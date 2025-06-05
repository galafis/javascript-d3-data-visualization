/**
 * BarChart class
 * Implements a bar chart visualization
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

import * as d3 from 'd3';
import { BaseChart } from './BaseChart';

export class BarChart extends BaseChart {
  /**
   * Create a new BarChart instance
   * 
   * @param {Object} options - Chart configuration options
   */
  constructor(options) {
    super(options);
    
    // Set chart type
    this.type = 'bar';
    
    // Default options specific to bar charts
    this.options = {
      ...this.options,
      horizontal: false,
      barPadding: 0.1,
      cornerRadius: 0,
      sortBars: false,
      sortDirection: 'ascending',
      ...options
    };
  }
  
  /**
   * Render the bar chart
   */
  render() {
    // Call parent render method
    super.render();
    
    // Extract container elements
    const { chart, dataGroup, axisGroup } = this.container;
    
    // Process data
    const data = this.processData();
    
    // Set up scales
    this.setupScales(data);
    
    // Draw axes
    this.drawAxes(axisGroup);
    
    // Draw bars
    this.drawBars(dataGroup, data);
    
    // Add labels if enabled
    if (this.options.labels) {
      this.addLabels(dataGroup, data);
    }
    
    // Add legend if enabled
    if (this.options.legend) {
      this.drawLegend();
    }
    
    // Add tooltips if enabled
    if (this.options.tooltip) {
      this.setupTooltips();
    }
  }
  
  /**
   * Process data for the bar chart
   * 
   * @returns {Array} Processed data
   */
  processData() {
    let data = [...this.data];
    
    // Sort data if enabled
    if (this.options.sortBars) {
      data.sort((a, b) => {
        const valueA = a[this.options.y];
        const valueB = b[this.options.y];
        
        if (this.options.sortDirection === 'ascending') {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      });
    }
    
    return data;
  }
  
  /**
   * Set up scales for the chart
   * 
   * @param {Array} data - Processed data
   */
  setupScales(data) {
    const { width, height } = this;
    const { x: xKey, y: yKey, horizontal } = this.options;
    
    if (horizontal) {
      // For horizontal bars
      this.xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yKey])])
        .range([0, width])
        .nice();
      
      this.yScale = d3.scaleBand()
        .domain(data.map(d => d[xKey]))
        .range([0, height])
        .padding(this.options.barPadding);
    } else {
      // For vertical bars
      this.xScale = d3.scaleBand()
        .domain(data.map(d => d[xKey]))
        .range([0, width])
        .padding(this.options.barPadding);
      
      this.yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yKey])])
        .range([height, 0])
        .nice();
    }
    
    // Set up color scale if color mapping is provided
    if (this.options.colorField) {
      const colorDomain = [...new Set(data.map(d => d[this.options.colorField]))];
      
      this.colorScale = d3.scaleOrdinal()
        .domain(colorDomain)
        .range(this.options.colorPalette || d3.schemeCategory10);
    }
  }
  
  /**
   * Draw chart axes
   * 
   * @param {Selection} axisGroup - D3 selection for axes
   */
  drawAxes(axisGroup) {
    const { width, height } = this;
    const { horizontal, xAxisLabel, yAxisLabel } = this.options;
    
    if (horizontal) {
      // X-axis (values)
      const xAxis = d3.axisBottom(this.xScale);
      axisGroup.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);
      
      // Y-axis (categories)
      const yAxis = d3.axisLeft(this.yScale);
      axisGroup.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    } else {
      // X-axis (categories)
      const xAxis = d3.axisBottom(this.xScale);
      axisGroup.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);
      
      // Y-axis (values)
      const yAxis = d3.axisLeft(this.yScale);
      axisGroup.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    }
    
    // Add axis labels if provided
    if (xAxisLabel) {
      axisGroup.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .text(xAxisLabel);
    }
    
    if (yAxisLabel) {
      axisGroup.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .text(yAxisLabel);
    }
    
    // Add grid lines if enabled
    if (this.options.grid) {
      this.addGridLines(axisGroup);
    }
  }
  
  /**
   * Draw the bars
   * 
   * @param {Selection} dataGroup - D3 selection for data elements
   * @param {Array} data - Processed data
   */
  drawBars(dataGroup, data) {
    const { x: xKey, y: yKey, horizontal, colorField, color } = this.options;
    const { height } = this;
    
    // Create bars
    const bars = dataGroup.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', d => {
        if (colorField) {
          return this.colorScale(d[colorField]);
        }
        return color || '#1f77b4';
      });
    
    // Position and size bars
    if (horizontal) {
      bars
        .attr('x', 0)
        .attr('y', d => this.yScale(d[xKey]))
        .attr('height', this.yScale.bandwidth())
        .attr('width', 0) // Start with zero width for animation
        .transition()
        .duration(this.options.animation?.duration || 0)
        .ease(d3[this.options.animation?.easing || 'easeLinear'])
        .attr('width', d => this.xScale(d[yKey]));
    } else {
      bars
        .attr('x', d => this.xScale(d[xKey]))
        .attr('y', height) // Start at the bottom for animation
        .attr('width', this.xScale.bandwidth())
        .attr('height', 0) // Start with zero height for animation
        .transition()
        .duration(this.options.animation?.duration || 0)
        .ease(d3[this.options.animation?.easing || 'easeLinear'])
        .attr('y', d => this.yScale(d[yKey]))
        .attr('height', d => height - this.yScale(d[yKey]));
    }
    
    // Add rounded corners if specified
    if (this.options.cornerRadius > 0) {
      bars.attr('rx', this.options.cornerRadius)
          .attr('ry', this.options.cornerRadius);
    }
  }
  
  /**
   * Add data labels to bars
   * 
   * @param {Selection} dataGroup - D3 selection for data elements
   * @param {Array} data - Processed data
   */
  addLabels(dataGroup, data) {
    const { x: xKey, y: yKey, horizontal, labelFormat } = this.options;
    const { height } = this;
    
    // Format function for labels
    const format = labelFormat ? d3.format(labelFormat) : d => d;
    
    // Create labels
    const labels = dataGroup.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .text(d => format(d[yKey]))
      .attr('text-anchor', horizontal ? 'start' : 'middle')
      .attr('fill', this.options.labelColor || '#333');
    
    // Position labels
    if (horizontal) {
      labels
        .attr('x', d => this.xScale(d[yKey]) + 5)
        .attr('y', d => this.yScale(d[xKey]) + this.yScale.bandwidth() / 2)
        .attr('dy', '0.35em');
    } else {
      labels
        .attr('x', d => this.xScale(d[xKey]) + this.xScale.bandwidth() / 2)
        .attr('y', d => this.yScale(d[yKey]) - 5)
        .attr('dy', '0.35em');
    }
  }
  
  /**
   * Add grid lines to the chart
   * 
   * @param {Selection} axisGroup - D3 selection for axes
   */
  addGridLines(axisGroup) {
    const { width, height } = this;
    const { horizontal } = this.options;
    
    if (horizontal) {
      // Horizontal grid lines (for x-axis values)
      axisGroup.append('g')
        .attr('class', 'grid')
        .call(
          d3.axisBottom(this.xScale)
            .tickSize(height)
            .tickFormat('')
        );
    } else {
      // Vertical grid lines (for y-axis values)
      axisGroup.append('g')
        .attr('class', 'grid')
        .call(
          d3.axisLeft(this.yScale)
            .tickSize(-width)
            .tickFormat('')
        );
    }
  }
  
  /**
   * Set up tooltips for bars
   */
  setupTooltips() {
    const { x: xKey, y: yKey, tooltipFormat } = this.options;
    
    // Format function for tooltip values
    const format = tooltipFormat ? d3.format(tooltipFormat) : d => d;
    
    // Create tooltip div if it doesn't exist
    let tooltip = d3.select('body').select('.tooltip');
    if (tooltip.empty()) {
      tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    }
    
    // Add tooltip behavior to bars
    this.container.dataGroup.selectAll('.bar')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        
        tooltip.html(`
          <div class="tooltip-title">${d[xKey]}</div>
          <div class="tooltip-value">
            <span class="tooltip-label">${yKey}:</span>
            <span>${format(d[yKey])}</span>
          </div>
        `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
  }
  
  /**
   * Update the chart with new data
   * 
   * @param {Array} newData - New data to display
   */
  update(newData) {
    this.data = newData;
    
    // Clear existing content
    this.container.dataGroup.selectAll('*').remove();
    this.container.axisGroup.selectAll('*').remove();
    
    // Re-render with new data
    this.render();
  }
  
  /**
   * Resize the chart
   */
  resize() {
    // Clear existing content
    this.container.dataGroup.selectAll('*').remove();
    this.container.axisGroup.selectAll('*').remove();
    
    // Re-render with new dimensions
    this.render();
  }
}

