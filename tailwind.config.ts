import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [forms],
} satisfies Config
