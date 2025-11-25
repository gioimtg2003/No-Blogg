import type { Subscriber, SubscriberStatus } from "../shared/types";
import type { SubscribeDto, UnsubscribeDto } from "../shared/dto";

// Service for managing newsletter subscribers
// This is a placeholder that demonstrates the service pattern

export class SubscriberService {
  private subscribers: Map<string, Subscriber> = new Map();

  async subscribe(tenantId: string, dto: SubscribeDto): Promise<Subscriber> {
    const existing = this.findByEmail(tenantId, dto.email);
    if (existing) {
      // Resubscribe if previously unsubscribed
      if (existing.status === "UNSUBSCRIBED") {
        const resubscribed: Subscriber = {
          ...existing,
          status: "ACTIVE",
          subscribedAt: new Date(),
          unsubscribedAt: undefined,
        };
        this.subscribers.set(existing.id, resubscribed);
        return resubscribed;
      }
      return existing;
    }

    const subscriber: Subscriber = {
      id: this.generateId(),
      tenantId,
      email: dto.email,
      name: dto.name,
      status: "ACTIVE",
      subscribedAt: new Date(),
    };
    this.subscribers.set(subscriber.id, subscriber);
    return subscriber;
  }

  async unsubscribe(
    tenantId: string,
    dto: UnsubscribeDto
  ): Promise<Subscriber | undefined> {
    const subscriber = this.findByEmail(tenantId, dto.email);
    if (!subscriber) return undefined;

    const unsubscribed: Subscriber = {
      ...subscriber,
      status: "UNSUBSCRIBED" as SubscriberStatus,
      unsubscribedAt: new Date(),
    };
    this.subscribers.set(subscriber.id, unsubscribed);
    return unsubscribed;
  }

  async findAll(tenantId: string): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values()).filter(
      (s) => s.tenantId === tenantId
    );
  }

  async findActive(tenantId: string): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values()).filter(
      (s) => s.tenantId === tenantId && s.status === "ACTIVE"
    );
  }

  private findByEmail(tenantId: string, email: string): Subscriber | undefined {
    return Array.from(this.subscribers.values()).find(
      (s) => s.tenantId === tenantId && s.email === email
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
