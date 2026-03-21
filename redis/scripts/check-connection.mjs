import net from "node:net";
import tls from "node:tls";

const redisUrl = process.env.REDIS_URL;
const timeoutMs = Number(process.env.REDIS_CONNECT_TIMEOUT_MS ?? 10000);

if (!redisUrl) {
  console.error("Missing REDIS_URL");
  process.exit(1);
}

const parsed = new URL(redisUrl);
const isTls = parsed.protocol === "rediss:";
const host = parsed.hostname;
const port = Number(parsed.port || (isTls ? 6380 : 6379));
const password = decodeURIComponent(parsed.password || "");

const socket = isTls
  ? tls.connect({ host, port, servername: host })
  : net.connect({ host, port });

const cleanup = (code = 0) => {
  socket.destroy();
  process.exit(code);
};

socket.setTimeout(timeoutMs);

socket.on("connect", () => {
  const auth = password
    ? `*2\r\n$4\r\nAUTH\r\n$${password.length}\r\n${password}\r\n`
    : "";
  const ping = "*1\r\n$4\r\nPING\r\n";
  socket.write(auth + ping);
});

let received = "";
socket.on("data", (chunk) => {
  received += chunk.toString("utf8");
  if (received.includes("+PONG")) {
    console.log("Redis connection successful: PONG received");
    cleanup(0);
  }
  if (received.includes("-ERR") || received.includes("-NOAUTH")) {
    console.error("Redis replied with error:\n", received.trim());
    cleanup(1);
  }
});

socket.on("timeout", () => {
  console.error("Redis connection timed out");
  cleanup(1);
});

socket.on("error", (error) => {
  console.error("Redis connection failed:", error.message);
  cleanup(1);
});
