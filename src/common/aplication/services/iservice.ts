import { Result } from 'src/common/result/result';

export interface IService<T, O> {
  execute(request: T): Promise<Result<O>>;
}
