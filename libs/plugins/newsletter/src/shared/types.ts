export interface Newsletter {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  status: NewsletterStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NewsletterStatus = "DRAFT" | "SCHEDULED" | "SENT" | "CANCELLED";

export interface Subscriber {
  id: string;
  tenantId: string;
  email: string;
  name?: string;
  status: SubscriberStatus;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

export type SubscriberStatus = "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED";
