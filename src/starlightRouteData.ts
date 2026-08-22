import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';

type SidebarEntry = StarlightRouteData['sidebar'][number];

/** Does this entry, or anything nested under it, link to the page being rendered? */
function holdsCurrentPage(entry: SidebarEntry): boolean {
	return entry.type === 'group' ? entry.entries.some(holdsCurrentPage) : entry.isCurrent;
}

/**
 * Narrow the sidebar to the branch the reader is in, so a mechanics chapter lists
 * mechanics chapters and nothing else. Routes with no sidebar match — the 404 page,
 * for instance — keep the full navigation.
 */
export const onRequest = defineRouteMiddleware(async (context, next) => {
	await next();

	const route = context.locals.starlightRoute;

	// Set page title to just the page's title without the "| SiteTitle" suffix
	const titleTag = route.head.find((tag) => tag.tag === 'title');
	if (titleTag && route.entry?.data?.title) {
		titleTag.content = route.entry.data.title;
	}

	// Splash pages stand outside the reading flow; the homepage also reads the full
	// sidebar to count its curriculum's chapters, so it must not be narrowed even if
	// a Home link is ever added to it.
	if (route.entry.data.template === 'splash') return;

	const branch = route.sidebar.find(holdsCurrentPage);
	if (!branch) return;

	route.sidebar = [branch.type === 'group' ? { ...branch, collapsed: false } : branch];
});
