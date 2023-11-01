# Bryntum Grid plugin for Vue 3

## Source

<https://www.bryntum.com/docs/grid/guide/Grid/quick-start/vue-3>

## Notes

This contains curated default values and utility functions for FSL's grid configurations

The plugin portion which was originally registering the BryntumGrid component globally was removed in favor of importing it as needed
In the event vue cell renderers are needed this can server as a location to register those globally if the script setup composition api is not hoisting names correctly

## Getting started

### Authenticating with Bryntum

Ensure there is a .npmrc file at the root of the project with both a registry link to Font Awesome as well as our token

```text
@bryntum:registry=https://npm.bryntum.com
//npm.bryntum.com/:_authToken=<OUR_AUTH_TOKEN_HERE>
```

### Installing packages

The following commands will install the required npm packages that are compliant with Vue 3 and our license

```sh
npm i --save @bryntum/grid,
```

```sh
npm i --save @bryntum/grid-vue-3
```

### Configuring Vite

The following line must be included in the vite.config.ts file to prevent Bryntum from being included twice, which causes runtime erro

```typeScript
  optimizeDeps: {
    include: ["@bryntum/grid", "@bryntum/grid-vue-3"],
  },
```
