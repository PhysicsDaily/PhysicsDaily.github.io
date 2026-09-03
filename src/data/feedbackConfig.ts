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
	eyebrow: 'Feedback',
	title: 'Help us improve PhysicsDaily',
	lede: 'Spotted a typo, noticed an error in a derivation, or want to suggest a new chapter or interactive simulation? Let us know — we read every message.',
	placeholderMessage: 'What thoughts, suggestions, or corrections do you have?',
	placeholderEmail: 'Your email address',
	buttonText: 'Send feedback',
	successMessage: 'Thank you! Your feedback has been sent.',

	// Homepage callout section
	homeSectionEyebrow: 'Feedback',
	homeSectionTitle: 'Help us improve PhysicsDaily',
	homeSectionLede: 'Notice a mistake or have ideas for new topics and interactive simulations?',
	homeButtonText: 'Give feedback',
};
