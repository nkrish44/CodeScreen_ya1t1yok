import { Injectable } from "@nestjs/common";
import { Shift, type Worker } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { getNextPage, queryParameters } from "../shared/pagination";
import { Filters, Page, PaginatedData } from "../shared/shared.types";
import { CreateWorker } from "./workers.schemas";

export type ShiftWithBonus = Shift & { streakBonusPercent: number };

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const dayOfWeek = d.getUTCDay();
    const daysFromMonday = (dayOfWeek + 6) % 7;
    d.setUTCDate(d.getUTCDate() - daysFromMonday);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  private async getStreakBonusByWorkplace(workerId: number): Promise<Map<number, number>> {
    const now = new Date();
    const weekStart = this.getWeekStart(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

    const currentWeekClaims = await this.prisma.shift.findMany({
      where: {
        workerId,
        cancelledAt: null,
        startAt: { gte: weekStart, lt: weekEnd },
      },
      select: { workplaceId: true },
    });

    const countByWorkplace = new Map<number, number>();
    for (const { workplaceId } of currentWeekClaims) {
      countByWorkplace.set(workplaceId, (countByWorkplace.get(workplaceId) ?? 0) + 1);
    }

    const bonusByWorkplace = new Map<number, number>();
    for (const [workplaceId, count] of countByWorkplace) {
      if (count >= 3) {
        bonusByWorkplace.set(workplaceId, 0.03);
      } else if (count >= 2) {
        bonusByWorkplace.set(workplaceId, 0.02);
      }
    }

    return bonusByWorkplace;
  }

  async getBonusShifts(parameters: {
    workerId: number;
    page: Page;
    filters: Filters;
  }): Promise<PaginatedData<ShiftWithBonus>> {
    const { workerId, page, filters } = parameters;

    const bonusByWorkplace = await this.getStreakBonusByWorkplace(workerId);

    if (bonusByWorkplace.size === 0) {
      return { data: [], nextPage: undefined };
    }

    const now = new Date();
    const currentWeekStart = this.getWeekStart(now);
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setUTCDate(nextWeekStart.getUTCDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setUTCDate(nextWeekEnd.getUTCDate() + 7);

    const eligibleWorkplaceIds = Array.from(bonusByWorkplace.keys());

    const whereFilter = {
      workerId: null,
      cancelledAt: null,
      startAt: { gte: nextWeekStart, lt: nextWeekEnd },
      workplaceId: { in: eligibleWorkplaceIds },
      ...(filters.jobType ? { jobType: filters.jobType } : {}),
      ...(filters.location ? { workplace: { location: filters.location } } : {}),
    };

    const databaseQueryParameters = queryParameters({ page, whereFilter });

    const shifts = await this.prisma.shift.findMany({
      ...databaseQueryParameters,
      orderBy: { id: "asc" },
    });

    const nextPage = await getNextPage({
      currentPage: page,
      collection: this.prisma.shift,
      whereFilter,
    });

    const data: ShiftWithBonus[] = shifts.map((shift) => ({
      ...shift,
      streakBonusPercent: bonusByWorkplace.get(shift.workplaceId)!,
    }));

    return { data, nextPage };
  }

  async getClaims(parameters: { id: number; page: Page }): Promise<PaginatedData<Shift>> {
    const { id, page } = parameters;

    const whereFilter = { workerId: id };
    const databaseQueryParameters = queryParameters({ page, whereFilter });
    const data = await this.prisma.shift.findMany(databaseQueryParameters);
    const nextPage = await getNextPage({
      currentPage: page,
      collection: this.prisma.shift,
      whereFilter,
    });

    return { data, nextPage };
  }

  async create(data: CreateWorker): Promise<Worker> {
    return this.prisma.worker.create({ data });
  }

  async get(parameters: { page: Page }): Promise<PaginatedData<Worker>> {
    const { page } = parameters;

    const whereFilter = {};
    const databaseQueryParameters = queryParameters({ page, whereFilter });
    const data = await this.prisma.worker.findMany(databaseQueryParameters);
    const nextPage = await getNextPage({
      currentPage: page,
      collection: this.prisma.worker,
      whereFilter,
    });

    return { data, nextPage };
  }

  async getById(id: number): Promise<Worker | null> {
    return this.prisma.worker.findUnique({ where: { id } });
  }
}
