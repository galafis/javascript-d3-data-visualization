/**
 * BaseChart class
 * Base class for all chart types
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */
export default class BaseChart {
  /**
   * Create a new BaseChart instance
   * 
   * @param {Object} options - Chart configuration options
   */
  constructor(options = {}) {
    // Set default options
    this.options = {
      // Data mapping
      x: 'x',
      y: 'y',
      
      // Visual options
      color: '#1f77b4',
      colorField: null,
      colorPalette: null,
      
      // Axes
      xAxisLabel: null,
      yAxisLabel: null,
      
      // Features
      tooltip: true,
      legend: false,
      grid: false,
      labels: false,
      
      // Animation
      animation: {
        duration: 1000,
        easing: 'easeLinear'
      },
      
      // Merge with provided options
      ...options
    };
    
    // Set chart type (to be overridden by subclasses)
    this.type = 'base';
    
    // Set data
    this.data = options.data || [];
    
    // Chart dimensions (to be set by DataVisualizer)
    this.width = 0;
    this.height = 0;
    
    // Container elements (to be set by DataVisualizer)
    this.container = null;
    
    // Scales (to be set by subclasses)
    this.xScale = null;
    this.yScale = null;
    this.colorScale = null;
  }
  
  /**
   * Render the chart
   * Base implementation to be overridden by subclasses
   */
  render() {
    if (!this.container) {
      throw new Error('Chart container not set');
    }
    
    if (!this.data || this.data.length === 0) {
      this.renderNoDataMessage();
      return;
    }
  }
  
  /**
   * Update the chart with new data
   * Base implementation to be overridden by subclasses
   * 
   * @param {Array} newData - New data to display
   */
  update(newData) {
    this.data = newData;
  }
  
  /**
   * Resize the chart
   * Base implementation to be overridden by subclasses
   */
  resize() {
    // To be implemented by subclasses
  }
  
  /**
   * Draw the chart legend
   * 
   * @param {Object} options - Legend options
   */
  drawLegend(options = {}) {
    const { legendGroup } = this.container;
    const { colorField, colorPalette } = this.options;
    
    // Only draw legend if color mapping is provided
    if (!colorField || !this.colorScale) {
      return;
    }
    
    // Get unique color categories
    const categories = [...new Set(this.data.map(d => d[colorField]))];
    
    // Default legend options
    const legendOpts = {
      position: 'bottom', // 'top', 'right', 'bottom', 'left'
      orientation: 'horizontal', // 'horizontal', 'vertical'
      itemWidth: 80,
      itemHeight: 20,
      itemSpacing: 10,
      symbolSize: 12,
      ...options
    };
    
    // Calculate legend dimensions and position
    const { width, height } = this;
    let legendX, legendY;
    
    if (legendOpts.position === 'bottom') {
      legendX = width / 2;
      legendY = height + 40;
    } else if (legendOpts.position === 'top') {
      legendX = width / 2;
      legendY = -40;
    } else if (legendOpts.position === 'right') {
      legendX = width + 20;
      legendY = height / 2;
    } else if (legendOpts.position === 'left') {
      legendX = -20;
      legendY = height / 2;
    }
    
    // Create legend container
    const legend = legendGroup.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendX}, ${legendY})`);
    
    // Create legend items
    const items = legend.selectAll('.legend-item')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => {
        if (legendOpts.orientation === 'horizontal') {
          return `translate(${i * (legendOpts.itemWidth + legendOpts.itemSpacing) - (categories.length * legendOpts.itemWidth) / 2}, 0)`;
        } else {
          return `translate(0, ${i * legendOpts.itemHeight})`;
        }
      });
    
    // Add color symbols
    items.append('rect')
      .attr('width', legendOpts.symbolSize)
      .attr('height', legendOpts.symbolSize)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('fill', d => this.colorScale(d));
    
    // Add text labels
    items.append('text')
      .attr('x', legendOpts.symbolSize + 5)
      .attr('y', legendOpts.symbolSize / 2)
      .attr('dy', '0.35em')
      .text(d => d)
      .attr('font-size', '12px');
    
    // Add interactivity
    items.on('click', (event, d) => {
      // Toggle active state
      const item = d3.select(event.currentTarget);
      const isActive = !item.classed('inactive');
      
      item.classed('inactive', isActive);
      
      // Filter data based on active categories
      this.filterByLegend();
    });
  }
  
  /**
   * Filter data based on active legend items
   * @private
   */
  filterByLegend() {
    const { colorField } = this.options;
    const { dataGroup } = this.container;
    
    // Get inactive categories
    const inactiveCategories = [];
    d3.selectAll('.legend-item.inactive').each(function() {
      inactiveCategories.push(d3.select(this).datum());
    });
    
    // Filter data elements
    dataGroup.selectAll('.bar, .line, .point, .slice, .area')
      .style('opacity', d => {
        return inactiveCategories.includes(d[colorField]) ? 0.2 : 1;
      });
  }
  
  /**
   * Render a message when no data is available
   * @private
   */
  renderNoDataMessage() {
    const { chart } = this.container;
    const { width, height } = this;
    
    chart.append('text')
      .attr('class', 'no-data-message')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .text('No data available');
  }
  
  /**
   * Clean up resources when the chart is no longer needed
   */
  destroy() {
    // Remove event listeners and clean up resources
    // To be implemented by subclasses if needed
  }
}
