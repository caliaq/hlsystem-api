/**
 * WebSocket service for handling real-time communications
 * Sends only specific gate and license plate messages
 */
export default class WebSocketService {
  constructor(io) {
    this.io = io;
  }

  /**
   * Emit gate opened message to all connected clients
   * @param {string} gateId - The ID of the gate
   */
  emitGateOpened(gateId) {
    const message = {
      gateId,
      timestamp: new Date().toISOString()
    };
    
    console.log('Emitting gateOpened:', message);
    this.io.emit('gateOpened', message);
  }

  /**
   * Emit gate closed message to all connected clients
   * @param {string} gateId - The ID of the gate
   */
  emitGateClosed(gateId) {
    const message = {
      gateId,
      timestamp: new Date().toISOString()
    };
    
    console.log('Emitting gateClosed:', message);
    this.io.emit('gateClosed', message);
  }

  /**
   * Emit gate opening message to all connected clients
   * @param {string} gateId - The ID of the gate
   */
  emitGateOpening(gateId) {
    const message = {
      gateId,
      timestamp: new Date().toISOString()
    };
    
    console.log('Emitting gateOpening:', message);
    this.io.emit('gateOpening', message);
  }

  /**
   * Emit gate closing message to all connected clients
   * @param {string} gateId - The ID of the gate
   */
  emitGateClosing(gateId) {
    const message = {
      gateId,
      timestamp: new Date().toISOString()
    };
    
    console.log('Emitting gateClosing:', message);
    this.io.emit('gateClosing', message);
  }

  /**
   * Emit license plate upload notification to all connected clients
   * @param {Object} uploadData - The upload data including filename, size, etc.
   */
  emitLicensePlateUploaded(uploadData) {
    const message = {
      ...uploadData,
      timestamp: new Date().toISOString()
    };
    
    console.log('Emitting licensePlateUploaded:', message);
    this.io.emit('licensePlateUploaded', message);
  }

  /**
   * Get the number of connected clients
   * @returns {number} Number of connected clients
   */
  getConnectedClientsCount() {
    return this.io.engine.clientsCount;
  }
}
