const axios = require("axios");
const app = require("../../src/server");
let server;
let baseURL;

beforeAll(() => {
  return new Promise((resolve, reject) => {
    server = app.listen(0, () => {
      const { port, family } = server.address();
      const host = family === 'IPv6' ? '[::1]' : '127.0.0.1';
      baseURL = `http://${host}:${port}`;
      resolve();
    });
    server.on('error', (err) => {
      reject(err);
    });
  });
});

afterAll(() => {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
});

describe("E2E GET /hello", () => {
  it("responds with Hello world", async () => {
    const res = await axios.get(`${baseURL}/hello`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world!");
  });

  it("responds with Hello world and name parameter", async () => {
    const res = await axios.get(`${baseURL}/hello/David`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From David");
  });
});

describe("E2E POST /hello", () => {
  it("responds with Hello world when no x-name header", async () => {
    const res = await axios.post(`${baseURL}/hello`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world!");
  });

  it("responds with Hello world with name from x-name header", async () => {
    const res = await axios.post(`${baseURL}/hello`, {}, {
      headers: { "x-name": "Eve" }
    });
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From Eve");
  });
});
