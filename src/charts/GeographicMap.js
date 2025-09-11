// GeographicMap.js: Gráfico geográfico básico, ideal para evolução futura com projeções e GeoJSON.
// Herdando BaseChart, compatível com Jest.

import BaseChart from './BaseChart.js';

/**
 * GeographicMap - Exemplo didático de mapa geográfico em SVG.
 * Exibe círculos representando cidades/Estados com base em dados de localização aproximados.
 */
export default class GeographicMap extends BaseChart {
  constructor(options = {}) {
    super(options);
    this.type = 'geographic';
  }

  /**
   * Renderiza um mapa SVG simulado usando círculos em coordenadas aproximadas.
   */
  render() {
    const container = document.querySelector(this.options.container);
    if (!container) throw new Error('Container não encontrado!');

    container.innerHTML = '';

    const width = this.options.width || 400;
    const height = this.options.height || 300;

    // Dados simulados: "nome" da cidade/estado, "lat", "lon", "valor/opcional"
    const data = Array.isArray(this.data) && this.data.length
      ? this.data
      : [
          { nome: 'São Paulo', lat: -23.55, lon: -46.63, value: 100 },
          { nome: 'Rio de Janeiro', lat: -22.9, lon: -43.2, value: 65 },
          { nome: 'Curitiba', lat: -25.43, lon: -49.27, value: 45 },
          { nome: 'Brasília', lat: -15.79, lon: -47.88, value: 80 }
        ];

    // Projeto simples de latitude/longitude para SVG (ajustável)
    const latRange = { min: -34, max: -15 };
    const lonRange = { min: -55, max: -35 };

    function proj(lon, lat) {
      const x = ((lon - lonRange.min) / (lonRange.max - lonRange.min)) * width;
      const y = ((lat - latRange.min) / (latRange.max - latRange.min)) * height;
      return { x, y };
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    // Adiciona círculos para cada localidade
    data.forEach((d) => {
      const pos = proj(d.lon, d.lat);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.x);
      circle.setAttribute('cy', pos.y);
      circle.setAttribute('r', Math.max(5, d.value / 15));
      circle.setAttribute('fill', this.options.color || '#2ca02c');
      circle.setAttribute('stroke', '#333');
      svg.appendChild(circle);

      // Label das cidades
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', pos.x + 8);
      label.setAttribute('y', pos.y + 4);
      label.setAttribute('font-size', '12px');
      label.setAttribute('fill', '#333');
      label.textContent = d.nome;
      svg.appendChild(label);
    });

    // Título didático
    const title = document.createElement
