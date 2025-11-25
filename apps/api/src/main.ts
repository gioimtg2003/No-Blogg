import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@no-blogg/logger";

const logger = new Logger({ prefix: "API" });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  logger.info(`Application is running on: http://localhost:${port}`);
}

bootstrap();
