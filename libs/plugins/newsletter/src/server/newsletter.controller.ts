import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from "@nestjs/common";
import { NewsletterService } from "./newsletter.service";
import { SubscriberService } from "./subscriber.service";
import type { CreateNewsletterDto, UpdateNewsletterDto, SubscribeDto, UnsubscribeDto } from "../shared/dto";

@Controller("newsletter")
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly subscriberService: SubscriberService
  ) {}

  @Post()
  async createNewsletter(
    @Headers("x-tenant-id") tenantId: string,
    @Body() dto: CreateNewsletterDto
  ) {
    return this.newsletterService.create(tenantId, dto);
  }

  @Get()
  async getNewsletters(@Headers("x-tenant-id") tenantId: string) {
    return this.newsletterService.findAll(tenantId);
  }

  @Get(":id")
  async getNewsletter(@Param("id") id: string) {
    return this.newsletterService.findById(id);
  }

  @Put(":id")
  async updateNewsletter(
    @Param("id") id: string,
    @Body() dto: UpdateNewsletterDto
  ) {
    return this.newsletterService.update(id, dto);
  }

  @Delete(":id")
  async deleteNewsletter(@Param("id") id: string) {
    return this.newsletterService.delete(id);
  }

  @Post(":id/send")
  async sendNewsletter(@Param("id") id: string) {
    return this.newsletterService.send(id);
  }

  @Post("subscribers")
  async subscribe(
    @Headers("x-tenant-id") tenantId: string,
    @Body() dto: SubscribeDto
  ) {
    return this.subscriberService.subscribe(tenantId, dto);
  }

  @Post("subscribers/unsubscribe")
  async unsubscribe(
    @Headers("x-tenant-id") tenantId: string,
    @Body() dto: UnsubscribeDto
  ) {
    return this.subscriberService.unsubscribe(tenantId, dto);
  }

  @Get("subscribers")
  async getSubscribers(@Headers("x-tenant-id") tenantId: string) {
    return this.subscriberService.findAll(tenantId);
  }

  @Get("subscribers/active")
  async getActiveSubscribers(@Headers("x-tenant-id") tenantId: string) {
    return this.subscriberService.findActive(tenantId);
  }
}
