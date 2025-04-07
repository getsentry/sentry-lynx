
/**
 * In contrast to the regular `dropUndefinedKeys` method,
 * this one does not deep-drop keys, but only on the top level.
 */
export function dropTopLevelUndefinedKeys<T extends object>(obj: T): Partial<T> {
  const mutatedObj: Partial<T> = {};

  for (const k of Object.getOwnPropertyNames(obj)) {
    const key = k as keyof T;
    if (obj[key] !== undefined) {
      mutatedObj[key] = obj[key];
    }
  }

  return mutatedObj;
}
