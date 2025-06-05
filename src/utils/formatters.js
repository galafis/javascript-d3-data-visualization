/**
 * Formatters utility module
 * Provides functions for formatting data values
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

import * as d3 from 'd3';

/**
 * Format a number with specified precision
 * 
 * @param {number} value - Number to format
 * @param {number} precision - Decimal precision
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted number
 */
export function formatNumber(value, precision = 2, locale = 'en-US') {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  
  // Use d3 format for consistency
  const format = d3.format(precision === 0 ? ',.0f' : `,.${precision}f`);
  return format(value);
}

/**
 * Format a percentage value
 * 
 * @param {number} value - Value to format as percentage (0.1 = 10%)
 * @param {number} precision - Decimal precision
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, precision = 1, locale = 'en-US') {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  
  // Use d3 format for consistency
  const format = d3.format(`.${precision}%`);
  return format(value);
}

/**
 * Format a currency value
 * 
 * @param {number} value - Value to format as currency
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency
 */
export function formatCurrency(value, currency = 'USD', locale = 'en-US') {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  } catch (error) {
    // Fallback to basic formatting if Intl is not supported
    return `${currency} ${formatNumber(value)}`;
  }
}

/**
 * Format a date value
 * 
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: '%b %d, %Y')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date
 */
export function formatDate(date, format = '%b %d, %Y', locale = 'en-US') {
  if (!date) {
    return '—';
  }
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return '—';
  }
  
  // Use d3 time format
  const formatter = d3.timeFormat(format);
  return formatter(dateObj);
}

/**
 * Format a time value
 * 
 * @param {Date|string} time - Time to format
 * @param {string} format - Format string (default: '%H:%M:%S')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted time
 */
export function formatTime(time, format = '%H:%M:%S', locale = 'en-US') {
  if (!time) {
    return '—';
  }
  
  // Convert string to Date if needed
  const timeObj = typeof time === 'string' ? new Date(time) : time;
  
  // Check if valid date
  if (isNaN(timeObj.getTime())) {
    return '—';
  }
  
  // Use d3 time format
  const formatter = d3.timeFormat(format);
  return formatter(timeObj);
}

/**
 * Format a duration in milliseconds
 * 
 * @param {number} milliseconds - Duration in milliseconds
 * @param {boolean} showMilliseconds - Whether to show milliseconds
 * @returns {string} Formatted duration
 */
export function formatDuration(milliseconds, showMilliseconds = false) {
  if (milliseconds === null || milliseconds === undefined || isNaN(milliseconds)) {
    return '—';
  }
  
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  
  let result = '';
  
  if (days > 0) {
    result += `${days}d `;
  }
  
  if (hours > 0 || days > 0) {
    result += `${hours}h `;
  }
  
  if (minutes > 0 || hours > 0 || days > 0) {
    result += `${minutes}m `;
  }
  
  if (showMilliseconds) {
    const ms = milliseconds % 1000;
    result += `${seconds}.${ms.toString().padStart(3, '0')}s`;
  } else {
    result += `${seconds}s`;
  }
  
  return result.trim();
}

/**
 * Format a file size in bytes
 * 
 * @param {number} bytes - Size in bytes
 * @param {number} precision - Decimal precision
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes, precision = 2) {
  if (bytes === null || bytes === undefined || isNaN(bytes)) {
    return '—';
  }
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;
  
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  
  return `${formatNumber(bytes, precision)} ${units[i]}`;
}

/**
 * Format a value based on its type
 * 
 * @param {*} value - Value to format
 * @param {string} type - Value type ('number', 'percentage', 'currency', 'date', 'time', 'duration', 'filesize')
 * @param {Object} options - Formatting options
 * @returns {string} Formatted value
 */
export function formatValue(value, type, options = {}) {
  switch (type) {
    case 'number':
      return formatNumber(value, options.precision, options.locale);
    case 'percentage':
      return formatPercentage(value, options.precision, options.locale);
    case 'currency':
      return formatCurrency(value, options.currency, options.locale);
    case 'date':
      return formatDate(value, options.format, options.locale);
    case 'time':
      return formatTime(value, options.format, options.locale);
    case 'duration':
      return formatDuration(value, options.showMilliseconds);
    case 'filesize':
      return formatFileSize(value, options.precision);
    default:
      return value !== null && value !== undefined ? value.toString() : '—';
  }
}

