import { PaginationListDto } from '../../../core/pagination/dtos/pagination.list.dto';

export abstract class BaseRepository<T> {
    abstract findOneById(id: string);

    abstract findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDto,
        options?: Record<string, any>
    );

    abstract create(entity: T): Promise<T>;

    abstract update(id: string, entity: Partial<T>): Promise<UpdateResult>;

    abstract delete(id: string): Promise<DeleteResult>;

    abstract truncate(): Promise<void>;
}
