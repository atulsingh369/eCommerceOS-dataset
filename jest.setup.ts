import '@testing-library/jest-dom';

// Global fetch mock
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
    })
) as jest.Mock;

// Mock TextEncoder/Decoder (often needed for Firebase/modern libs)
if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}

// Polyfill Response/Request for Firebase Auth
if (typeof global.Response === 'undefined') {
    // @ts-ignore
    global.Response = class Response {
        constructor() { }
    };
}
if (typeof global.Request === 'undefined') {
    // @ts-ignore
    global.Request = class Request {
        constructor() { }
    };
}
if (typeof global.Headers === 'undefined') {
    // @ts-ignore
    global.Headers = class Headers {
        constructor() { }
        append() { }
        delete() { }
        get() { }
        has() { }
        set() { }
        forEach() { }
    }
}
