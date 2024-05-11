import { Constructor } from '../../../types';
import { BaseDTO } from '../dto/base.dto';
import { BaseEntity } from '../entity/base.entity';

export function UseDTO(
    dtoClass: Constructor<BaseDTO, [BaseEntity, unknown]>
): ClassDecorator {
    return (ctor) => {
        ctor.prototype.dtoClass = dtoClass;
    };
}
