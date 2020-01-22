import next from "next";
import path from "path";
import serverless from "serverless-http";

const dev =
  (process.env.NETLIFY_FUNCTION_ENV || process.env.NODE_ENV) !== "production";
const app = next({ dev, conf: { distDir: path.join(__dirname, "next") } });
const handle = app.getRequestHandler();

export const handler = serverless(async (req: any, res: any) => {
  console.log("File: " + req.originalUrl);
  await app.prepare();
  return handle(req, res);
});
