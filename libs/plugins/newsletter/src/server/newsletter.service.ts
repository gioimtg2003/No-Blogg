import type { Newsletter, NewsletterStatus } from "../shared/types";
import type { CreateNewsletterDto, UpdateNewsletterDto } from "../shared/dto";

// Service for managing newsletters
// This is a placeholder that demonstrates the service pattern

export class NewsletterService {
  private newsletters: Map<string, Newsletter> = new Map();

  async create(
    tenantId: string,
    dto: CreateNewsletterDto
  ): Promise<Newsletter> {
    const newsletter: Newsletter = {
      id: this.generateId(),
      tenantId,
      title: dto.title,
      content: dto.content,
      status: "DRAFT",
      scheduledAt: dto.scheduledAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsletters.set(newsletter.id, newsletter);
    return newsletter;
  }

  async findAll(tenantId: string): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values()).filter(
      (n) => n.tenantId === tenantId
    );
  }

  async findById(id: string): Promise<Newsletter | undefined> {
    return this.newsletters.get(id);
  }

  async update(
    id: string,
    dto: UpdateNewsletterDto
  ): Promise<Newsletter | undefined> {
    const newsletter = this.newsletters.get(id);
    if (!newsletter) return undefined;

    const updated: Newsletter = {
      ...newsletter,
      ...dto,
      updatedAt: new Date(),
    };
    this.newsletters.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.newsletters.delete(id);
  }

  async send(id: string): Promise<Newsletter | undefined> {
    const newsletter = this.newsletters.get(id);
    if (!newsletter) return undefined;

    const sent: Newsletter = {
      ...newsletter,
      status: "SENT" as NewsletterStatus,
      sentAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsletters.set(id, sent);
    return sent;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
