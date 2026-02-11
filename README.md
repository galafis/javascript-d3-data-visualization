# JavaScript D3 Data Visualization / Visualização de Dados JavaScript D3


## 🎯 Overview / Visão Geral

**EN:** Advanced data visualization platform built with D3.js and vanilla JavaScript, offering interactive charts, smooth animations, and real-time data analysis for modern web applications.

**PT-BR:** Plataforma avançada de visualização de dados construída com D3.js e JavaScript vanilla, oferecendo gráficos interativos, animações fluidas e análise de dados em tempo real para aplicações web modernas.

## ✨ Key Features / Características Principais

### Charts / Gráficos
- **📊 Bar Charts / Gráficos de Barras**: Horizontal, vertical, grouped, stacked
- **📈 Line Charts / Gráficos de Linha**: Simple, multi-series, area charts
- **🔵 Scatter Plots / Gráficos de Dispersão**: Bubble charts, correlation analysis
- **🥧 Pie Charts / Gráficos de Pizza**: Donut charts, nested pie charts
- **🌡️ Heatmaps / Mapas de Calor**: Calendar heatmaps, correlation matrices
- **🌳 Tree Maps / Mapas de Árvore**: Hierarchical data visualization
- **🕸️ Network Graphs / Grafos de Rede**: Force-directed layouts, hierarchical layouts
- **📊 Histograms / Histogramas**: Distribution analysis, frequency charts
- **📈 Candlestick Charts / Gráficos Candlestick**: Financial data visualization
- **🗺️ Choropleth Maps / Mapas Coropléticos**: Geographic data visualization

### Interactive Features / Recursos Interativos
- **🎨 Smooth Animations / Animações Fluidas**: CSS3 and D3 transitions
- **📱 Responsive Design / Design Responsivo**: Mobile-first approach
- **⚡ Optimized Performance / Performance Otimizada**: Canvas and SVG rendering
- **🔄 Real-time Data / Dados em Tempo Real**: WebSocket integration
- **🎛️ Interactive Controls / Controles Interativos**: Zoom, pan, brush, tooltips
- **🎨 Custom Themes / Temas Personalizados**: Dark/light mode support
- **📤 Export Options / Opções de Exportação**: PNG, SVG, PDF formats

## 🛠️ Tech Stack / Stack Tecnológico

### Core Technologies / Tecnologias Principais
- **D3.js v7**: Main visualization library / Biblioteca principal de visualização
- **JavaScript ES6+**: Modern JavaScript features / Recursos modernos do JavaScript
- **HTML5 Canvas**: High-performance rendering / Renderização de alta performance
- **CSS3**: Styling and animations / Estilos e animações
- **Webpack 5**: Module bundling / Empacotamento de módulos

### Development Tools / Ferramentas de Desenvolvimento
- **Jest**: Unit testing framework / Framework de testes unitários
- **ESLint**: Code linting / Linting de código
- **Prettier**: Code formatting / Formatação de código
- **Babel**: JavaScript transpilation / Transpilação JavaScript
- **npm/yarn**: Package management / Gerenciamento de pacotes

## 🚀 Getting Started / Primeiros Passos

### Installation / Instalação

```bash
# Clone the repository / Clone o repositório
git clone https://github.com/galafis/javascript-d3-data-visualization.git

# Navigate to project directory / Navegue para o diretório do projeto
cd javascript-d3-data-visualization

# Install dependencies / Instale as dependências
npm install

# Start development server / Inicie o servidor de desenvolvimento
npm run dev
```

### Quick Start / Início Rápido

```javascript
// Basic bar chart example / Exemplo básico de gráfico de barras
import { BarChart } from './src/charts/BarChart.js';

const data = [
  { name: 'A', value: 30 },
  { name: 'B', value: 80 },
  { name: 'C', value: 45 },
  { name: 'D', value: 60 }
];

const chart = new BarChart('#chart-container', {
  width: 800,
  height: 400,
  margin: { top: 20, right: 30, bottom: 40, left: 40 }
});

chart.render(data);
```

## 📊 Available Charts / Gráficos Disponíveis

### 1. Bar Charts / Gráficos de Barras
- **Vertical Bar Chart**: `src/charts/BarChart.js`
- **Horizontal Bar Chart**: `src/charts/HorizontalBarChart.js`
- **Grouped Bar Chart**: `src/charts/GroupedBarChart.js`
- **Stacked Bar Chart**: `src/charts/StackedBarChart.js`

### 2. Line Charts / Gráficos de Linha
- **Simple Line Chart**: `src/charts/LineChart.js`
- **Multi-series Line Chart**: `src/charts/MultiLineChart.js`
- **Area Chart**: `src/charts/AreaChart.js`
- **Stacked Area Chart**: `src/charts/StackedAreaChart.js`

### 3. Specialized Charts / Gráficos Especializados
- **Scatter Plot**: `src/charts/ScatterPlot.js`
- **Bubble Chart**: `src/charts/BubbleChart.js`
- **Pie Chart**: `src/charts/PieChart.js`
- **Donut Chart**: `src/charts/DonutChart.js`
- **Heatmap**: `src/charts/Heatmap.js`
- **TreeMap**: `src/charts/TreeMap.js`
- **Network Graph**: `src/charts/NetworkGraph.js`
- **Candlestick Chart**: `src/charts/CandlestickChart.js`
- **Choropleth Map**: `src/charts/ChoroplethMap.js`

## 🛠️ Utilities / Utilitários

### Data Processing / Processamento de Dados
- **Data Parser**: `src/utils/DataParser.js` - CSV, JSON, XML parsing
- **Data Transformer**: `src/utils/DataTransformer.js` - Data cleaning and transformation
- **Statistics**: `src/utils/Statistics.js` - Statistical calculations
- **Date Utils**: `src/utils/DateUtils.js` - Date formatting and manipulation

### Rendering Utils / Utilitários de Renderização
- **Color Palette**: `src/utils/ColorPalette.js` - Color schemes and gradients
- **Animation**: `src/utils/Animation.js` - Reusable animation functions
- **Responsive**: `src/utils/Responsive.js` - Responsive design helpers
- **Export**: `src/utils/Export.js` - Chart export functionality

## 📚 Real Examples / Exemplos Reais

### 1. Sales Dashboard / Dashboard de Vendas
```javascript
// Location: examples/sales-dashboard/
// Real sales data visualization with multiple chart types
// Visualização de dados reais de vendas com múltiplos tipos de gráficos
```

### 2. Financial Analytics / Análise Financeira
```javascript
// Location: examples/financial-analytics/
// Stock market data with candlestick and volume charts
// Dados do mercado de ações com gráficos candlestick e volume
```

### 3. Geographic Visualization / Visualização Geográfica
```javascript
// Location: examples/geo-visualization/
// Population density maps and migration patterns
// Mapas de densidade populacional e padrões de migração
```

### 4. Real-time Monitoring / Monitoramento em Tempo Real
```javascript
// Location: examples/realtime-monitoring/
// Live data streams with WebSocket integration
// Streams de dados ao vivo com integração WebSocket
```

## 🎬 Animations / Animações

### Built-in Animations / Animações Integradas
- **Entrance animations**: Fade in, slide in, scale up
- **Transition animations**: Smooth data updates
- **Interactive animations**: Hover effects, selection feedback
- **Exit animations**: Fade out, slide out, scale down

### Custom Animation API / API de Animação Personalizada
```javascript
// Custom animation example / Exemplo de animação personalizada
import { AnimationEngine } from './src/utils/Animation.js';

AnimationEngine.create({
  duration: 1000,
  easing: 'ease-in-out',
  onUpdate: (progress) => {
    // Custom animation logic
  }
});
```

## 🧪 Testing Coverage / Cobertura de Testes

### Current Coverage / Cobertura Atual: 85%

#### Unit Tests / Testes Unitários
- **Chart Components**: 90% coverage / 90% de cobertura
- **Utilities**: 95% coverage / 95% de cobertura
- **Data Processing**: 85% coverage / 85% de cobertura
- **Animation Engine**: 80% coverage / 80% de cobertura

#### Integration Tests / Testes de Integração
- **Chart Rendering**: ✅ Complete / Completo
- **Data Binding**: ✅ Complete / Completo
- **Event Handling**: ✅ Complete / Completo
- **Responsive Behavior**: ⚠️ Partial / Parcial

#### E2E Tests / Testes E2E
- **User Interactions**: ✅ Complete / Completo
- **Performance**: ⚠️ In Progress / Em Andamento
- **Cross-browser**: ⚠️ In Progress / Em Andamento

### Running Tests / Executando Testes
```bash
# Run all tests / Execute todos os testes
npm test

# Run with coverage / Execute com cobertura
npm run test:coverage

# Run specific test suite / Execute suite específica
npm test -- --testNamePattern="BarChart"

# Run E2E tests / Execute testes E2E
npm run test:e2e
```

## 🚧 In Development / Em Desenvolvimento

### Version 2.2.0 (Q4 2025)
- **🎯 3D Visualizations / Visualizações 3D**: WebGL integration
- **🤖 AI-powered Insights / Insights com IA**: Automated pattern recognition
- **📊 Advanced Statistics / Estatísticas Avançadas**: Regression analysis
- **🌐 Multi-language Support / Suporte Multi-idioma**: i18n implementation

### Version 2.3.0 (Q1 2026)
- **⚡ Performance Optimization / Otimização de Performance**: Web Workers
- **🔒 Data Security / Segurança de Dados**: Encryption and privacy features
- **📱 Mobile-first Charts / Gráficos Mobile-first**: Touch interactions
- **🎨 Theme Builder / Construtor de Temas**: Visual theme editor

### Future Roadmap / Roadmap Futuro
- **VR/AR Visualization / Visualização VR/AR**: Immersive data exploration
- **Machine Learning Integration / Integração Machine Learning**: Predictive analytics
- **Cloud Integration / Integração Cloud**: Direct API connections
- **Collaborative Features / Recursos Colaborativos**: Real-time editing

## 📖 Documentation / Documentação

- **API Reference / Referência da API**: [docs/api.md](docs/api.md)
- **Tutorials / Tutoriais**: [docs/tutorials/](docs/tutorials/)
- **Examples / Exemplos**: [examples/](examples/)
- **Contributing / Contribuindo**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Changelog / Log de Mudanças**: [CHANGELOG.md](CHANGELOG.md)

## 🤝 Contributing / Contribuindo

**EN:** We welcome contributions! Please read our contributing guidelines and code of conduct.

**PT-BR:** Contribuições são bem-vindas! Por favor, leia nossas diretrizes de contribuição e código de conduta.

## 📄 License / Licença

MIT License - see [LICENSE](LICENSE) file for details.

Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Support / Suporte

- **Issues**: [GitHub Issues](https://github.com/galafis/javascript-d3-data-visualization/issues)
- **Discussions**: [GitHub Discussions](https://github.com/galafis/javascript-d3-data-visualization/discussions)
- **Email**: support@d3visualization.com

---

**Made with ❤️ by [galafis](https://github.com/galafis)**

**Feito com ❤️ por [galafis](https://github.com/galafis)**
