/**
 * Builds Starlight sidebar entries from the files in a content directory, so
 * adding a page means creating the file — the sidebar picks it up on the next
 * build. Reading order comes from an `order` field in each page's frontmatter
 * (pages without one sort alphabetically after ordered ones; a directory's
 * index page always comes first). Labels come from each page's `title`, or its
 * `label` frontmatter when the sidebar should differ from the page heading.
 *
 * A subdirectory becomes a collapsible group. Its label, collapse state, and
 * position among its siblings are declared in an optional `_meta.json` beside
 * its pages:
 *
 *   { "title": "Chapter 2: Kinematics", "collapsed": true, "order": 2 }
 *
 * Without `_meta.json` the group takes the directory name as its label.
 *
 * Note the sidebar is built when the Astro config is evaluated — once at dev
 * server startup, and on each build. Creating a page while a dev server is
 * running requires restarting it to appear.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const docsRoot = fileURLToPath(new URL('../content/docs/', import.meta.url));

/**
 * Frontmatter reader backed by a real YAML parser. The collection loader parses
 * the same frontmatter itself, so reading it line by line here would let valid
 * YAML — an inline comment, a folded title — produce a sidebar that disagrees
 * with the schema without any diagnostic.
 */
function parseFrontmatter(path) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(path, 'utf8'));
	if (!match) return {};

	const document = parseDocument(match[1], { prettyErrors: false });
	if (document.errors.length > 0) {
		throw new Error(`${path} has invalid YAML frontmatter: ${document.errors[0].message}`);
	}

	const data = document.toJS();
	if (data === null || typeof data !== 'object' || Array.isArray(data)) {
		throw new Error(`${path} frontmatter must be a YAML mapping.`);
	}
	return data;
}

/** Extensions Starlight's docs loader builds a page from. */
const loadableExtensions = ['.md', '.mdx', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn'];
/** Extensions this generator supports; the slug rule below assumes the same set. */
const extensions = ['.md', '.mdx'];

const fileExtension = (name) => name.slice(name.lastIndexOf('.'));
const isPage = (name) => extensions.includes(fileExtension(name));

/** Fields a `_meta.json` may set, and the type each must have. */
const dirMetaFields = { title: 'string', collapsed: 'boolean', order: 'number' };

/**
 * Reads a subdirectory's `_meta.json`, if it has one. Page frontmatter is checked
 * by the collection schema, so this file is validated here to match: a mistyped
 * field would otherwise leave the group unlabeled or sorted to the end, which
 * looks exactly like having written no `_meta.json` at all.
 */
function readDirMeta(path) {
	if (!existsSync(path)) return {};

	let meta;
	try {
		meta = JSON.parse(readFileSync(path, 'utf8'));
	} catch (cause) {
		throw new Error(`${path} is not valid JSON: ${cause.message}`, { cause });
	}

	if (meta === null || typeof meta !== 'object' || Array.isArray(meta)) {
		throw new Error(`${path} must hold a JSON object.`);
	}

	for (const [key, value] of Object.entries(meta)) {
		const expected = dirMetaFields[key];
		if (!expected) {
			throw new Error(
				`${path} sets an unrecognized field \`${key}\`. Expected any of: ${Object.keys(dirMetaFields).join(', ')}.`
			);
		}
		if (typeof value !== expected) {
			throw new Error(`${path} field \`${key}\` must be a ${expected}, but is a ${typeof value}.`);
		}
		if (key === 'order' && !Number.isInteger(value)) {
			throw new Error(`${path} field \`order\` must be a whole number, but is ${value}.`);
		}
	}

	return meta;
}

/** Sidebar entries for one directory of the docs collection. */
export function generateSidebar(directory) {
	const root = join(docsRoot, directory);
	if (!existsSync(root)) {
		// A misspelled or renamed directory is a configuration error; returning an
		// empty sidebar would publish broken navigation and look like an empty branch.
		throw new Error(`Sidebar directory ${root} does not exist.`);
	}

	const files = [];
	const dirs = [];
	for (const name of readdirSync(root, { withFileTypes: true })) {
		if (name.name.startsWith('_')) continue;
		if (name.isDirectory()) {
			dirs.push(name.name);
		} else if (isPage(name.name)) {
			files.push(name.name);
		} else if (loadableExtensions.includes(fileExtension(name.name))) {
			// The docs loader would route and build this page, but the sidebar, chapter
			// counts, and chapter cards would all omit it — fail instead of drifting.
			throw new Error(
				`${join(root, name.name)} would be built but never appears in the sidebar. ` +
					`Rename it to one of: ${extensions.join(', ')}.`
			);
		}
	}

	const entries = [
		...files.map((file) => {
			const path = join(root, file);
			const frontmatter = parseFrontmatter(path);
			const { label, title, order } = frontmatter;
			// The collection schema checks these fields too, but it reports against the
			// parsed page while the sidebar reads the raw file — validate here as well so
			// the two cannot disagree about what the sidebar shows.
			if (label !== undefined && typeof label !== 'string') {
				throw new Error(`${path} field \`label\` must be a string, but is a ${typeof label}.`);
			}
			if (title !== undefined && typeof title !== 'string') {
				throw new Error(`${path} field \`title\` must be a string, but is a ${typeof title}.`);
			}
			if (order !== undefined && !Number.isInteger(order)) {
				throw new Error(`${path} field \`order\` must be a whole number, but is ${order}.`);
			}
			const base = file.replace(/\.(md|mdx)$/, '');
			const slug = base === 'index' ? directory : `${directory}/${base}`;
			return {
				entry: {
					label: label ?? title ?? base,
					slug,
					order: base === 'index' ? -Infinity : order,
					tiebreak: file,
				},
			};
		}),
		...dirs.map((dir) => {
			const dirMeta = readDirMeta(join(root, dir, '_meta.json'));
			return {
				entry: {
					label: dir,
					collapsed: true,
					items: generateSidebar(`${directory}/${dir}`),
					order: dirMeta.order,
					tiebreak: dir,
				},
				dirMeta,
			};
		}),
	];

	return entries
		.sort(
			(a, b) =>
				(a.entry.order ?? Number.MAX_VALUE) - (b.entry.order ?? Number.MAX_VALUE) ||
				a.entry.tiebreak.localeCompare(b.entry.tiebreak)
		)
		.map(({ entry, dirMeta }) => {
			if ('items' in entry) {
				return {
					label: dirMeta.title ?? entry.label,
					collapsed: dirMeta.collapsed ?? entry.collapsed,
					items: entry.items,
				};
			}
			const { label, slug } = entry;
			return { label, slug };
		});
}
