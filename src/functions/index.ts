import * as functions from "firebase-functions";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev
});
const handle = app.getRequestHandler();

export const nextApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
