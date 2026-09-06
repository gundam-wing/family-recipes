import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import transcriptions from '../data/transcriptions.json';

export interface RecipePage {
	page: number;
	file: string;
	title: string | null;
	text: string;
}

export interface Recipe {
	id: string;
	slug: string;
	title: string;
	category: string;
	subcategory: string | null;
	pages: RecipePage[];
	text: string;
	featuredImage: string | null;
}

interface Transcription {
	title: string | null;
	text: string;
}

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const PAGE_SUFFIX = /^(.*?)[_\-]?(\d+)$/;

function titleFromSlug(slug: string): string {
	return slug
		.split('-')
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/** Capital Case: first letter of each whitespace-/hyphen-/slash-separated word uppercased. */
export function toCapitalCase(title: string): string {
	return title
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/[^\s]+/g, (word) =>
			word
				.split(/([-/])/)
				.map((part) => {
					if (part === '-' || part === '/' || !part) return part;
					return part.replace(/^([^\p{L}]*)(\p{L})(.*)$/u, (_, prefix: string, first: string, rest: string) =>
						prefix + first.toLocaleUpperCase('en-US') + rest.toLocaleLowerCase('en-US'),
					);
				})
				.join(''),
		);
}

function collectImages(dir: string, files: string[] = []): string[] {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			collectImages(full, files);
		} else if (IMAGE_EXT.has(entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase())) {
			files.push(full);
		}
	}
	return files;
}

function recipeId(category: string, subcategory: string | null, slug: string): string {
	return subcategory ? `${category}/${subcategory}/${slug}` : `${category}/${slug}`;
}

const FEATURED_EXT = ['.png', '.jpg', '.jpeg', '.webp'];

function featuredImageFor(id: string): string | null {
	const root = join(process.cwd(), 'public', 'featured');
	for (const ext of FEATURED_EXT) {
		const rel = `${id}${ext}`;
		if (existsSync(join(root, rel))) {
			return `featured/${rel}`;
		}
	}
	return null;
}

export function featuredHref(base: string, featuredImage: string): string {
	const prefix = base.endsWith('/') ? base : `${base}/`;
	return `${prefix}${featuredImage.split('/').map(encodeURIComponent).join('/')}`;
}

export function loadRecipes(): Recipe[] {
	const root = join(process.cwd(), 'recipes');
	const byId = new Map<string, Recipe>();
	const notes = transcriptions as Record<string, Transcription>;

	for (const full of collectImages(root).sort()) {
		const rel = relative(root, full).split('\\').join('/');
		const parts = rel.split('/');
		const filename = parts[parts.length - 1];
		const category = parts[0];
		const subcategory = parts.length > 2 ? parts[1] : null;
		const stem = filename.replace(/\.[^.]+$/, '');
		const match = stem.match(PAGE_SUFFIX);
		const rawBase = match ? match[1] : stem;
		const page = match ? Number(match[2]) : 1;
		const slug = rawBase.replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
		const id = recipeId(category, subcategory, slug);
		const note = notes[rel];

		const recipe = byId.get(id) ?? {
			id,
			slug,
			title: titleFromSlug(slug),
			category,
			subcategory,
			pages: [],
			text: '',
			featuredImage: featuredImageFor(id),
		};

		recipe.pages.push({
			page,
			file: rel,
			title: note?.title ?? null,
			text: note?.text ?? '',
		});

		if (!byId.has(id)) {
			byId.set(id, recipe);
		}
	}

	const recipes = [...byId.values()].map((recipe) => {
		recipe.pages.sort((a, b) => a.page - b.page || a.file.localeCompare(b.file));
		const titled = recipe.pages.find((p) => p.title);
		if (titled?.title) {
			recipe.title = toCapitalCase(titled.title);
		}
		recipe.text = recipe.pages
			.map((p) => p.text.trim())
			.filter(Boolean)
			.join('\n\n');
		return recipe;
	});

	recipes.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
	return recipes;
}

export function getRecipe(id: string): Recipe | undefined {
	return loadRecipes().find((recipe) => recipe.id === id);
}

export function listCategories(recipes: Recipe[]): string[] {
	return [...new Set(recipes.map((recipe) => recipe.category))].sort();
}

export function categoryLabel(category: string, subcategory: string | null): string {
	return subcategory ? `${category} / ${subcategory}` : category;
}

export function recipeHref(base: string, id: string): string {
	const prefix = base.endsWith('/') ? base : `${base}/`;
	return `${prefix}recipe/${id}/`;
}

export function imageHref(base: string, file: string): string {
	const prefix = base.endsWith('/') ? base : `${base}/`;
	return `${prefix}recipes/${file.split('/').map(encodeURIComponent).join('/')}`;
}

export function homeHref(base: string): string {
	return base.endsWith('/') ? base : `${base}/`;
}
