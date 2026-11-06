# i-trends

This project uses Angular 22 and standalone components.

## Development server

Run `npm start` for a development server at `http://localhost:4200/`. The application automatically reloads when source files change.

## Application structure

The app bootstraps from `src/main.ts` using `bootstrapApplication`. Configure providers in `src/app/app.config.ts` and routes in `src/app/app.routes.ts`. Components are standalone and import the directives, pipes, and child components used by their templates.

Page components are loaded on demand through the router. Keep route-only code and data in those components so it stays out of the initial bundle. Product thumbnails use native lazy loading; only the first catalog row is prioritized.

Generate new components as standalone components with `ng generate component component-name --standalone`.

## Appearance

The storefront follows the device color preference by default. Use the sun/moon control in the top navigation to switch themes; your choice is saved in this browser.

## Virtual try-on

Product Explorer offers an optional live eyewear preview. It requests camera access only after the user starts the preview, requires HTTPS (or localhost), and stops the camera when the preview closes. Face tracking runs on-device; the first use downloads the MediaPipe runtime and face model. The overlay is an illustrative preview, not a guaranteed fit.

The overlay must use a transparent, tightly cropped front-facing PNG for the selected color variant; the catalog photos have backgrounds and are not used as overlays. Add the PNG under `src/assets/Images/try-on/` and set that variant's `tryOnImage` value in `src/assets/Json/products.json` to its `/assets/Images/try-on/...png` URL. Until a cutout is provided, the preview explains that it is unavailable and does not request camera access.

## Build

Run `npm run build` to build the project. Build artifacts are stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

For more help with the Angular CLI, run `npx ng help` or see the [Angular CLI documentation](https://angular.dev/tools/cli).
