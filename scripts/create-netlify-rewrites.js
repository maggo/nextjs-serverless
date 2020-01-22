const fs = require("fs");
const toml = require("@iarna/toml");

const netlifyConfig = toml.parse(fs.readFileSync(`netlify.toml`));
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
const cleanNetlifyRewrites = (netlifyConfig.rewrites || []).filter(
  rewrite => !dynamicSourceRoutes.includes(rewrite.from)
);

// Generate netlify rewrite rules for static and SSR routes, with clean rules in the front
const rewrites = cleanNetlifyRewrites.concat(
  dynamicRoutes.map(route => {
    // [foo] becomes *, [...foo] becomes **
    const from = nextRouteToGlob(route);

    return ssrRoutes.includes(route)
      ? {
          from,
          to: "/.netlify/functions/nextApp"
        }
      : {
          from,
          to: route + ".html"
        };
  })
);

const newNetlifyConfig = { ...netlifyConfig, rewrites };

fs.writeFileSync("netlify.toml", toml.stringify(newNetlifyConfig));

console.log("Saved new netlify.toml with rewrites");
