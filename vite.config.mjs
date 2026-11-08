export default {
  build: {
    lib: {
      entry: 'src/WeatherWidget.tsx',
      name: 'IrdashiesPlugin_estem8$dot$weather',
      formats: ['iife'],
      fileName: () => 'index.js',
      cssFileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'window.__IRDASHIES_PLUGIN_HOST__.React',
          'react/jsx-runtime':
            'window.__IRDASHIES_PLUGIN_HOST__.jsxRuntime',
        },
      },
    },
  },
};
