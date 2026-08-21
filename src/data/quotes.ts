import type { ImageMetadata } from 'astro';

import curiePortrait from '../assets/portraits/curie.jpg';
import einsteinPortrait from '../assets/portraits/einstein.jpg';
import feynmanPortrait from '../assets/portraits/feynman.jpg';
import galileoPortrait from '../assets/portraits/galileo.jpg';
import maxwellPortrait from '../assets/portraits/maxwell.jpg';
import newtonPortrait from '../assets/portraits/newton.jpg';
import ramanujanPortrait from '../assets/portraits/ramanujan.jpg';

/**
 * The homepage features one scientist and one of their quotes per day.
 *
 * Every quote carries a real citation, because a physics site that quotes
 * loosely undercuts its own point. Attributions were checked against Wikiquote's
 * sourced sections; anything that exists only as a poster caption was left out.
 * Two popular lines were rejected on those grounds and should stay rejected:
 *
 *   - "Any fool can know. The point is to understand." (Einstein) — no primary source.
 *   - "Measure what is measurable, and make measurable what is not so." (Galileo)
 *     — traces to Cournot and Martin, not Galileo.
 *
 * Every portrait is public domain or CC0. Note that Feynman's rests on a weaker
 * footing than the rest: the Caltech yearbook photographs are public domain
 * because they were published in the US without a copyright notice, not because
 * the author is long dead or the work is a government one. If that ever looks
 * too thin, his Los Alamos ID badge photograph is a US Army work and therefore
 * unambiguously public domain.
 */
export interface Quote {
	text: string;
	/** Work, letter, or lecture the line comes from, without the year. */
	source: string;
	year: string;
	/** Set when the words reach us secondhand, so the citation can say so. */
	reported?: boolean;
	/** Set when the wording depends on a translator's choices. */
	translated?: boolean;
}

export interface Scientist {
	name: string;
	/** Lifespan, shown under the name. */
	lived: string;
	field: string;
	portrait: ImageMetadata;
	/**
	 * CSS `object-position` for the hero's 4:3 frame, tuned per portrait so the
	 * crop keeps the head clear of the top edge. Verified by rendering the exact
	 * crop each value produces rather than by guessing.
	 */
	focus: string;
	/** Attribution for the portrait, shown in small print. */
	credit: string;
	/** A scientist with nothing to quote cannot be featured, so at least one. */
	quotes: readonly [Quote, ...Quote[]];
}

export const scientists: Scientist[] = [
	{
		name: 'Albert Einstein',
		lived: '1879–1955',
		field: 'Relativity',
		portrait: einsteinPortrait,
		focus: '50% 12%',
		credit: 'Photograph by Ferdinand Schmutzer, 1921. Public domain.',
		quotes: [
			{
				text: 'The whole of science is nothing more than a refinement of everyday thinking.',
				source: 'Physics and Reality',
				year: '1936',
			},
			{
				text: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.',
				source: 'interview with George Sylvester Viereck, The Saturday Evening Post',
				year: '1929',
			},
		],
	},
	{
		name: 'Isaac Newton',
		lived: '1642–1727',
		field: 'Mechanics',
		portrait: newtonPortrait,
		focus: '50% 3%',
		credit: 'Portrait by Godfrey Kneller, 1689. Public domain.',
		quotes: [
			{
				text: 'If I have seen further, it is by standing on the shoulders of giants.',
				source: 'letter to Robert Hooke, spelling modernised',
				year: '1676',
			},
			{
				text: 'Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.',
				source: 'Rules for methodizing the Apocalypse, printed in Frank E. Manuel, The Religion of Isaac Newton',
				year: '1974',
			},
		],
	},
	{
		name: 'Galileo Galilei',
		lived: '1564–1642',
		field: 'Mathematics of nature',
		portrait: galileoPortrait,
		focus: '50% 0%',
		credit: 'Portrait by Justus Sustermans, 1636. Public domain.',
		quotes: [
			{
				text: 'Philosophy is written in this grand book — I mean the universe … It is written in the language of mathematics.',
				source: 'Il Saggiatore',
				year: '1623',
				translated: true,
			},
		],
	},
	{
		name: 'James Clerk Maxwell',
		lived: '1831–1879',
		field: 'Electrodynamics',
		portrait: maxwellPortrait,
		focus: '50% 6%',
		credit: 'Gravure after an engraving by Stodart, from a photograph by Fergus. CC0.',
		quotes: [
			{
				text: 'It is of great advantage to the student of any subject to read the original memoirs on that subject.',
				source: 'A Treatise on Electricity and Magnetism, preface',
				year: '1873',
			},
			{
				text: 'Light … is an electromagnetic disturbance in the form of waves propagated through the electromagnetic field.',
				source: 'A Dynamical Theory of the Electromagnetic Field',
				year: '1864',
			},
		],
	},
	{
		name: 'Marie Curie',
		lived: '1867–1934',
		field: 'Radioactivity',
		portrait: curiePortrait,
		focus: '50% 10%',
		credit: 'Photograph by Henri Manuel, c. 1920s. Public domain.',
		quotes: [
			{
				text: 'I am among those who think that science has great beauty.',
				source: 'quoted in Ève Curie, Madame Curie',
				year: '1937',
				reported: true,
			},
			{
				text: 'All my life through, the new sights of Nature made me rejoice like a child.',
				source: 'Pierre Curie',
				year: '1923',
			},
		],
	},
	{
		name: 'Srinivasa Ramanujan',
		lived: '1887–1920',
		field: 'Mathematics',
		portrait: ramanujanPortrait,
		focus: '50% 10%',
		credit: 'Photograph c. 1919, Cambridge University Library. Public domain.',
		quotes: [
			{
				text: 'An equation has no meaning for me unless it expresses a thought of God.',
				source: 'recalled by S. R. Ranganathan, Ramanujan, the Man and the Mathematician',
				year: '1967',
				reported: true,
			},
			{
				text: 'I have no University education but I have undergone the ordinary school course.',
				source: 'letter to G. H. Hardy',
				year: '1913',
			},
		],
	},
	{
		name: 'Richard Feynman',
		lived: '1918–1988',
		field: 'Quantum physics',
		portrait: feynmanPortrait,
		focus: '50% 10%',
		credit: 'Photograph from The Big T, Caltech yearbook, 1959. Public domain.',
		quotes: [
			{
				text: 'What I cannot create, I do not understand.',
				source: 'written on his blackboard, Caltech Archives',
				year: '1988',
			},
			{
				text: 'The first principle is that you must not fool yourself — and you are the easiest person to fool.',
				source: '“Cargo Cult Science”, Caltech commencement address',
				year: '1974',
			},
		],
	},
];

export interface Feature {
	scientist: Scientist;
	quote: Quote;
}

/**
 * One entry per (scientist, quote) pair, built by taking every scientist's first
 * quote before anyone's second. Flattening scientist-by-scientist instead would
 * put the same face on consecutive days; this way a repeat is a whole cycle away.
 */
export const features: Feature[] = Array.from(
	{ length: Math.max(...scientists.map((s) => s.quotes.length)) },
	(_, round) =>
		scientists
			.filter((scientist) => scientist.quotes[round])
			.map((scientist) => ({ scientist, quote: scientist.quotes[round]! })),
).flat();

/**
 * The feature for a given day, counted in whole UTC days since the epoch so that
 * every visitor sees the same one and the choice never depends on the clock time
 * of a build. The site is static, so this is fixed at build time — the daily
 * rebuild in .github/workflows/deploy.yml is what actually advances it.
 */
export function getDailyFeature(now: Date = new Date()): Feature {
	if (!Number.isFinite(now.getTime())) {
		throw new TypeError('Expected a valid date.');
	}
	if (features.length === 0) {
		throw new Error('No scientist quotes are configured, so there is nothing to feature.');
	}

	const utcDay = Math.floor(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000,
	);
	// JavaScript's remainder keeps the dividend's sign, so dates before the Unix
	// epoch would index the array negatively and silently return undefined.
	const index = ((utcDay % features.length) + features.length) % features.length;
	return features[index]!;
}
