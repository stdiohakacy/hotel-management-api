import { ValidationError } from '@nestjs/common';
import {
    IErrors,
    IErrorsImport,
    IValidationErrorImport,
} from '../../../core/error/interfaces/error.interface';
import {
    IMessageErrorOptions,
    IMessageOptions,
    IMessageSetOptions,
} from '../../../core/message/interfaces/message.interface';

export interface IMessageService {
    getAvailableLanguages(): string[];
    getLanguage(): string;
    filterLanguage(customLanguages: string[]): string[];
    setMessage(lang: string, key: string, options?: IMessageSetOptions): string;
    getRequestErrorsMessage(
        requestErrors: ValidationError[],
        options?: IMessageErrorOptions
    ): IErrors[];
    getImportErrorsMessage(
        errors: IValidationErrorImport[],
        options?: IMessageErrorOptions
    ): IErrorsImport[];
    get<T = string>(key: string, options?: IMessageOptions): T;
}
