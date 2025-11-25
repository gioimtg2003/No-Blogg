import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { NewsletterModule } from "@no-blogg/plugin-newsletter/server";

@Module({
  imports: [
    // Plugin modules
    NewsletterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
