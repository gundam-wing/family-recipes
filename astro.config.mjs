// @ts-check
import { cpSync, mkdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';

function copyRecipeImages() {
	mkdirSync('public', { recursive: true });
	cpSync('recipes', 'public/recipes', { recursive: true });
}

// https://astro.build/config
export default defineConfig({
	site: 'https://gundam-wing.github.io',
	base: '/family-recipes',
	integrations: [
		{
			name: 'copy-recipe-images',
			hooks: {
				'astro:config:setup': copyRecipeImages,
			},
		},
	],
});
