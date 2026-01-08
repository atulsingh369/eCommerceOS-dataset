export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; value: T } => result.ok;

export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } => !result.ok;

export const unwrap = <T, E>(result: Result<T, E>): T => {
    if (result.ok) {
        return result.value;
    }
    throw result.error;
};

export const safeTry = async <T>(promise: Promise<T>): Promise<Result<T, Error>> => {
    try {
        const data = await promise;
        return Ok(data);
    } catch (error) {
        if (error instanceof Error) {
            return Err(error);
        }
        return Err(new Error(String(error)));
    }
};
