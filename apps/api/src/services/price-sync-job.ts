import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

export interface PriceSyncJobConfig {
  enabled: boolean;
  schedule: string; // Cron expression
  batchSize: number;
  retryAttempts: number;
  retryDelay: number; // milliseconds
}

export class PriceSyncJob {
  private config: PriceSyncJobConfig;
  private isRunning: boolean = false;
  private lastRun: Date | null = null;
  private nextRun: Date | null = null;
  private errorCount: number = 0;
  private successCount: number = 0;

  constructor(config: Partial<PriceSyncJobConfig> = {}) {
    this.config = {
      enabled: true,
      schedule: '0 2 * * *', // Daily at 2 AM
      batchSize: 10,
      retryAttempts: 3,
      retryDelay: 5000,
      ...config
    };
  }

  // Start the background job scheduler
  start(): void {
    if (!this.config.enabled) {
      console.log('🚫 Price sync job is disabled');
      return;
    }

    console.log(`🔄 Starting price sync job with schedule: ${this.config.schedule}`);
    
    cron.schedule(this.config.schedule, async () => {
      await this.runPriceSync();
    });

    // Calculate next run time
    this.calculateNextRun();
    
    console.log(`✅ Price sync job started. Next run: ${this.nextRun?.toISOString()}`);
  }

  // Stop the background job
  stop(): void {
    console.log('🛑 Stopping price sync job');
    cron.getTasks().forEach(task => task.stop());
  }

  // Manual trigger for immediate price sync
  async runPriceSync(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Price sync already running, skipping...');
      return;
    }

    this.isRunning = true;
    this.lastRun = new Date();
    
    console.log('🚀 Starting daily price sync...');
    
    try {
      // Get all active properties
      const properties = await prisma.property.findMany({
        where: { isActive: true }
      });

      console.log(`📊 Found ${properties.length} active properties to update`);

      // Process properties in batches
      for (let i = 0; i < properties.length; i += this.config.batchSize) {
        const batch = properties.slice(i, i + this.config.batchSize);
        
        console.log(`🔄 Processing batch ${Math.floor(i / this.config.batchSize) + 1}/${Math.ceil(properties.length / this.config.batchSize)}`);
        
        await Promise.all(
          batch.map(property => this.updatePropertyPrices(property))
        );

        // Small delay between batches to prevent overwhelming the system
        if (i + this.config.batchSize < properties.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      this.successCount++;
      console.log('✅ Daily price sync completed successfully');
      
    } catch (error) {
      this.errorCount++;
      console.error('❌ Price sync failed:', error);
      
      // Retry logic
      if (this.errorCount <= this.config.retryAttempts) {
        console.log(`🔄 Retrying in ${this.config.retryDelay}ms... (Attempt ${this.errorCount}/${this.config.retryAttempts})`);
        setTimeout(() => this.runPriceSync(), this.config.retryDelay);
        return;
      }
    } finally {
      this.isRunning = false;
      this.calculateNextRun();
    }
  }

  // Update prices for a single property
  private async updatePropertyPrices(property: any): Promise<void> {
    try {
      console.log(`🏠 Updating prices for property: ${property.name}`);
      
      // Get date range for next 365 days
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 365);

      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        // Calculate dynamic price for this date (simplified)
        const pricingResult = this.calculateSimplePrice(property, currentDate);

        // Store or update the calculated price
        await this.storeDailyPrice(property.id, currentDate, pricingResult);
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log(`✅ Updated prices for ${property.name}`);
      
    } catch (error) {
      console.error(`❌ Failed to update prices for ${property.name}:`, error);
      throw error;
    }
  }

  // Simple price calculation (placeholder for dynamic pricing)
  private calculateSimplePrice(property: any, date: Date): any {
    const basePrice = property.basePrice || 100;
    const dayOfWeek = date.getDay();
    
    // Simple weekend pricing
    let multiplier = 1.0;
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday, Saturday
      multiplier = 1.2;
    }
    
    // Seasonal adjustments (simplified)
    const month = date.getMonth();
    if (month >= 5 && month <= 8) { // Summer months
      multiplier *= 1.3;
    } else if (month === 11 || month === 0) { // December, January
      multiplier *= 1.1;
    }
    
    const finalPrice = Math.round(basePrice * multiplier);
    
    return {
      basePrice,
      finalPrice,
      demandLevel: multiplier > 1.1 ? 'HIGH' : multiplier < 0.9 ? 'LOW' : 'AVERAGE',
      demandScore: Math.min(multiplier, 2.0),
      appliedRules: ['weekend_pricing', 'seasonal_adjustment'],
      marketFactors: { multiplier, dayOfWeek, month },
      confidence: 0.8
    };
  }

  // Store daily price in database
  private async storeDailyPrice(propertyId: string, date: Date, pricingResult: any): Promise<void> {
    const dateString = date.toISOString().split('T')[0];
    
    try {
      // Upsert daily price
      await prisma.dailyPrice.upsert({
        where: {
          propertyId_date: {
            propertyId,
            date: dateString
          }
        },
        update: {
          basePrice: pricingResult.basePrice,
          finalPrice: pricingResult.finalPrice,
          demandLevel: pricingResult.demandLevel,
          demandScore: pricingResult.demandScore,
          appliedRules: pricingResult.appliedRules,
          marketFactors: pricingResult.marketFactors,
          confidence: pricingResult.confidence,
          updatedAt: new Date()
        },
        create: {
          propertyId,
          date: dateString,
          basePrice: pricingResult.basePrice,
          finalPrice: pricingResult.finalPrice,
          demandLevel: pricingResult.demandLevel,
          demandScore: pricingResult.demandScore,
          appliedRules: pricingResult.appliedRules,
          marketFactors: pricingResult.marketFactors,
          confidence: pricingResult.confidence
        }
      });
    } catch (error) {
      console.error(`Failed to store daily price for ${propertyId} on ${dateString}:`, error);
      // Continue processing other dates even if one fails
    }
  }

  // Calculate next run time
  private calculateNextRun(): void {
    const now = new Date();
    
    // Simple calculation for daily at 2 AM
    const next = new Date(now);
    next.setHours(2, 0, 0, 0);
    
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    
    this.nextRun = next;
  }

  // Get job status
  getStatus(): any {
    return {
      enabled: this.config.enabled,
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.nextRun,
      successCount: this.successCount,
      errorCount: this.errorCount,
      schedule: this.config.schedule
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<PriceSyncJobConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Price sync job configuration updated');
  }
}

// Export singleton instance
export const priceSyncJob = new PriceSyncJob(); 