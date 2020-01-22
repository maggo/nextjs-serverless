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
function nextRouteToNetlifyPath(route) {
  return route
    .replace(/\[\.\.\.[^\]]*\]/gi, "*")
    .replace(/\[([^\]]*)\]/gi, ":$1");
}

// Filter out existing next rewrite routes
const dynamicSourceRoutes = dynamicRoutes.map(nextRouteToNetlifyPath);
const ssrSourceRoutes = ssrRoutes.map(nextRouteToNetlifyPath);
const cleanNetlifyRewrites = (netlifyConfig.redirects || []).filter(
  redirect =>
    !dynamicSourceRoutes.includes(redirect.from) &&
    !ssrSourceRoutes.includes(redirect.from)
);

// Generate netlify redirect rules for static and SSR routes, with clean rules in the front
const redirects = cleanNetlifyRewrites.concat(
  ssrRoutes.map(route => ({
    from: nextRouteToNetlifyPath(route),
    to: "/.netlify/functions/nextApp",
    status: 200,
    force: true
  })),
  dynamicRoutes
    .filter(route => !ssrRoutes.includes(route))
    .map(route => ({
      from: nextRouteToNetlifyPath(route),
      to: route + ".html",
      status: 200,
      force: true
    }))
);

const newNetlifyConfig = { ...netlifyConfig, redirects };

fs.writeFileSync("netlify.toml", toml.stringify(newNetlifyConfig));

console.log("Saved new netlify.toml with rewrites");
