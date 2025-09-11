// RealTimeChart.js: Simulação básica de gráfico em tempo real (linha animada ou barras),
// herdando BaseChart. Pronto para extensão com WebSockets ou atualizações de API reais.

import BaseChart from './BaseChart.js';

/**
 * RealTimeChart - Gráfico que simula atualização de dados ao vivo.
 * Exemplo: gráfico de linha com atualização periódica simulada.
 */
export default class RealTimeChart extends BaseChart {
  constructor(options = {}) {
    super(options);
    this.type = 'realtime';
    this.timer = null;
    // Estado local para simulação
    this._mockData = Array.isArray(options.data) ? options.data : this.generateInitialData();
  }

  /**
   * Gera uma série temporal didática inicial.
   */
  generateInitialData() {
    // Exemplo: série de 30 pontos aleatórios
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({ time: i, value: 50 + Math.random() * 50 });
    }
    return data;
  }

  /**
   * Cria ou atualiza o gráfico e inicia o timer de simulação.
   */
  render() {
    const container = document.querySelector(this.options.container);
    if (!container) throw new Error('Container não encontrado!');

    container.innerHTML = '';

    const width = this.options.width || 400;
    const height = this.options.height || 200;
    const data = this._mockData;

    // SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    // Path linha
    const maxValue = Math.max(...data.map(d => d.value), 100);
    const minValue = Math.min(...data.map(d => d.value), 0);

    function scaleX(t) { return (t / (data.length - 1)) * (width - 30) + 20; }
    function scaleY(v) { return height - 20 - ((v - minValue) / (maxValue - minValue)) * (height - 40); }

    let pathD = `M ${scaleX(0)} ${scaleY(data[0].value)}`;
    for (let i = 1; i < data.length; i++) {
      pathD += ` L ${scaleX(i)} ${scaleY(data[i].value)}`;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('stroke', this.options.color || '#e377c2');
    path.setAttribute('stroke-width', 2.5);
    path.setAttribute('fill', 'none');
    svg.appendChild(path);

    // Pontos
    data.forEach((d, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', scaleX(i));
      circle.setAttribute('cy', scaleY(d.value));
      circle.setAttribute('r', 3);
      circle.setAttribute('fill', '#222');
      svg.appendChild(circle);
    });

    // Eixo X e Y simplificados
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 20); xAxis.setAttribute('y1', height - 20);
    xAxis.setAttribute('x2', width - 10); xAxis.setAttribute('y2', height - 20);
    xAxis.setAttribute('stroke', '#bbb');
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 20); yAxis.setAttribute('y1', height - 20);
    yAxis.setAttribute('x2', 20); yAxis.setAttribute('y2', 20);
    yAxis.setAttribute('stroke', '#bbb');
    svg.appendChild(yAxis);

    container.appendChild(svg);

    // Inicia/atualiza timer de "streaming"
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      // Simulação: retira o ponto mais antigo, insere novo valor aleatório
      this._mockData.shift();
      this._mockData.push({ time: this._mockData[this._mockData.length - 1].time + 1, value: 50 + Math.random() * 50 });
      this.render();
    }, 1500);
  }

  /**
   * Desativa a atualização contínua.
   */
  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
