import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				/** Small tracked label shown above the hero headline. */
				eyebrow: z.string().optional(),
				/** Short honest claims listed under the hero call to action. */
				facts: z.array(z.string()).default([]),
				/** Position in the sidebar reading order; unordered pages sort last. */
				order: z.number().int().optional(),
				/** Sidebar label when it should differ from the page title. */
				label: z.string().optional(),
			}),
		}),
	}),
};
