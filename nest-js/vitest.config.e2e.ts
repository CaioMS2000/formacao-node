import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	test: {
		globals: true,
		root: "./",
		include: ["**/*.e2e-spec.ts"],
		setupFiles: ["./test/setup-e2e.ts"],
	},
	plugins: [swc.vite({ module: { type: "es6" } }), tsConfigPaths()],
});
