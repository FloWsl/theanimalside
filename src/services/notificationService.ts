// Notification Service for Deployment Alerts
// PATTERN: Multi-channel notification system with fallbacks

import { config, isProduction, isDevelopment } from '../config/environment';

export interface NotificationMessage {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  metadata?: Record<string, any>;
  timestamp?: number;
}

export interface NotificationResult {
  success: boolean;
  channel: string;
  error?: string;
  responseTime?: number;
}

export interface NotificationStatus {
  totalSent: number;
  successfulChannels: string[];
  failedChannels: string[];
  errors: string[];
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Send notification to all configured channels
   * PATTERN: Multi-channel distribution with graceful degradation
   */
  async sendNotification(notification: NotificationMessage): Promise<NotificationStatus> {
    const channels = config.notifications.channels;
    const results: NotificationResult[] = [];

    // Add timestamp if not provided
    const message = {
      ...notification,
      timestamp: notification.timestamp || Date.now()
    };

    // Send to all channels concurrently
    const promises = channels.map(channel => this.sendToChannel(channel, message));
    const channelResults = await Promise.allSettled(promises);

    // Process results
    channelResults.forEach((result, index) => {
      const channel = channels[index];
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          success: false,
          channel,
          error: result.reason?.message || 'Unknown error'
        });
      }
    });

    const successfulChannels = results.filter(r => r.success).map(r => r.channel);
    const failedChannels = results.filter(r => !r.success).map(r => r.channel);
    const errors = results.filter(r => !r.success).map(r => r.error || 'Unknown error');

    return {
      totalSent: successfulChannels.length,
      successfulChannels,
      failedChannels,
      errors
    };
  }

  /**
   * Send notification to a specific channel
   * PATTERN: Channel-specific handling with error isolation
   */
  private async sendToChannel(
    channel: 'console' | 'email' | 'slack' | 'webhook',
    message: NotificationMessage
  ): Promise<NotificationResult> {
    const start = performance.now();

    try {
      switch (channel) {
        case 'console':
          return await this.sendToConsole(message, start);

        case 'webhook':
          return await this.sendToWebhook(message, start);

        case 'slack':
          return await this.sendToSlack(message, start);

        case 'email':
          return await this.sendToEmail(message, start);

        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }
    } catch (error) {
      return {
        success: false,
        channel,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: performance.now() - start
      };
    }
  }

  /**
   * Console notification (always available)
   * PATTERN: Structured console logging with severity levels
   */
  private async sendToConsole(
    message: NotificationMessage,
    startTime: number
  ): Promise<NotificationResult> {
    const emoji = this.getSeverityEmoji(message.severity);
    const timestamp = new Date(message.timestamp!).toISOString();

    const logMessage = `${emoji} [${message.severity.toUpperCase()}] ${message.title}\n${message.message}`;

    switch (message.severity) {
      case 'critical':
      case 'error':
        console.error(`🚨 ${timestamp}`, logMessage, message.metadata);
        break;
      case 'warning':
        console.warn(`⚠️ ${timestamp}`, logMessage, message.metadata);
        break;
      case 'info':
      default:
        console.log(`ℹ️ ${timestamp}`, logMessage, message.metadata);
        break;
    }

    return {
      success: true,
      channel: 'console',
      responseTime: performance.now() - startTime
    };
  }

  /**
   * Webhook notification
   * PATTERN: Generic webhook with configurable payload format
   */
  private async sendToWebhook(
    message: NotificationMessage,
    startTime: number
  ): Promise<NotificationResult> {
    const webhookUrl = isProduction()
      ? config.notifications.webhookUrl
      : process.env.VITE_STAGING_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    const payload = {
      title: message.title,
      message: message.message,
      severity: message.severity,
      timestamp: message.timestamp,
      environment: config.name,
      metadata: message.metadata
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `theanimalside-${config.name}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }

    return {
      success: true,
      channel: 'webhook',
      responseTime: performance.now() - startTime
    };
  }

  /**
   * Slack notification
   * PATTERN: Slack-formatted messages with color coding
   */
  private async sendToSlack(
    message: NotificationMessage,
    startTime: number
  ): Promise<NotificationResult> {
    const slackWebhook = config.notifications.slackWebhook;

    if (!slackWebhook) {
      throw new Error('Slack webhook URL not configured');
    }

    const color = this.getSeverityColor(message.severity);
    const emoji = this.getSeverityEmoji(message.severity);

    const slackPayload = {
      text: `${emoji} Deployment Alert: ${message.title}`,
      attachments: [
        {
          color,
          fields: [
            {
              title: 'Message',
              value: message.message,
              short: false
            },
            {
              title: 'Environment',
              value: config.name,
              short: true
            },
            {
              title: 'Severity',
              value: message.severity.toUpperCase(),
              short: true
            },
            {
              title: 'Timestamp',
              value: new Date(message.timestamp!).toISOString(),
              short: true
            }
          ],
          footer: 'The Animal Side Deployment System',
          ts: Math.floor(message.timestamp! / 1000)
        }
      ]
    };

    // Add metadata fields if present
    if (message.metadata) {
      Object.entries(message.metadata).forEach(([key, value]) => {
        slackPayload.attachments[0].fields.push({
          title: key,
          value: String(value),
          short: true
        });
      });
    }

    const response = await fetch(slackWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(slackPayload)
    });

    if (!response.ok) {
      throw new Error(`Slack request failed: ${response.status} ${response.statusText}`);
    }

    return {
      success: true,
      channel: 'slack',
      responseTime: performance.now() - startTime
    };
  }

  /**
   * Email notification (placeholder for future implementation)
   * PATTERN: Future-ready interface with graceful degradation
   */
  private async sendToEmail(
    message: NotificationMessage,
    startTime: number
  ): Promise<NotificationResult> {
    // For now, email is not implemented
    // In production, this would integrate with SendGrid, AWS SES, etc.

    if (isDevelopment()) {
      console.log('📧 Email notification (simulated):', {
        to: 'admin@theanimalside.com',
        subject: `[${message.severity.toUpperCase()}] ${message.title}`,
        body: message.message,
        metadata: message.metadata
      });

      return {
        success: true,
        channel: 'email',
        responseTime: performance.now() - startTime
      };
    }

    throw new Error('Email notifications not implemented');
  }

  /**
   * Helper methods for formatting
   */
  private getSeverityEmoji(severity: string): string {
    const emojiMap: Record<string, string> = {
      critical: '🚨',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return emojiMap[severity] || 'ℹ️';
  }

  private getSeverityColor(severity: string): string {
    const colorMap: Record<string, string> = {
      critical: 'danger',
      error: 'danger',
      warning: 'warning',
      info: 'good'
    };
    return colorMap[severity] || 'good';
  }

  /**
   * Quick notification methods for common scenarios
   */
  async notifyDeploymentStart(stage: string, percentage: number): Promise<NotificationStatus> {
    return this.sendNotification({
      title: 'Deployment Started',
      message: `Stage: ${stage} (${percentage}% rollout)`,
      severity: 'info',
      metadata: { stage, percentage }
    });
  }

  async notifyDeploymentSuccess(stage: string, duration: number): Promise<NotificationStatus> {
    return this.sendNotification({
      title: 'Deployment Successful',
      message: `Stage: ${stage} completed in ${duration}ms`,
      severity: 'info',
      metadata: { stage, duration }
    });
  }

  async notifyDeploymentFailure(stage: string, reason: string): Promise<NotificationStatus> {
    return this.sendNotification({
      title: 'Deployment Failed',
      message: `Stage: ${stage} failed - ${reason}`,
      severity: 'error',
      metadata: { stage, reason }
    });
  }

  async notifyRollback(reason: string): Promise<NotificationStatus> {
    return this.sendNotification({
      title: 'Emergency Rollback',
      message: `System rolled back due to: ${reason}`,
      severity: 'critical',
      metadata: { reason }
    });
  }
}

export default NotificationService;