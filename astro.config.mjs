// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const [repositoryOwner = '', repositoryName = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isGitHubPagesBuild = Boolean(repositoryOwner && repositoryName);
// Owner and repository names are case-insensitive on GitHub, and Pages serves the
// user/organization site from a lowercase host, so normalize before comparing.
const host = `${repositoryOwner.toLowerCase()}.github.io`;
const isUserOrOrganizationSite = repositoryName.toLowerCase() === host;

export default defineConfig({
	site: process.env.SITE_URL ?? (isGitHubPagesBuild ? `https://${host}` : undefined),
	base:
		process.env.BASE_PATH ??
		(isGitHubPagesBuild && !isUserOrOrganizationSite ? `/${repositoryName}` : '/'),
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
			sidebar: [
				{ label: 'Introduction to Physics', slug: 'introduction-to-physics' },
				{
					label: 'Mechanics',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'mechanics' },
						{
							label: 'Chapter 1: Vectors',
							slug: 'mechanics/chapter-1-vectors',
						},
						{
							label: 'Chapter 2: Kinematics',
							slug: 'mechanics/chapter-2-kinematics',
						},
					],
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
