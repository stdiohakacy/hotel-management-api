import { DashboardDto } from '../../../core/dashboard/dtos/dashboard';
import { IDashboardStartAndEndDate } from '../../../core/dashboard/interfaces/dashboard.interface';

export interface IDashboardService {
    getStartAndEndDate(date?: DashboardDto): IDashboardStartAndEndDate;
    getPercentage(value: number, total: number): number;
}
