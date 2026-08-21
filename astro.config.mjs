// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { generateSidebar } from './src/data/generateSidebar.mjs';

const [repositoryOwner = '', repositoryName = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isGitHubPagesBuild = Boolean(repositoryOwner && repositoryName);
// Owner and repository names are case-insensitive on GitHub, and Pages serves the
// user/organization site from a lowercase host, so normalize before comparing.
const host = `${repositoryOwner.toLowerCase()}.github.io`;
const isUserOrOrganizationSite = repositoryName.toLowerCase() === host;

const base =
	process.env.BASE_PATH ??
	(isGitHubPagesBuild && !isUserOrOrganizationSite ? `/${repositoryName}` : '/');
// Astro prefixes a redirect's own route with the base but writes its destination out
// as given, so the destination has to carry the base itself. `/` leaves no prefix.
const basePrefix = base.replace(/\/$/, '');

export default defineConfig({
	site: process.env.SITE_URL ?? (isGitHubPagesBuild ? `https://${host}` : undefined),
	base,
	// A chapter split into sections has no page of its own, so the chapter's own URL
	// — published while the chapter was still a single page, and the natural thing to
	// link or type — sends the reader to the section the chapter begins at.
	redirects: {
		'/mechanics/chapter-2-kinematics': `${basePrefix}/mechanics/chapter-2-kinematics/position-and-displacement/`,
	},
	integrations: [
		starlight({
			title: 'PhysicsDaily',
			description:
				'Clear, structured physics notes with diagrams, videos, equations, and interactive simulations.',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				alt: '',
			},
			components: {
				Hero: './src/components/overrides/Hero.astro',
				PageFrame: './src/components/overrides/PageFrame.astro',
				Sidebar: './src/components/overrides/Sidebar.astro',
				ThemeProvider: './src/components/overrides/ThemeProvider.astro',
				ThemeSelect: './src/components/overrides/ThemeSelect.astro',
			},
			routeMiddleware: './src/starlightRouteData.ts',
			customCss: [
				'@fontsource-variable/source-serif-4/wght.css',
				'@fontsource-variable/inter/wght.css',
				'@fontsource-variable/inter/wght-italic.css',
				'katex/dist/katex.min.css',
				'./src/styles/custom.css',
			],
			// The sidebar is generated from the files in src/content/docs/ — see
			// generateSidebar.mjs. Adding a page means creating the file; its `order`
			// frontmatter places it in the reading order.
			sidebar: [
				{ label: 'Introduction to Physics', slug: 'introduction-to-physics' },
				{
					label: 'Mechanics',
					collapsed: true,
					items: generateSidebar('mechanics'),
				},
			],
		}),
	],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex],
		}),
	},
});
