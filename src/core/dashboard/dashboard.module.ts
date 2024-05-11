import { Module } from '@nestjs/common';
import { DashboardService } from '../../core/dashboard/services/dashboard.service';

@Module({
    controllers: [],
    providers: [DashboardService],
    exports: [DashboardService],
    imports: [],
})
export class DashboardModule {}
