import type { NewsletterStatus } from "./types";

export interface CreateNewsletterDto {
  title: string;
  content: string;
  scheduledAt?: Date;
}

export interface UpdateNewsletterDto {
  title?: string;
  content?: string;
  status?: NewsletterStatus;
  scheduledAt?: Date;
}

export interface SubscribeDto {
  email: string;
  name?: string;
}

export interface UnsubscribeDto {
  email: string;
  reason?: string;
}
