/**
 * Configuration for the Feedback page and Google Form submission.
 */

export interface FeedbackConfig {
	/** Google Form POST endpoint ending in /formResponse */
	formActionUrl: string;
	/** Google Form entry parameter for the message field */
	messageEntryId: string;
	/** Google Form entry parameter for the email field */
	emailEntryId: string;
	/** Direct link to the Google Form */
	directFormUrl?: string;

	// Dedicated /feedback page copy
	eyebrow: string;
	title: string;
	lede: string;
	placeholderMessage: string;
	placeholderEmail: string;
	buttonText: string;
	successMessage: string;

	// Homepage callout section copy
	homeSectionEyebrow: string;
	homeSectionTitle: string;
	homeSectionLede: string;
	homeButtonText: string;
}

export const feedbackConfig: FeedbackConfig = {
	formActionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfgV2H3V_MM0weD2kZ4VktXVrn0bH0owMTSab-RgqT-_CyK0Q/formResponse',
	messageEntryId: 'entry.625974859',
	emailEntryId: 'emailAddress',
	directFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfgV2H3V_MM0weD2kZ4VktXVrn0bH0owMTSab-RgqT-_CyK0Q/viewform',

	// /feedback page copy
	eyebrow: 'Feedback & Appreciation',
	title: 'Feedback, suggestions, or appreciation',
	lede: 'Found a typo, have a question about a derivation, or simply want to say thanks? Whether it’s constructive feedback, an idea for a simulation, or a kind word of appreciation, we read and cherish every message.',
	placeholderMessage: 'Your feedback, suggestions, corrections, or a note of appreciation...',
	placeholderEmail: 'Your email address',
	buttonText: 'Send message',
	successMessage: 'Thank you! Your message has been sent.',

	// Homepage callout section
	homeSectionEyebrow: 'Feedback & Appreciation',
	homeSectionTitle: 'Share feedback or a kind note',
	homeSectionLede: 'Notice an error, have an idea for a simulation, or want to say thanks? We’d love to hear from you.',
	homeButtonText: 'Send feedback or appreciation',
};
