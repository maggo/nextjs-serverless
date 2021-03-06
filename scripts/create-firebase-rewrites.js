const fs = require("fs");

const firebaseConfig = JSON.parse(fs.readFileSync(`firebase.json`));
const pages = JSON.parse(fs.readFileSync(`.next/server/pages-manifest.json`));
const prerenderManifest = JSON.parse(
  fs.readFileSync(".next/prerender-manifest.json")
);
const routesManifest = JSON.parse(
  fs.readFileSync(".next/routes-manifest.json")
);

const prerenderedRoutes = Object.keys(prerenderManifest.routes);
const dynamicRoutes = routesManifest.dynamicRoutes.map(route => route.page);

// Everything that's not prerendered (SSG) or a next internal file is categorized as SSR
const ssrRoutes = Object.entries(pages)
  .filter(
    ([route, file]) =>
      ![...prerenderedRoutes, "/", "/_app", "/_document", "/_error"].includes(
        route
      ) && file.endsWith(".js")
  )
  .map(([route]) => route);

// [foo] becomes *, [...foo] becomes **
function nextRouteToGlob(route) {
  return route.replace(/\[\.\.\.[^\]]*\]/gi, "**").replace(/\[[^\]]*\]/gi, "*");
}

// Filter out existing next rewrite routes
const dynamicSourceRoutes = dynamicRoutes.map(nextRouteToGlob);
const ssrSourceRoutes = ssrRoutes.map(nextRouteToGlob);
const cleanFirebaseRewrites = (firebaseConfig.hosting.rewrites || []).filter(
  rewrite =>
    !dynamicSourceRoutes.includes(rewrite.source) &&
    !ssrSourceRoutes.includes(rewrite.source)
);

// Generate firebase rewrite rules for static and SSR routes, with clean rules in the front
const rewrites = cleanFirebaseRewrites.concat(
  ssrRoutes.map(route => ({
    source: nextRouteToGlob(route),
    function: "nextApp"
  })),
  dynamicRoutes
    .filter(route => !ssrRoutes.includes(route))
    .map(route => ({
      source: nextRouteToGlob(route),
      destination: route + ".html"
    }))
);

const newFirebaseConfig = {
  ...firebaseConfig,
  hosting: {
    ...(firebaseConfig.hosting || {}),
    rewrites
  }
};

fs.writeFileSync("firebase.json", JSON.stringify(newFirebaseConfig, null, 2));

console.log("Saved new firebase.json with rewrites");
