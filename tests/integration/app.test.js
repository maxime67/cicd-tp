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

describe("GET /hello", () => {
  it("should return Hello world", async () => {
    const res = await axios.get(`${baseURL}/hello`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world!");
  });

  it("should return Hello world with a name parameter", async () => {
    const res = await axios.get(`${baseURL}/hello/Bob`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From Bob");
  });
});

describe("POST /hello", () => {
  it("should return Hello world when no x-name header", async () => {
    const res = await axios.post(`${baseURL}/hello`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world!");
  });

  it("should return Hello world with a name from x-name header", async () => {
    const res = await axios.post(`${baseURL}/hello`, {}, {
      headers: { "x-name": "Charlie" }
    });
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From Charlie");
  });
});
