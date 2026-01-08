import { Ok, Err, isOk, isErr, unwrap, safeTry, Result } from "@/lib/result";

describe("Result Pattern", () => {
    it("creates Ok result", () => {
        const res = Ok("success");
        expect(res.ok).toBe(true);
        if (res.ok) {
            expect(res.value).toBe("success");
        }
    });

    it("creates Err result", () => {
        const error = new Error("fail");
        const res = Err(error);
        expect(res.ok).toBe(false);
        if (!res.ok) {
            expect(res.error).toBe(error);
        }
    });

    it("isOk checks correctly", () => {
        expect(isOk(Ok(1))).toBe(true);
        expect(isOk(Err(new Error()))).toBe(false);
    });

    it("isErr checks correctly", () => {
        expect(isErr(Ok(1))).toBe(false);
        expect(isErr(Err(new Error()))).toBe(true);
    });

    it("unwrap returns value or throws", () => {
        expect(unwrap(Ok(123))).toBe(123);
        expect(() => unwrap(Err(new Error("fail")))).toThrow("fail");
    });

    it("safeTry handles promises", async () => {
        const success = await safeTry(Promise.resolve("data"));
        expect(isOk(success)).toBe(true);

        const fail = await safeTry(Promise.reject(new Error("oops")));
        expect(isErr(fail)).toBe(true);
        if (isErr(fail)) {
            expect(fail.error.message).toBe("oops");
        }
    });
});
