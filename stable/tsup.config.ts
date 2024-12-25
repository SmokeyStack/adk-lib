import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['scripts/main.ts'],
    bundle: true,
    minify: true,
    sourcemap: false,
    format: ['esm'],
    outDir: '../packs/BP/scripts',
    external: ['@minecraft/server'],
    noExternal: ['adk-scripts-server'],
    outExtension({}) {
        return {
            js: `.js`
        };
    }
});
