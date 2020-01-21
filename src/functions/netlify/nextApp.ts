import next from "next";
import serverless from "serverless-http";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

export const handler = serverless(async (req: any, res: any) => {
  console.log("File: " + req.originalUrl);
  await app.prepare();
  return handle(req, res);
});
