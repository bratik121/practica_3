export interface IService<T, O> {
  execute(request: T): Promise<O>;
}
