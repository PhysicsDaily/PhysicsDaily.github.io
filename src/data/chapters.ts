import { getCollection } from 'astro:content';

export interface Chapter {
	/** Short label such as `Chapter 2`, empty when the title has no prefix. */
	label: string;
	title: string;
	href: string;
}

const rawBase = import.meta.env.BASE_URL;
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/** Chapters of one branch, ordered by chapter number. */
export async function getChapters(branch: string): Promise<Chapter[]> {
	const entries = await getCollection('docs', ({ id }) => id.startsWith(`${branch}/chapter-`));

	return entries
		.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }))
		.map((entry) => {
			const [prefix, ...rest] = entry.data.title.split(':');
			const title = rest.join(':').trim();
			return {
				label: title ? (prefix?.trim() ?? '') : '',
				title: title || entry.data.title,
				href: `${base}${entry.id}/`,
			};
		});
}

export { base };
