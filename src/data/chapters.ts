import type { StarlightRouteData } from '@astrojs/starlight/route-data';

type SidebarEntry = StarlightRouteData['sidebar'][number];
type SidebarGroup = Extract<SidebarEntry, { type: 'group' }>;

export interface Chapter {
	/** Short label such as `Chapter 2`, empty when the title has no prefix. */
	label: string;
	title: string;
	href: string;
}

const rawBase = import.meta.env.BASE_URL;
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/**
 * A chapter's page sits directly inside its branch and is named `chapter-…`, so
 * `mechanics/chapter-2-kinematics/` is a chapter while the sections beneath it are
 * not. That naming is what keeps the homepage counts and the overview cards in
 * step with the sidebar, so a page that ignores it is reported rather than left
 * to appear in the sidebar and be counted nowhere.
 */
const chapterPrefix = 'chapter-';

/** The page an entry opens: a link's own page, or the first page of a group. */
function entryPoint(entry: SidebarEntry): string | undefined {
	if (entry.type === 'link') return entry.href;
	for (const child of entry.entries) {
		const href = entryPoint(child);
		if (href) return href;
	}
	return undefined;
}

/**
 * The group holding a branch's chapters, however deeply the sidebar nests it. A
 * branch with an overview page is identified by that page: without it, the first
 * group whose entry point merely starts with `chapter-` could be a wrapper around
 * the real branch group, collapsing every chapter into one. A branch without an
 * overview page falls back to the first group directly holding a chapter.
 */
function findBranchGroup(
	entries: SidebarEntry[],
	isChapter: (entry: SidebarEntry) => boolean,
	branchHref: string
): SidebarGroup | undefined {
	let fallback: SidebarGroup | undefined;
	for (const entry of entries) {
		if (entry.type !== 'group') continue;
		if (entry.entries.some(isChapter)) {
			const holdsOverview = entry.entries.some(
				(child) => child.type === 'link' && child.href === branchHref
			);
			if (holdsOverview) return entry;
			fallback ??= entry;
		}
		const nested = findBranchGroup(entry.entries, isChapter, branchHref);
		if (nested) return nested;
	}
	return fallback;
}

// Every page renders through the same module instance, and a misplaced page is one
// fact about the content rather than one per page that lists it.
const reported = new Set<string>();

function report(message: string): void {
	if (reported.has(message)) return;
	reported.add(message);
	console.warn(`[chapters] ${message}`);
}

/**
 * Chapters of one branch, in the reading order the sidebar declares — the sidebar
 * being where that order is written down. A chapter split into section pages has no
 * page of its own, so it opens at its first section.
 */
export function getChapters(sidebar: SidebarEntry[], branch: string): Chapter[] {
	// Section pages live under their chapter, so only entries directly inside the
	// branch are chapters; anything deeper is part of one.
	const branchHref = `${base}${branch}/`;
	const prefix = `${branchHref}${chapterPrefix}`;
	const isChapter = (entry: SidebarEntry) => entryPoint(entry)?.startsWith(prefix) ?? false;

	const group = findBranchGroup(sidebar, isChapter, branchHref);
	if (!group) {
		report(`No sidebar group holds chapters for branch "${branch}", so none are listed.`);
		return [];
	}

	const chapters: Chapter[] = [];
	for (const entry of group.entries) {
		const href = entryPoint(entry);
		if (!href) continue;

		if (!href.startsWith(prefix)) {
			// A branch's own overview page sits beside its chapters and is not one.
			if (href !== branchHref) {
				report(
					`"${entry.label}" (${href}) sits directly inside ${branch} but is not named ` +
						`${chapterPrefix}…, so it appears in the sidebar yet is missing from chapter ` +
						`counts and overview cards.`
				);
			}
			continue;
		}

		const [numbering, ...rest] = entry.label.split(':');
		const title = rest.join(':').trim();
		chapters.push({
			label: title ? (numbering?.trim() ?? '') : '',
			title: title || entry.label,
			href,
		});
	}

	return chapters;
}

export { base };
