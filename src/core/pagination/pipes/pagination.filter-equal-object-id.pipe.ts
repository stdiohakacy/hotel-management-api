import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { PaginationService } from '../../../core/pagination/services/pagination.service';
import { IRequestApp } from '../../../core/request/interfaces/request.interface';

export function PaginationFilterEqualObjectIdPipe(
    field: string,
    raw: boolean
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterEqualObjectIdPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: string): Promise<Record<string, any | string>> {
            if (!value) {
                return undefined;
            }

            value = value.trim();
            const finalValue = value;
            // Types.ObjectId.isValid(value)
            //     ? new Types.ObjectId(value)
            //     : value;

            if (raw) {
                return {
                    [field]: value,
                };
            }

            return this.paginationService.filterEqual<any | string>(
                field,
                finalValue
            );
        }
    }

    return mixin(MixinPaginationFilterEqualObjectIdPipe);
}
