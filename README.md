# iracing_plugin Weather

An external weather widget for irDashies, based on the built-in Weather widget
from [`feat/weather-redesign-main`](https://github.com/estem8/irdashies/tree/feat/weather-redesign-main).

It displays track and air temperature, wind speed and direction, humidity,
precipitation, and track wetness. Settings control units, layout, background
opacity, visible readings, and whether the widget hides while the player is off
track. It consumes only `session-bar.snapshot` and `track-state.snapshot`.

The plugin does not reproduce the built-in track-rubber display: that value is
currently sourced from session data and is not part of the public plugin
snapshot contract. It also does not include the built-in demo wind animation.

## Build

Requirements: Node.js 24+, npm, Python 3.

```sh
npm ci
npm run typecheck
npm run build
```

The build writes `release/iracing-weather-widget-v<version>.zip`. Copy that ZIP
to the irDashies `plugins/` directory and restart the app. In irDashies, add
**Weather** from the **Plugins** category.

The host currently exposes the plugin SDK from the irDashies `widget-plugins`
branch. Until `@irdashies/plugin-api` is published, this repository carries a
small local declaration shim in `src/plugin-api.d.ts` for type-checking; plugin
runtime bundles do not include the SDK or a second React copy.

## CI and releases

Pull requests and pushes to `main` run type checking, build the plugin ZIP, and
upload it as a workflow artifact. Pushing a `v*` tag runs the same build, sets
the manifest version from the tag, and creates a GitHub Release with the ZIP
attached. For example:

```sh
git tag v1.0.0
git push origin v1.0.0
```

Plugins run as trusted JavaScript in the shared irDashies renderer. Do not
install packages whose code you do not trust.

## Source reference

Weather UI and behavior were adapted from irDashies commit `fea11973`
(`fix(weather): correct forecast alert timing`) on branch
`feat/weather-redesign-main`. This repository contains an independent plugin
implementation; it does not copy irDashies internal modules or import its
private telemetry bridge.
