import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { PaginationService } from '../../../core/pagination/services/pagination.service';
import { IRequestApp } from '../../../core/request/interfaces/request.interface';

export function PaginationFilterEqualEnumPipe<T>(
    field: string,
    defaultValue: T,
    defaultEnum: Record<string, any>,
    raw: boolean
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterInEnumPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: string): Promise<Record<string, T>> {
            const finalValue: T = value
                ? defaultEnum[value.toUpperCase()] ?? defaultValue
                : defaultValue;

            if (raw) {
                return {
                    [field]: finalValue,
                };
            }

            return this.paginationService.filterEqual<T>(field, finalValue);
        }
    }

    return mixin(MixinPaginationFilterInEnumPipe);
}
