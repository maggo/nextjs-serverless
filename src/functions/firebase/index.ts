import * as functions from "firebase-functions";
import next from "next";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` }
});
const handle = app.getRequestHandler();

export const nextApp = functions.https.onRequest(async (req, res) => {
  console.log("File: " + req.originalUrl);
  await app.prepare();
  return handle(req, res);
});
