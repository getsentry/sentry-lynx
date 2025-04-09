// Inspired by https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b
type Success<T> = {
  data: T;
  error: null;
};

type Failure = {
  data: null;
  error: Error;
};

type Result<T> = Success<T> | Failure;

export function tryCatch<T>(
  func: () => Promise<T>,
): Promise<Result<T>>;
export function tryCatch<T>(
  func: () => T,
): Result<T>;
export function tryCatch<T>(
  func: () => Promise<T> | T,
): Promise<Result<T>> | Result<T> {
  try {
    const data = func();
    if (data instanceof Promise) {
      return data
        .then(result => ({ data: result, error: null }))
        .catch(error => ({ data: null, error: error as Error }));
    }
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error };
    }
    return { data: null, error: new Error(String(error)) };
  }
}
