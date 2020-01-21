import * as functions from "firebase-functions";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

export const nextApp = functions.https.onRequest(async (req, res) => {
  console.log("File: " + req.originalUrl);
  await app.prepare();
  return handle(req, res);
});
