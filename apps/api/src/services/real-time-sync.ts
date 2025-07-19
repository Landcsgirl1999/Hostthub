import { PrismaClient } from '@prisma/client';
import { WebSocket, Server as WebSocketServer } from 'ws';
import { EventEmitter } from 'events';

const prisma = new PrismaClient();

export interface SyncEvent {
  id: string;
  type: 'reservation' | 'calendar' | 'pricing' | 'message' | 'task';
  action: 'create' | 'update' | 'delete';
  platform: string;
  propertyId: string;
  data: any;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface SyncStatus {
  platform: string;
  lastSync: Date;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  syncDelay: number; // milliseconds
  errorCount: number;
  successRate: number;
}

export class RealTimeSyncService extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocket> = new Map();
  private syncQueue: SyncEvent[] = [];
  private isProcessing = false;
  private syncStatus: Map<string, SyncStatus> = new Map();

  constructor() {
    super();
    this.initializeWebSocketServer();
    this.startSyncProcessor();
  }

  // Initialize WebSocket server for real-time updates
  private initializeWebSocketServer() {
    this.wss = new WebSocketServer({ port: 8080 });
    
    this.wss.on('connection', (ws: WebSocket, req: any) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      console.log(`🔌 Real-time client connected: ${clientId}`);

      // Send initial sync status
      ws.send(JSON.stringify({
        type: 'sync_status',
        data: Array.from(this.syncStatus.values())
      }));

      ws.on('message', (message: string) => {
        this.handleClientMessage(clientId, message);
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`🔌 Real-time client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });

    console.log('🚀 Real-time sync server started on port 8080');
  }

  // Handle incoming client messages
  private handleClientMessage(clientId: string, message: string) {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'sync_request':
          this.handleSyncRequest(clientId, data);
          break;
        case 'status_update':
          this.handleStatusUpdate(clientId, data);
          break;
        case 'ping':
          this.sendToClient(clientId, { type: 'pong', timestamp: new Date() });
          break;
        default:
          console.warn(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error handling client message:', error);
    }
  }

  // Handle sync requests from clients
  private async handleSyncRequest(clientId: string, data: any) {
    const { platform, propertyId, action } = data;
    
    try {
      const syncEvent: SyncEvent = {
        id: this.generateEventId(),
        type: data.type || 'reservation',
        action,
        platform,
        propertyId,
        data: data.payload,
        timestamp: new Date(),
        priority: data.priority || 'medium'
      };

      await this.queueSyncEvent(syncEvent);
      
      this.sendToClient(clientId, {
        type: 'sync_confirmed',
        eventId: syncEvent.id,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error handling sync request:', error);
      this.sendToClient(clientId, {
        type: 'sync_error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Handle status updates from clients
  private handleStatusUpdate(clientId: string, data: any) {
    const { platform, status, syncDelay, errorCount, successRate } = data;
    
    this.syncStatus.set(platform, {
      platform,
      lastSync: new Date(),
      status,
      syncDelay: syncDelay || 0,
      errorCount: errorCount || 0,
      successRate: successRate || 100
    });

    // Broadcast status update to all clients
    this.broadcastToClients({
      type: 'sync_status_update',
      data: Array.from(this.syncStatus.values())
    });
  }

  // Queue a sync event for processing
  async queueSyncEvent(event: SyncEvent): Promise<void> {
    this.syncQueue.push(event);
    
    // Sort by priority (high priority events first)
    this.syncQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    console.log(`📋 Queued sync event: ${event.type} ${event.action} for ${event.platform}`);
    
    // Emit event for external listeners
    this.emit('syncQueued', event);
  }

  // Start the sync processor
  private startSyncProcessor() {
    setInterval(async () => {
      if (this.isProcessing || this.syncQueue.length === 0) return;
      
      this.isProcessing = true;
      
      try {
        const event = this.syncQueue.shift();
        if (event) {
          await this.processSyncEvent(event);
        }
      } catch (error) {
        console.error('Error processing sync event:', error);
      } finally {
        this.isProcessing = false;
      }
    }, 100); // Process every 100ms for near real-time sync
  }

  // Process a sync event
  private async processSyncEvent(event: SyncEvent): Promise<void> {
    console.log(`🔄 Processing sync event: ${event.id}`);
    
    try {
      // Update sync status
      this.updateSyncStatus(event.platform, 'syncing', 0);

      // Process based on event type
      switch (event.type) {
        case 'reservation':
          await this.syncReservation(event);
          break;
        case 'calendar':
          await this.syncCalendar(event);
          break;
        case 'pricing':
          await this.syncPricing(event);
          break;
        case 'message':
          await this.syncMessage(event);
          break;
        case 'task':
          await this.syncTask(event);
          break;
        default:
          console.warn(`Unknown sync event type: ${event.type}`);
      }

      // Update sync status
      this.updateSyncStatus(event.platform, 'connected', 0);
      
      // Broadcast success to all clients
      this.broadcastToClients({
        type: 'sync_completed',
        eventId: event.id,
        platform: event.platform,
        timestamp: new Date()
      });

      console.log(`✅ Sync completed: ${event.id}`);
      
    } catch (error) {
      console.error(`❌ Sync failed: ${event.id}`, error);
      
      // Update sync status with error
      this.updateSyncStatus(event.platform, 'error', 0);
      
      // Broadcast error to all clients
      this.broadcastToClients({
        type: 'sync_error',
        eventId: event.id,
        platform: event.platform,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }

  // Sync reservation data
  private async syncReservation(event: SyncEvent): Promise<void> {
    const { action, platform, propertyId, data } = event;
    
    switch (action) {
      case 'create':
        await this.createReservation(platform, propertyId, data);
        break;
      case 'update':
        await this.updateReservation(platform, propertyId, data);
        break;
      case 'delete':
        await this.deleteReservation(platform, propertyId, data);
        break;
    }
  }

  // Sync calendar data
  private async syncCalendar(event: SyncEvent): Promise<void> {
    const { action, platform, propertyId, data } = event;
    
    // Update calendar availability across all platforms
    await this.updateCalendarAvailability(platform, propertyId, data);
  }

  // Sync pricing data
  private async syncPricing(event: SyncEvent): Promise<void> {
    const { action, platform, propertyId, data } = event;
    
    // Update pricing across all platforms
    await this.updatePricing(platform, propertyId, data);
  }

  // Sync message data
  private async syncMessage(event: SyncEvent): Promise<void> {
    const { action, platform, propertyId, data } = event;
    
    // Sync messages across platforms
    await this.syncMessages(platform, propertyId, data);
  }

  // Sync task data
  private async syncTask(event: SyncEvent): Promise<void> {
    const { action, platform, propertyId, data } = event;
    
    // Sync tasks across platforms
    await this.syncTasks(platform, propertyId, data);
  }

  // Create reservation
  private async createReservation(platform: string, propertyId: string, data: any): Promise<void> {
    // Create reservation in database
    const reservation = await prisma.reservation.create({
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        totalAmount: data.totalAmount,
        status: 'CONFIRMED',
        platform: platform.toUpperCase() as any,
        platformId: data.platformId,
        propertyId,
        notes: data.notes
      }
    });

    // Update calendar availability
    await this.updateCalendarAvailability(platform, propertyId, {
      startDate: data.checkIn,
      endDate: data.checkOut,
      isBlocked: true
    });

    console.log(`✅ Created reservation: ${reservation.id}`);
  }

  // Update reservation
  private async updateReservation(platform: string, propertyId: string, data: any): Promise<void> {
    await prisma.reservation.update({
      where: { id: data.id },
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        totalAmount: data.totalAmount,
        status: data.status,
        notes: data.notes
      }
    });

    console.log(`✅ Updated reservation: ${data.id}`);
  }

  // Delete reservation
  private async deleteReservation(platform: string, propertyId: string, data: any): Promise<void> {
    await prisma.reservation.update({
      where: { id: data.id },
      data: { status: 'CANCELLED' }
    });

    // Update calendar availability
    await this.updateCalendarAvailability(platform, propertyId, {
      startDate: data.checkIn,
      endDate: data.checkOut,
      isBlocked: false
    });

    console.log(`✅ Cancelled reservation: ${data.id}`);
  }

  // Update calendar availability
  private async updateCalendarAvailability(platform: string, propertyId: string, data: any): Promise<void> {
    // Update calendar events
    await prisma.calendarEvent.upsert({
      where: {
        calendarId_startDate: {
          calendarId: propertyId,
          startDate: new Date(data.startDate)
        }
      },
      update: {
        endDate: new Date(data.endDate),
        isBlocked: data.isBlocked
      },
      create: {
        calendarId: propertyId,
        title: data.isBlocked ? 'Blocked' : 'Available',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isBlocked: data.isBlocked
      }
    });

    // Sync to external platforms
    await this.syncToExternalPlatforms(platform, propertyId, data);
  }

  // Update pricing
  private async updatePricing(platform: string, propertyId: string, data: any): Promise<void> {
    // Update daily prices
    await prisma.dailyPrice.upsert({
      where: {
        propertyId_date: {
          propertyId,
          date: data.date
        }
      },
      update: {
        finalPrice: data.price,
        demandLevel: data.demandLevel,
        demandScore: data.demandScore,
        appliedRules: data.appliedRules,
        marketFactors: data.marketFactors
      },
      create: {
        propertyId,
        date: data.date,
        basePrice: data.basePrice,
        finalPrice: data.price,
        demandLevel: data.demandLevel,
        demandScore: data.demandScore,
        appliedRules: data.appliedRules,
        marketFactors: data.marketFactors,
        confidence: data.confidence || 0.8
      }
    });

    // Sync pricing to external platforms
    await this.syncPricingToExternalPlatforms(platform, propertyId, data);
  }

  // Sync messages
  private async syncMessages(platform: string, propertyId: string, data: any): Promise<void> {
    // Implementation for message syncing
    console.log(`📨 Syncing messages for ${platform}`);
  }

  // Sync tasks
  private async syncTasks(platform: string, propertyId: string, data: any): Promise<void> {
    // Implementation for task syncing
    console.log(`📋 Syncing tasks for ${platform}`);
  }

  // Sync to external platforms
  private async syncToExternalPlatforms(sourcePlatform: string, propertyId: string, data: any): Promise<void> {
    // Get all platform integrations for this property
    const integrations = await prisma.platformProperty.findMany({
      where: { propertyId },
      include: { platform: true, integration: true }
    });

    // Sync to all other platforms
    for (const integration of integrations) {
      if (integration.platform.name.toLowerCase() !== sourcePlatform.toLowerCase()) {
        await this.syncToPlatform(integration, data);
      }
    }
  }

  // Sync pricing to external platforms
  private async syncPricingToExternalPlatforms(sourcePlatform: string, propertyId: string, data: any): Promise<void> {
    // Get all platform integrations for this property
    const integrations = await prisma.platformProperty.findMany({
      where: { propertyId },
      include: { platform: true, integration: true }
    });

    // Sync pricing to all other platforms
    for (const integration of integrations) {
      if (integration.platform.name.toLowerCase() !== sourcePlatform.toLowerCase()) {
        await this.syncPricingToPlatform(integration, data);
      }
    }
  }

  // Sync to specific platform
  private async syncToPlatform(integration: any, data: any): Promise<void> {
    try {
      // This would implement the actual API calls to external platforms
      console.log(`🔄 Syncing to ${integration.platform.name} for property ${integration.propertyId}`);
      
      // Update last sync time
      await prisma.platformProperty.update({
        where: { id: integration.id },
        data: { lastSync: new Date() }
      });
    } catch (error) {
      console.error(`❌ Failed to sync to ${integration.platform.name}:`, error);
    }
  }

  // Sync pricing to specific platform
  private async syncPricingToPlatform(integration: any, data: any): Promise<void> {
    try {
      // This would implement the actual pricing API calls to external platforms
      console.log(`💰 Syncing pricing to ${integration.platform.name} for property ${integration.propertyId}`);
    } catch (error) {
      console.error(`❌ Failed to sync pricing to ${integration.platform.name}:`, error);
    }
  }

  // Update sync status
  private updateSyncStatus(platform: string, status: string, syncDelay: number): void {
    const currentStatus = this.syncStatus.get(platform);
    
    this.syncStatus.set(platform, {
      platform,
      lastSync: new Date(),
      status: status as any,
      syncDelay,
      errorCount: status === 'error' ? (currentStatus?.errorCount || 0) + 1 : 0,
      successRate: status === 'connected' ? 100 : (currentStatus?.successRate || 0)
    });
  }

  // Send message to specific client
  private sendToClient(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  // Broadcast message to all clients
  private broadcastToClients(message: any): void {
    const messageStr = JSON.stringify(message);
    
    this.clients.forEach((client, clientId) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  // Generate client ID
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate event ID
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get sync status
  getSyncStatus(): SyncStatus[] {
    return Array.from(this.syncStatus.values());
  }

  // Get queue status
  getQueueStatus(): { length: number; processing: boolean } {
    return {
      length: this.syncQueue.length,
      processing: this.isProcessing
    };
  }

  // Force sync for a platform
  async forceSync(platform: string, propertyId: string): Promise<void> {
    const syncEvent: SyncEvent = {
      id: this.generateEventId(),
      type: 'calendar',
      action: 'update',
      platform,
      propertyId,
      data: { forceSync: true },
      timestamp: new Date(),
      priority: 'high'
    };

    await this.queueSyncEvent(syncEvent);
  }

  // Cleanup
  destroy(): void {
    if (this.wss) {
      this.wss.close();
    }
    this.clients.clear();
    this.syncQueue = [];
  }
} 