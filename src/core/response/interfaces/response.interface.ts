import { HttpStatus } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { ENUM_HELPER_FILE_TYPE } from '../../../core/helper/constants/helper.enum.constant';
import { IHelperFileRows } from '../../../core/helper/interfaces/helper.interface';
import { IMessageOptionsProperties } from '../../../core/message/interfaces/message.interface';

export interface IResponseCustomPropertyMetadata {
    statusCode?: number;
    message?: string;
    httpStatus?: HttpStatus;
    messageProperties?: IMessageOptionsProperties;
}

// metadata
export interface IResponseMetadata {
    customProperty?: IResponseCustomPropertyMetadata;
    [key: string]: any;
}

// decorator options

export interface IResponseOptions<T> {
    serialization?: ClassConstructor<T>;
    messageProperties?: IMessageOptionsProperties;
}

export interface IResponsePagingOptions<T>
    extends Omit<IResponseOptions<T>, 'serialization'> {
    serialization: ClassConstructor<T>;
}

export interface IResponseFileOptions<T> extends IResponseOptions<T> {
    fileType?: ENUM_HELPER_FILE_TYPE;
}

// type
export interface IResponse {
    _metadata?: IResponseMetadata;
    data?: Record<string, any>;
}

export interface IResponsePagingPagination {
    totalPage: number;
    total: number;
}

export interface IResponsePaging {
    _metadata?: IResponseMetadata;
    _pagination: IResponsePagingPagination;
    data: Record<string, any>[];
}

export interface IResponseFile {
    data: IHelperFileRows[];
}
