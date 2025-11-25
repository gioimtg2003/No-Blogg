import { Module, DynamicModule } from "@nestjs/common";
import { NewsletterService } from "./newsletter.service";
import { SubscriberService } from "./subscriber.service";
import { NewsletterController } from "./newsletter.controller";

@Module({})
export class NewsletterModule {
  static forRoot(): DynamicModule {
    return {
      module: NewsletterModule,
      controllers: [NewsletterController],
      providers: [NewsletterService, SubscriberService],
      exports: [NewsletterService, SubscriberService],
    };
  }
}
