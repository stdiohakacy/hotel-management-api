import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { DatabaseDefaultUUID } from '../../../../core/database/constants/database.function.constant';
import { IRequestApp } from '../../../../core/request/interfaces/request.interface';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    async use(
        req: IRequestApp,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const uuid: string = DatabaseDefaultUUID();

        req.__id = uuid;
        next();
    }
}
