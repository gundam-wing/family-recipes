// @ts-check
import { cpSync, mkdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';

function copyRecipeImages() {
	mkdirSync('public', { recursive: true });
	cpSync('recipes', 'public/recipes', { recursive: true });
}

/** @param {string | undefined} value */
function normalizeBase(value) {
	if (!value) return '/family-recipes';
	const withLeading = value.startsWith('/') ? value : `/${value}`;
	return withLeading.replace(/\/+$/, '') || '/';
}

// PATH_PREFIX lets CI build PR previews under /family-recipes/preview/<n>
const base = normalizeBase(process.env.PATH_PREFIX);

// https://astro.build/config
export default defineConfig({
	site: 'https://gundam-wing.github.io',
	base,
	integrations: [
		{
			name: 'copy-recipe-images',
			hooks: {
				'astro:config:setup': copyRecipeImages,
			},
		},
	],
});
