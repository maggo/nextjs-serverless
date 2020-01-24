# nextjs-serverless POC

This project aims to make deployments of nextjs apps as easy as possible!

## The problem

While there are examples on how to deploy nextjs to firebase hosting and functions, they're set up in a way that _every_ request is routed through the function. This is suboptimal as nextjs itself is able to automatically prerender pages that are completely static and could therefor be served from a CDN together with all static assets.

The only hosting service that offers full nextjs compatibility out of the box is Zeit's own now service.

## The task

Develop a setup that enables the user to deploy a nextjs application to firebase hosting and function with full CDN coverage for static pages and assets.

As an added bonus this setup could also work as they're offering CDN hosting and functions.

## The solution

Deployments are done with the following steps:

1. Build the functions (See `src/functions`)
2. Build the nextjs app (`next build`)
3. Copy the build to the function directories so they're bundled
4. Export the app to `dist/static` (`next export`)
5. Delete all exported pages that are not 100% static for firebase rewrite compatibility, based on build manifests (`node scripts/delete-ssr-exports.js`)
6. Create rewrite rules for dynamic and SSR pages mirroring the routes defined in nextjs, based on build manifests (`node scripts/create-{firebase,netlify}-rewrites.js`)

## Demo

The demo site is deployed to both firebase and netlify:

- https://nextjs-serverless.netlify.com
- https://fir-nextjs-test.firebaseapp.com

All pages should work both as a SPA and requested from the server (refresh)

Static assets and pages are hosted from CDN while pages like https://fir-nextjs-test.firebaseapp.com/ssr are served through a function.
