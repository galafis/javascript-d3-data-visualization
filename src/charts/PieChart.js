// PieChart.js: Implementação básica do gráfico de pizza conforme arquitetura especificada.
// Herdando BaseChart, compatível com Jest, e explicativamente documentado.

import BaseChart from './BaseChart.js';

/**
 * PieChart - Gráfico de pizza (pie chart) simples, pronto para extensão.
 */
export default class PieChart extends BaseChart {
  constructor(options = {}) {
    super(options);
    this.type = 'pie';
  }

  /**
   * Renderiza um gráfico de pizza SVG no container fornecido.
   */
  render() {
    const container = document.querySelector(this.options.container);
    if (!container) throw new Error('Container não encontrado!');

    container.innerHTML = '';

    const width = this.options.width || 300;
    const height = this.options.height || 300;
    const radius = Math.min(width, height) / 2 - 10;

    // Exemplo didático: fatias fixas, usando dados reais se existirem
    const data = Array.isArray(this.data) && this.data.length
      ? this.data
      : [
          { label: 'A', value: 30 },
          { label: 'B', value: 80 },
          { label: 'C', value: 40 },
        ];

    const total = data.reduce((sum, d) => sum + d.value, 0);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${width / 2},${height / 2})`);
    svg.appendChild(g);

    let startAngle = 0;
    data.forEach((d, i) => {
      const angle = (d.value / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      const x1 = radius * Math.cos(startAngle);
      const y1 = radius * Math.sin(startAngle);
      const x2 = radius * Math.cos(endAngle);
      const y2 = radius * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;

      // Path SVG para fatia de pizza
      const pathData = [
        `M 0 0`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `Z`
      ].join(' ');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', this.options.colors ? this.options.colors[i % this.options.colors.length] : ['#1f77b4','#ff7f0e','#2ca02c','#d62728', '#9467bd'][i % 5]);
      g.appendChild(path);

      // Opcional: label das fatias
      const midAngle = startAngle + angle / 2;
      const labelX = (radius / 1.5) * Math.cos(midAngle);
      const labelY = (radius / 1.5) * Math.sin(midAngle);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', '0.35em');
      label.textContent = d.label;
      g.appendChild(label);

      startAngle = endAngle;
    });

    container.appendChild(svg);
  }
}
