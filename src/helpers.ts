/**
 * Converts an IndexedDB request into a Promise
 * @template T The type of the result that will be returned by the IndexedDB request
 * @param request The IndexedDB request to convert to a Promise
 * @returns A Promise that resolves with the request result or rejects with an error message
 */
export async function idbRequestToPromise<T>(request: IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener("success", () => {
      resolve(request.result);
    });
    request.addEventListener("error", (event: Event) => {
      reject(event);
    });
  });
}
