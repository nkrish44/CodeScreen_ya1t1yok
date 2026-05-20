import { APP_FILTER } from "@nestjs/core";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Global,
  HttpException,
  HttpStatus,
  Module,
} from "@nestjs/common";
import { Response } from "express";

import { PrismaModule } from "./modules/prisma/prisma.module";
import { ShiftsModule } from "./modules/shifts/shifts.module";
import { WorkersModule } from "./modules/workers/workers.module";
import { WorkplacesModule } from "./modules/workplaces/workplaces.module";

@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === "object" && body !== null && "message" in body
          ? (body as any).message
          : exception.message;

      response.status(status).json({
        statusCode: status,
        error: HttpStatus[status]
          .split("_")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" "),
        message,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
}

@Global()
@Module({
  imports: [PrismaModule, ShiftsModule, WorkersModule, WorkplacesModule],
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}