import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { HelperArrayService } from '../../../core/helper/services/helper.array.service';
import { PaginationService } from '../../../core/pagination/services/pagination.service';
import { IRequestApp } from '../../../core/request/interfaces/request.interface';

export function PaginationFilterInBooleanPipe(
    field: string,
    defaultValue: boolean[],
    raw: boolean
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterInBooleanPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService,
            private readonly helperArrayService: HelperArrayService
        ) {}

        async transform(
            value: string
        ): Promise<Record<string, { $in: boolean[] } | boolean[]>> {
            let finalValue: boolean[] = defaultValue as boolean[];

            if (value) {
                finalValue = this.helperArrayService.unique(
                    value.split(',').map((val: string) => val === 'true')
                );
            }

            if (raw) {
                return {
                    [field]: finalValue,
                };
            }

            return this.paginationService.filterIn<boolean>(field, finalValue);
        }
    }

    return mixin(MixinPaginationFilterInBooleanPipe);
}
