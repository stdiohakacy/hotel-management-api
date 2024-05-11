import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { AppController } from './controllers/app.controller';
import { RouterModule } from '../router/router.module';
import { CommonModule } from '../core/common.module';

@Module({
    controllers: [AppController],
    providers: [],
    imports: [
        CommonModule,

        // Jobs
        JobsModule.forRoot(),

        // Routes
        RouterModule.forRoot(),
    ],
})
export class AppModule {}
