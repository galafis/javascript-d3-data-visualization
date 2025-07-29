# JavaScript D3 Data Visualization

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=flat&logo=d3.js&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=flat&logo=webpack&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Plataforma avançada de visualização de dados construída com D3.js e JavaScript vanilla, oferecendo gráficos interativos, animações fluidas e análise de dados em tempo real para aplicações web modernas.

## 🎯 Visão Geral

Sistema completo de visualização de dados que utiliza o poder do D3.js para criar gráficos interativos, dashboards dinâmicos e análises visuais avançadas com performance otimizada e design responsivo.

### ✨ Características Principais

- **📊 Gráficos Avançados**: Bar, line, scatter, pie, heatmap, treemap
- **🎨 Animações Fluidas**: Transições suaves e interações responsivas
- **📱 Design Responsivo**: Adaptável a diferentes tamanhos de tela
- **⚡ Performance Otimizada**: Renderização eficiente de grandes datasets
- **🔄 Dados em Tempo Real**: Atualizações dinâmicas e streaming
- **🎛️ Controles Interativos**: Zoom, pan, brush, tooltip

## 🛠️ Stack Tecnológico

### Core Technologies
- **D3.js v7**: Biblioteca principal de visualização
- **JavaScript ES6+**: Linguagem moderna com modules
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos avançados e animações

### Build Tools
- **Webpack**: Bundling e otimização
- **Babel**: Transpilação ES6+
- **ESLint**: Linting de código
- **Prettier**: Formatação de código

### Desenvolvimento
- **Live Server**: Desenvolvimento local
- **Source Maps**: Debug facilitado
- **Hot Reload**: Atualizações automáticas

## 📁 Estrutura do Projeto

```
javascript-d3-data-visualization/
├── src/                            # Código fonte
│   ├── charts/                     # Componentes de gráficos
│   │   ├── BaseChart.js            # Classe base para gráficos
│   │   ├── BarChart.js             # Gráfico de barras
│   │   ├── LineChart.js            # Gráfico de linha
│   │   ├── ScatterPlot.js          # Gráfico de dispersão
│   │   ├── PieChart.js             # Gráfico de pizza
│   │   ├── Heatmap.js              # Mapa de calor
│   │   └── ChartFactory.js         # Factory para gráficos
│   ├── core/                       # Módulos principais
│   │   ├── DataVisualizer.js       # Visualizador principal
│   │   ├── DataProcessor.js        # Processamento de dados
│   │   ├── EventManager.js         # Gerenciamento de eventos
│   │   └── AnimationEngine.js      # Engine de animações
│   ├── utils/                      # Utilitários
│   │   ├── dataLoader.js           # Carregamento de dados
│   │   ├── formatters.js           # Formatadores
│   │   ├── statistics.js           # Cálculos estatísticos
│   │   └── helpers.js              # Funções auxiliares
│   ├── styles/                     # Estilos CSS
│   │   ├── main.css                # Estilos principais
│   │   ├── charts.css              # Estilos dos gráficos
│   │   └── responsive.css          # Estilos responsivos
│   ├── data/                       # Datasets de exemplo
│   │   ├── sales-data.json         # Dados de vendas
│   │   ├── geographic-data.json    # Dados geográficos
│   │   └── time-series.json        # Séries temporais
│   └── main.js                     # Ponto de entrada
├── public/                         # Arquivos públicos
│   ├── index.html                  # HTML principal
│   └── favicon.ico                 # Ícone da aplicação
├── dist/                           # Build de produção
├── tests/                          # Testes automatizados
├── package.json                    # Dependências
├── webpack.config.js               # Configuração Webpack
└── README.md                       # Documentação
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/galafis/javascript-d3-data-visualization.git
cd javascript-d3-data-visualization
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

3. **Execute em desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação:**
```
http://localhost:8080
```

## 📊 Componentes de Visualização

### Bar Chart Interativo
```javascript
import { BarChart } from './charts/BarChart.js';

// Criar gráfico de barras
const barChart = new BarChart({
  container: '#chart-container',
  data: salesData,
  width: 800,
  height: 400,
  margin: { top: 20, right: 30, bottom: 40, left: 40 }
});

// Configurar propriedades
barChart
  .x(d => d.category)
  .y(d => d.value)
  .color(d => d.color)
  .animate(true)
  .tooltip(true);

// Renderizar
barChart.render();
```

### Line Chart com Animações
```javascript
import { LineChart } from './charts/LineChart.js';

// Gráfico de linha temporal
const lineChart = new LineChart({
  container: '#timeline-chart',
  data: timeSeriesData,
  width: 1000,
  height: 300
});

// Configurar eixos e propriedades
lineChart
  .x(d => new Date(d.date))
  .y(d => d.value)
  .curve(d3.curveMonotoneX)
  .strokeWidth(2)
  .animate({
    duration: 1000,
    ease: d3.easeQuadInOut
  });

// Adicionar interatividade
lineChart
  .on('mouseover', (event, d) => {
    showTooltip(event, d);
  })
  .on('mouseout', hideTooltip);

lineChart.render();
```

### Scatter Plot Avançado
```javascript
import { ScatterPlot } from './charts/ScatterPlot.js';

// Gráfico de dispersão
const scatterPlot = new ScatterPlot({
  container: '#scatter-container',
  data: correlationData,
  width: 600,
  height: 600
});

// Configurar escalas e propriedades
scatterPlot
  .x(d => d.income)
  .y(d => d.satisfaction)
  .radius(d => Math.sqrt(d.population) / 100)
  .color(d => d.region)
  .opacity(0.7);

// Adicionar brush para seleção
scatterPlot.addBrush({
  onBrushEnd: (selection) => {
    const selectedData = scatterPlot.getSelectedData(selection);
    updateDetailView(selectedData);
  }
});

scatterPlot.render();
```

## 🎨 Animações e Transições

### Sistema de Animações
```javascript
import { AnimationEngine } from './core/AnimationEngine.js';

// Configurar engine de animações
const animator = new AnimationEngine();

// Animação de entrada
animator.fadeIn('.chart-elements', {
  duration: 800,
  delay: (d, i) => i * 50,
  ease: d3.easeBackOut
});

// Animação de atualização
animator.morphTo('.bars', {
  height: d => yScale(d.newValue),
  duration: 1200,
  ease: d3.easeElasticOut
});

// Animação de saída
animator.fadeOut('.old-elements', {
  duration: 400,
  onComplete: () => {
    // Remover elementos antigos
    d3.selectAll('.old-elements').remove();
  }
});
```

### Transições Customizadas
```javascript
// Transição suave entre datasets
function updateChart(newData) {
  const t = d3.transition()
    .duration(750)
    .ease(d3.easeQuadInOut);

  // Atualizar barras existentes
  bars.selectAll('rect')
    .data(newData)
    .transition(t)
    .attr('height', d => yScale(d.value))
    .attr('y', d => height - yScale(d.value));

  // Adicionar novas barras
  bars.selectAll('rect')
    .data(newData)
    .enter()
    .append('rect')
    .attr('opacity', 0)
    .transition(t)
    .attr('opacity', 1);
}
```

## 🔄 Processamento de Dados

### Data Processor
```javascript
import { DataProcessor } from './core/DataProcessor.js';

// Processar dados brutos
const processor = new DataProcessor();

// Limpeza e transformação
const cleanData = processor
  .load(rawData)
  .clean({
    removeNulls: true,
    removeDuplicates: true,
    fillMissing: 'interpolate'
  })
  .transform({
    parseDate: 'date',
    parseNumber: ['value', 'count'],
    addCalculated: {
      percentage: d => (d.value / d.total) * 100,
      growth: d => ((d.current - d.previous) / d.previous) * 100
    }
  })
  .filter(d => d.value > 0)
  .sort((a, b) => b.value - a.value)
  .getData();

// Agregação de dados
const aggregated = processor
  .groupBy('category')
  .aggregate({
    sum: 'value',
    avg: 'score',
    count: '*',
    max: 'date'
  })
  .getData();
```

### Carregamento de Dados
```javascript
import { loadDataset } from './utils/dataLoader.js';

// Carregar múltiplos datasets
async function loadAllData() {
  try {
    const [sales, users, metrics] = await Promise.all([
      loadDataset('/api/sales'),
      loadDataset('/data/users.csv'),
      loadDataset('/data/metrics.json')
    ]);

    return { sales, users, metrics };
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Streaming de dados em tempo real
const dataStream = new EventSource('/api/stream');
dataStream.onmessage = (event) => {
  const newData = JSON.parse(event.data);
  updateVisualization(newData);
};
```

## 🎛️ Interatividade Avançada

### Sistema de Eventos
```javascript
import { EventManager } from './core/EventManager.js';

// Gerenciador de eventos global
const eventManager = new EventManager();

// Registrar eventos customizados
eventManager.on('dataUpdate', (newData) => {
  charts.forEach(chart => chart.update(newData));
});

eventManager.on('filterChange', (filters) => {
  const filteredData = applyFilters(originalData, filters);
  eventManager.emit('dataUpdate', filteredData);
});

// Interações de mouse
chart.on('click', (event, d) => {
  eventManager.emit('itemSelected', d);
  highlightRelatedItems(d);
});

chart.on('hover', (event, d) => {
  showDetailTooltip(event, d);
});
```

### Zoom e Pan
```javascript
// Implementar zoom e pan
const zoom = d3.zoom()
  .scaleExtent([0.5, 10])
  .on('zoom', (event) => {
    const { transform } = event;
    
    // Aplicar transformação aos elementos
    chartGroup.attr('transform', transform);
    
    // Atualizar eixos
    xAxisGroup.call(xAxis.scale(transform.rescaleX(xScale)));
    yAxisGroup.call(yAxis.scale(transform.rescaleY(yScale)));
  });

svg.call(zoom);

// Brush para seleção de área
const brush = d3.brush()
  .extent([[0, 0], [width, height]])
  .on('end', (event) => {
    if (!event.selection) return;
    
    const [[x0, y0], [x1, y1]] = event.selection;
    const selectedData = data.filter(d => {
      const x = xScale(d.x);
      const y = yScale(d.y);
      return x >= x0 && x <= x1 && y >= y0 && y <= y1;
    });
    
    onSelectionChange(selectedData);
  });

chartGroup.append('g').call(brush);
```

## 📱 Design Responsivo

### Responsive Charts
```javascript
// Sistema responsivo automático
class ResponsiveChart {
  constructor(options) {
    this.container = d3.select(options.container);
    this.setupResponsive();
  }

  setupResponsive() {
    // Observar mudanças de tamanho
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.resize(entry.contentRect);
      }
    });

    resizeObserver.observe(this.container.node());
  }

  resize(rect) {
    // Calcular novas dimensões
    const { width, height } = this.calculateDimensions(rect);
    
    // Atualizar escalas
    this.xScale.range([0, width]);
    this.yScale.range([height, 0]);
    
    // Re-renderizar elementos
    this.render();
  }

  calculateDimensions(rect) {
    const aspectRatio = 16 / 9;
    let width = rect.width;
    let height = width / aspectRatio;
    
    if (height > rect.height) {
      height = rect.height;
      width = height * aspectRatio;
    }
    
    return { width, height };
  }
}
```

## 🧪 Testes e Validação

### Executar Testes
```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes end-to-end
npm run test:e2e

# Linting
npm run lint
```

### Exemplo de Teste
```javascript
import { BarChart } from '../src/charts/BarChart.js';

describe('BarChart', () => {
  let chart;
  const mockData = [
    { category: 'A', value: 10 },
    { category: 'B', value: 20 },
    { category: 'C', value: 15 }
  ];

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>';
    chart = new BarChart({
      container: '#test-container',
      data: mockData
    });
  });

  test('should render bars correctly', () => {
    chart.render();
    const bars = document.querySelectorAll('.bar');
    expect(bars.length).toBe(3);
  });

  test('should update data correctly', () => {
    chart.render();
    const newData = [{ category: 'D', value: 25 }];
    chart.update(newData);
    
    const bars = document.querySelectorAll('.bar');
    expect(bars.length).toBe(1);
  });
});
```

## 🚀 Build e Deploy

### Build para Produção
```bash
npm run build
```

### Configuração Webpack
```javascript
// webpack.config.js
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

## 📊 Casos de Uso Práticos

### 1. Dashboard Executivo
- KPIs em tempo real
- Métricas de performance
- Análise de tendências

### 2. Analytics de Dados
- Exploração de datasets
- Análise correlacional
- Visualização de padrões

### 3. Monitoramento de Sistema
- Métricas de performance
- Logs em tempo real
- Alertas visuais

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Gabriel Demetrios Lafis**

- GitHub: [@galafis](https://github.com/galafis)
- Email: gabrieldemetrios@gmail.com

---

⭐ Se este projeto foi útil, considere deixar uma estrela!

