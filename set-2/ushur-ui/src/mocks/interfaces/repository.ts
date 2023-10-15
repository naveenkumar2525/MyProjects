export interface Repository<T> {
  findById(id: string): T | undefined;
  updateById(id: string, data: T): void;
}
