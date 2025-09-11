// helpers.js: Funções utilitárias profissionais e didáticas para charts.
// Compatível com Jest e importável por outros módulos.

/**
 * Normaliza dados numéricos para um intervalo específico (0-1 por padrão).
 * Útil para escalonamento de dados em visualizações.
 * 
 * @param {number[]} data - Array de números para normalizar
 * @param {number} [min=0] - Valor mínimo do intervalo de saída
 * @param {number} [max=1] - Valor máximo do intervalo de saída
 * @returns {number[]} Array normalizado
 * @throws {Error} Se dados inválidos ou array vazio
 * 
 * @example
 * normalizeData([10, 20, 30]); // [0, 0.5, 1]
 * normalizeData([5, 15, 25], 0, 100); // [0, 50, 100]
 */
export function normalizeData(data, min = 0, max = 1) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('normalizeData: dados devem ser um array não vazio');
  }
  
  const numericData = data.filter(d => typeof d === 'number' && !isNaN(d));
  if (numericData.length === 0) {
    throw new Error('normalizeData: nenhum valor numérico válido encontrado');
  }
  
  const dataMin = Math.min(...numericData);
  const dataMax = Math.max(...numericData);
  const dataRange = dataMax - dataMin;
  
  // Se todos os valores são iguais, retorna array com valores médios
  if (dataRange === 0) {
    return data.map(() => (min + max) / 2);
  }
  
  const targetRange = max - min;
  
  return data.map(value => {
    if (typeof value !== 'number' || isNaN(value)) {
      return min; // Valor padrão para dados inválidos
    }
    return min + ((value - dataMin) / dataRange) * targetRange;
  });
}

/**
 * Gera uma cor aleatória em formato hexadecimal.
 * Otimizada para boa legibilidade em visualizações.
 * 
 * @param {Object} [options={}] - Opções de configuração
 * @param {number} [options.saturation=70] - Saturação da cor (0-100)
 * @param {number} [options.lightness=50] - Luminosidade da cor (0-100)
 * @param {number} [options.alpha=1] - Transparência (0-1)
 * @returns {string} Cor em formato hex (#RRGGBB) ou rgba se alpha < 1
 * 
 * @example
 * randomColor(); // '#7A4B9E'
 * randomColor({ saturation: 80, lightness: 60 }); // '#8F5CB8'
 * randomColor({ alpha: 0.7 }); // 'rgba(122, 75, 158, 0.7)'
 */
export function randomColor(options = {}) {
  const { saturation = 70, lightness = 50, alpha = 1 } = options;
  
  // Validação de parâmetros
  const sat = Math.max(0, Math.min(100, saturation));
  const light = Math.max(0, Math.min(100, lightness));
  const a = Math.max(0, Math.min(1, alpha));
  
  // Gera matiz aleatório (0-360)
  const hue = Math.floor(Math.random() * 360);
  
  // Converte HSL para RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
    
    return [r, g, b];
  };
  
  const [r, g, b] = hslToRgb(hue, sat, light);
  
  // Retorna formato apropriado
  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Embaralha elementos de um array usando algoritmo Fisher-Yates.
 * Não modifica o array original.
 * 
 * @param {any[]} array - Array para embaralhar
 * @returns {any[]} Novo array embaralhado
 * @throws {Error} Se entrada não for um array
 * 
 * @example
 * shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4] (ordem aleatória)
 * shuffle(['a', 'b', 'c']); // ['c', 'a', 'b'] (ordem aleatória)
 */
export function shuffle(array) {
  if (!Array.isArray(array)) {
    throw new Error('shuffle: entrada deve ser um array');
  }
  
  const shuffled = [...array]; // Cria cópia para não modificar original
  
  // Algoritmo Fisher-Yates
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Limita um valor numérico dentro de um intervalo específico.
 * Essencial para validação de dados em visualizações.
 * 
 * @param {number} value - Valor a ser limitado
 * @param {number} min - Valor mínimo permitido
 * @param {number} max - Valor máximo permitido
 * @returns {number} Valor limitado ao intervalo [min, max]
 * @throws {Error} Se parâmetros não forem números válidos
 * 
 * @example
 * clamp(15, 0, 10); // 10
 * clamp(-5, 0, 10); // 0
 * clamp(7, 0, 10); // 7
 */
export function clamp(value, min, max) {
  // Validação de tipos
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('clamp: value deve ser um número válido');
  }
  if (typeof min !== 'number' || isNaN(min)) {
    throw new Error('clamp: min deve ser um número válido');
  }
  if (typeof max !== 'number' || isNaN(max)) {
    throw new Error('clamp: max deve ser um número válido');
  }
  
  // Validação de lógica
  if (min > max) {
    throw new Error('clamp: min não pode ser maior que max');
  }
  
  return Math.min(Math.max(value, min), max);
}

/**
 * Formatador de números para exibição em charts.
 * Converte números grandes em formato legível (K, M, B).
 * 
 * @param {number} value - Número para formatar
 * @param {number} [decimals=1] - Casas decimais
 * @returns {string} Número formatado
 * 
 * @example
 * formatNumber(1500); // '1.5K'
 * formatNumber(1000000); // '1.0M'
 * formatNumber(2500000000, 2); // '2.50B'
 */
export function formatNumber(value, decimals = 1) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e9) {
    return sign + (absValue / 1e9).toFixed(decimals) + 'B';
  }
  if (absValue >= 1e6) {
    return sign + (absValue / 1e6).toFixed(decimals) + 'M';
  }
  if (absValue >= 1e3) {
    return sign + (absValue / 1e3).toFixed(decimals) + 'K';
  }
  
  return value.toString();
}

/**
 * Valida se um objeto contém propriedades obrigatórias.
 * Útil para validação de configurações de charts.
 * 
 * @param {Object} obj - Objeto a validar
 * @param {string[]} requiredKeys - Chaves obrigatórias
 * @returns {boolean} true se todas as chaves estão presentes
 * @throws {Error} Se validação falhar
 * 
 * @example
 * validateRequired({a: 1, b: 2}, ['a', 'b']); // true
 * validateRequired({a: 1}, ['a', 'b']); // throws Error
 */
export function validateRequired(obj, requiredKeys) {
  if (!obj || typeof obj !== 'object') {
    throw new Error('validateRequired: primeiro parâmetro deve ser um objeto');
  }
  
  if (!Array.isArray(requiredKeys)) {
    throw new Error('validateRequired: segundo parâmetro deve ser um array');
  }
  
  const missing = requiredKeys.filter(key => !(key in obj));
  
  if (missing.length > 0) {
    throw new Error(`validateRequired: propriedades obrigatórias ausentes: ${missing.join(', ')}`);
  }
  
  return true;
}

// Exporta todas as funções para compatibilidade com diferentes sistemas de módulos
export default {
  normalizeData,
  randomColor,
  shuffle,
  clamp,
  formatNumber,
  validateRequired
};
