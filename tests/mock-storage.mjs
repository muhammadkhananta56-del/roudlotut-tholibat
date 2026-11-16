// Mock minimal Supabase Storage untuk pengujian lokal. Memeriksa header auth yang dikirim aplikasi.
import http from "node:http";

const KEY = process.env.MOCK_SERVICE_KEY || "test-service-role-key";
const BUCKET = "media";
export const objects = new Map();
const log = [];

export function startMock(port = 54321) {
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks);
    const url = new URL(req.url, "http://x");
    const pub = `/storage/v1/object/public/${BUCKET}/`;
    const up = `/storage/v1/object/${BUCKET}/`;
    if (url.pathname === "/__state") { res.setHeader("content-type", "application/json"); return res.end(JSON.stringify({ keys: [...objects.keys()], log })); }
    if (req.method === "GET" && url.pathname.startsWith(pub)) {
      const o = objects.get(url.pathname.slice(pub.length));
      if (!o) { res.statusCode = 404; return res.end("nf"); }
      res.setHeader("content-type", o.type); return res.end(o.data);
    }
    const authed = req.headers.authorization === `Bearer ${KEY}` && req.headers.apikey === KEY;
    if (!authed) { log.push({ m: req.method, p: url.pathname, denied: true }); res.statusCode = 401; return res.end("unauthorized"); }
    if (req.method === "POST" && url.pathname.startsWith(up)) {
      const p = url.pathname.slice(up.length);
      if (objects.has(p)) { res.statusCode = 409; return res.end("exists"); }
      objects.set(p, { data: body, type: req.headers["content-type"] });
      log.push({ m: "POST", p, type: req.headers["content-type"], bytes: body.length, cache: req.headers["cache-control"] });
      res.setHeader("content-type", "application/json"); return res.end(JSON.stringify({ Key: `${BUCKET}/${p}` }));
    }
    if (req.method === "DELETE" && url.pathname === `/storage/v1/object/${BUCKET}`) {
      const { prefixes } = JSON.parse(body.toString());
      for (const p of prefixes) objects.delete(p);
      log.push({ m: "DELETE", prefixes });
      res.setHeader("content-type", "application/json"); return res.end("[]");
    }
    res.statusCode = 404; res.end("nf");
  });
  return new Promise((r) => server.listen(port, "127.0.0.1", () => r(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) { await startMock(); console.log("mock storage di :54321"); }
