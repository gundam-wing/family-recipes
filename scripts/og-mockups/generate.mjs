/**
 * One-off OG card mockups for design review.
 * Usage: node scripts/og-mockups/generate.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const outDir = join(__dirname, 'out');
const fontsDir = join(__dirname, 'fonts');
const W = 1200;
const H = 630;

mkdirSync(outDir, { recursive: true });

const fonts = {
	dmSerif: readFileSync(join(fontsDir, 'dmserif.ttf')),
	fraunces: readFileSync(join(fontsDir, 'fraunces-700.ttf')),
	literata700: readFileSync(join(fontsDir, 'literata-700.ttf')),
	literata500: readFileSync(join(fontsDir, 'literata-500.ttf')),
	outfit500: readFileSync(join(fontsDir, 'outfit-500.ttf')),
	outfit600: readFileSync(join(fontsDir, 'outfit-600.ttf')),
	source600: readFileSync(join(fontsDir, 'sourceserif-600.ttf')),
	source400: readFileSync(join(fontsDir, 'sourceserif-400.ttf')),
	ibm400: readFileSync(join(fontsDir, 'ibm-400.ttf')),
	ibm500: readFileSync(join(fontsDir, 'ibm-500.ttf')),
};

const samples = [
	{
		id: 'beef/chili',
		title: 'Chili',
		category: 'Beef',
		featured: 'public/featured/beef/chili.jpg',
	},
	{
		id: 'dessert/cake/mary-annes-kentucky-butter-cake',
		title: "Mary Anne's Kentucky Butter Cake",
		category: 'Dessert · Cake',
		featured: 'public/featured/dessert/cake/mary-annes-kentucky-butter-cake.jpg',
	},
	{
		id: 'pork/pork-chops-and-lentils',
		title: 'Pork Chops & Lentils',
		category: 'Pork',
		featured: 'public/featured/pork/pork-chops-and-lentils.jpg',
	},
];

async function featuredDataUri(relPath) {
	const buf = await sharp(join(root, relPath))
		.resize(W, H, { fit: 'cover', position: 'centre' })
		.jpeg({ quality: 85 })
		.toBuffer();
	return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

/** A: Full-bleed photo, bottom veil, brand small above title */
function layoutPhotoVeil({ title, category, photo }) {
	return {
		type: 'div',
		props: {
			style: {
				width: '100%',
				height: '100%',
				display: 'flex',
				position: 'relative',
				backgroundColor: '#1a1a1a',
			},
			children: [
				{
					type: 'img',
					props: {
						src: photo,
						width: W,
						height: H,
						style: { position: 'absolute', top: 0, left: 0, width: W, height: H, objectFit: 'cover' },
					},
				},
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							display: 'flex',
							backgroundImage:
								'linear-gradient(to top, rgba(18,14,10,0.92) 0%, rgba(18,14,10,0.55) 42%, rgba(18,14,10,0.15) 70%, rgba(18,14,10,0.05) 100%)',
						},
					},
				},
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							padding: '56px 64px',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'Outfit',
										fontSize: 28,
										fontWeight: 600,
										letterSpacing: '0.14em',
										textTransform: 'uppercase',
										color: '#f0e6d8',
										marginBottom: 18,
									},
									children: 'Family Recipes',
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'Fraunces',
										fontSize: title.length > 28 ? 64 : 84,
										fontWeight: 700,
										lineHeight: 1.05,
										color: '#fffaf3',
										marginBottom: 16,
										maxWidth: 980,
									},
									children: title,
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'Outfit',
										fontSize: 26,
										fontWeight: 500,
										color: '#d4c4b0',
									},
									children: category,
								},
							},
						],
					},
				},
			],
		},
	};
}

/** B: Split — text panel left, photo right */
function layoutSplitLedge({ title, category, photo }) {
	return {
		type: 'div',
		props: {
			style: {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'row',
				backgroundColor: '#24352c',
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							width: 520,
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							padding: '56px 52px',
							backgroundColor: '#24352c',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										flexDirection: 'column',
									},
									children: [
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													fontFamily: 'Outfit',
													fontSize: 24,
													fontWeight: 600,
													letterSpacing: '0.16em',
													textTransform: 'uppercase',
													color: '#c5d4c0',
													marginBottom: 28,
												},
												children: 'Family Recipes',
											},
										},
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													width: 48,
													height: 3,
													backgroundColor: '#d4a574',
													marginBottom: 28,
												},
											},
										},
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													fontFamily: 'Literata',
													fontSize: title.length > 28 ? 48 : 58,
													fontWeight: 700,
													lineHeight: 1.12,
													color: '#f7f3ea',
												},
												children: title,
											},
										},
									],
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'Outfit',
										fontSize: 24,
										fontWeight: 500,
										color: '#a8b8a4',
									},
									children: category,
								},
							},
						],
					},
				},
				{
					type: 'div',
					props: {
						style: {
							flex: 1,
							height: '100%',
							display: 'flex',
							position: 'relative',
							overflow: 'hidden',
						},
						children: [
							{
								type: 'img',
								props: {
									src: photo,
									width: 680,
									height: H,
									style: { width: 680, height: H, objectFit: 'cover' },
								},
							},
						],
					},
				},
			],
		},
	};
}

/** C: Typography-only archival cover — no photo */
function layoutTypePlate({ title, category }) {
	return {
		type: 'div',
		props: {
			style: {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#1e2a36',
				backgroundImage:
					'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(180,140,90,0.12) 0%, transparent 40%)',
				padding: '64px',
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							border: '1px solid rgba(232,220,200,0.35)',
							padding: '56px 72px',
							width: '100%',
							height: '100%',
							justifyContent: 'center',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'IBM Plex Sans',
										fontSize: 22,
										fontWeight: 500,
										letterSpacing: '0.22em',
										textTransform: 'uppercase',
										color: '#c4b59a',
										marginBottom: 36,
									},
									children: 'Family Recipes',
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'DM Serif Display',
										fontSize: title.length > 28 ? 58 : 72,
										lineHeight: 1.15,
										color: '#f4efe6',
										textAlign: 'center',
										justifyContent: 'center',
										maxWidth: 900,
										marginBottom: 40,
									},
									children: title,
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										width: 64,
										height: 1,
										backgroundColor: 'rgba(232,220,200,0.45)',
										marginBottom: 28,
									},
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'IBM Plex Sans',
										fontSize: 24,
										fontWeight: 400,
										letterSpacing: '0.08em',
										color: '#9aa8b5',
									},
									children: category,
								},
							},
						],
					},
				},
			],
		},
	};
}

/** D: Photo dominant with slim bottom title bar (brand lives in the bar) */
function layoutBottomBar({ title, category, photo }) {
	const long = title.length > 28;
	return {
		type: 'div',
		props: {
			style: {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: '#111',
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							flex: 1,
							display: 'flex',
							overflow: 'hidden',
						},
						children: [
							{
								type: 'img',
								props: {
									src: photo,
									width: W,
									height: long ? 460 : 490,
									style: { width: W, height: long ? 460 : 490, objectFit: 'cover' },
								},
							},
						],
					},
				},
				{
					type: 'div',
					props: {
						style: {
							height: long ? 170 : 140,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							padding: '0 48px',
							backgroundColor: '#f7f1e8',
							gap: 10,
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
									},
									children: [
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													fontFamily: 'Outfit',
													fontSize: 18,
													fontWeight: 600,
													letterSpacing: '0.14em',
													textTransform: 'uppercase',
													color: '#6a5e52',
												},
												children: 'Family Recipes',
											},
										},
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													fontFamily: 'Outfit',
													fontSize: 20,
													fontWeight: 500,
													color: '#6a5e52',
												},
												children: category,
											},
										},
									],
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'Source Serif 4',
										fontSize: long ? 34 : 44,
										fontWeight: 600,
										lineHeight: 1.15,
										color: '#1c1814',
										maxWidth: 1100,
									},
									children: title,
								},
							},
						],
					},
				},
			],
		},
	};
}

/** E: Soft wash over photo, centered brand+title (cookbook cover) */
function layoutSoftCover({ title, category, photo }) {
	return {
		type: 'div',
		props: {
			style: {
				width: '100%',
				height: '100%',
				display: 'flex',
				position: 'relative',
				backgroundColor: '#2c241c',
			},
			children: [
				{
					type: 'img',
					props: {
						src: photo,
						width: W,
						height: H,
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							width: W,
							height: H,
							objectFit: 'cover',
							opacity: 0.45,
						},
					},
				},
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							display: 'flex',
							backgroundColor: 'rgba(44, 36, 28, 0.35)',
						},
					},
				},
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '64px',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'Outfit',
										fontSize: 26,
										fontWeight: 600,
										letterSpacing: '0.2em',
										textTransform: 'uppercase',
										color: '#e8dcc8',
										marginBottom: 28,
									},
									children: 'Family Recipes',
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'Fraunces',
										fontSize: title.length > 28 ? 56 : 76,
										fontWeight: 700,
										lineHeight: 1.1,
										color: '#fffaf2',
										textAlign: 'center',
										justifyContent: 'center',
										maxWidth: 920,
										marginBottom: 24,
									},
									children: title,
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: 'Outfit',
										fontSize: 24,
										fontWeight: 500,
										color: '#cbb89a',
									},
									children: category,
								},
							},
						],
					},
				},
			],
		},
	};
}

const layouts = [
	{ key: 'a-photo-veil', name: 'A · Photo veil', build: layoutPhotoVeil, needsPhoto: true, fontFaces: [
		{ name: 'Fraunces', data: fonts.fraunces, weight: 700 },
		{ name: 'Outfit', data: fonts.outfit600, weight: 600 },
		{ name: 'Outfit', data: fonts.outfit500, weight: 500 },
	]},
	{ key: 'b-split-ledge', name: 'B · Split ledge', build: layoutSplitLedge, needsPhoto: true, fontFaces: [
		{ name: 'Literata', data: fonts.literata700, weight: 700 },
		{ name: 'Outfit', data: fonts.outfit600, weight: 600 },
		{ name: 'Outfit', data: fonts.outfit500, weight: 500 },
	]},
	{ key: 'c-type-plate', name: 'C · Type plate', build: layoutTypePlate, needsPhoto: false, fontFaces: [
		{ name: 'DM Serif Display', data: fonts.dmSerif, weight: 400 },
		{ name: 'IBM Plex Sans', data: fonts.ibm400, weight: 400 },
		{ name: 'IBM Plex Sans', data: fonts.ibm500, weight: 500 },
	]},
	{ key: 'd-bottom-bar', name: 'D · Bottom bar', build: layoutBottomBar, needsPhoto: true, fontFaces: [
		{ name: 'Source Serif 4', data: fonts.source600, weight: 600 },
		{ name: 'Outfit', data: fonts.outfit600, weight: 600 },
		{ name: 'Outfit', data: fonts.outfit500, weight: 500 },
	]},
	{ key: 'e-soft-cover', name: 'E · Soft cover', build: layoutSoftCover, needsPhoto: true, fontFaces: [
		{ name: 'Fraunces', data: fonts.fraunces, weight: 700 },
		{ name: 'Outfit', data: fonts.outfit600, weight: 600 },
		{ name: 'Outfit', data: fonts.outfit500, weight: 500 },
	]},
];

async function render(tree, fontFaces) {
	const svg = await satori(tree, {
		width: W,
		height: H,
		fonts: fontFaces,
	});
	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: W },
	});
	return resvg.render().asPng();
}

const index = [];

for (const sample of samples) {
	const slug = sample.id.replaceAll('/', '__');
	const photo = await featuredDataUri(sample.featured);
	for (const layout of layouts) {
		const tree = layout.build({
			title: sample.title,
			category: sample.category,
			photo,
		});
		const png = await render(tree, layout.fontFaces);
		const file = `${layout.key}__${slug}.png`;
		writeFileSync(join(outDir, file), png);
		index.push({ layout: layout.name, key: layout.key, recipe: sample.title, file });
		console.log('wrote', file);
	}
}

writeFileSync(join(outDir, 'index.json'), JSON.stringify(index, null, 2));
console.log(`\nDone: ${index.length} mockups in ${outDir}`);
