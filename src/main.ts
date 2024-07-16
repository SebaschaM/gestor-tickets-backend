import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SeedService } from "./modules/seed/seed.service";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
    credentials: true,
  };
  const port = process.env.PORT || 3000;

  app.setGlobalPrefix("api");
  app.enableCors(corsOptions);
  app.use(cookieParser());

  await app.listen(port);
  if (process.env.SEED_DB === "true") {
    const seedService = app.get(SeedService);
    await seedService.seed();
  }
}
bootstrap();
