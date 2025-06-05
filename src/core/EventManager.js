/**
 * EventManager class
 * Handles event management and communication between components
 * 
 * @author Gabriel Demetrios Lafis
 * @version 2.1.0
 */

export class EventManager {
  /**
   * Create a new EventManager instance
   */
  constructor() {
    this.events = {};
  }
  
  /**
   * Register an event listener
   * 
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }
  
  /**
   * Remove an event listener
   * 
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.events[event]) {
      return;
    }
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    
    // Clean up empty event arrays
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }
  
  /**
   * Emit an event
   * 
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this.events[event]) {
      return;
    }
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
  
  /**
   * Register a one-time event listener
   * 
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    
    this.on(event, onceCallback);
  }
  
  /**
   * Check if an event has listeners
   * 
   * @param {string} event - Event name
   * @returns {boolean} True if the event has listeners
   */
  hasListeners(event) {
    return !!this.events[event] && this.events[event].length > 0;
  }
  
  /**
   * Get the number of listeners for an event
   * 
   * @param {string} event - Event name
   * @returns {number} Number of listeners
   */
  listenerCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }
  
  /**
   * Get all registered event names
   * 
   * @returns {Array} Array of event names
   */
  eventNames() {
    return Object.keys(this.events);
  }
  
  /**
   * Remove all listeners for a specific event
   * 
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
  
  /**
   * Create a namespaced event manager
   * 
   * @param {string} namespace - Namespace prefix
   * @returns {Object} Namespaced event methods
   */
  namespace(namespace) {
    return {
      on: (event, callback) => this.on(`${namespace}:${event}`, callback),
      off: (event, callback) => this.off(`${namespace}:${event}`, callback),
      emit: (event, data) => this.emit(`${namespace}:${event}`, data),
      once: (event, callback) => this.once(`${namespace}:${event}`, callback),
      hasListeners: (event) => this.hasListeners(`${namespace}:${event}`),
      listenerCount: (event) => this.listenerCount(`${namespace}:${event}`),
      removeAllListeners: (event) => {
        if (event) {
          this.removeAllListeners(`${namespace}:${event}`);
        } else {
          // Remove all events with this namespace
          const eventsToRemove = this.eventNames().filter(name => 
            name.startsWith(`${namespace}:`)
          );
          
          eventsToRemove.forEach(event => {
            this.removeAllListeners(event);
          });
        }
      }
    };
  }
}

