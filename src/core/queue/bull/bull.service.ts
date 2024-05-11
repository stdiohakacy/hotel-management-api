import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class BullService {
    constructor(
        @InjectQueue('email-queue') private readonly emailQueue: Queue
    ) {}
}
