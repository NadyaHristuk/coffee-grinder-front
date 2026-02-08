import { createTheme } from '@mui/material/styles'

export default createTheme({
	palette: {
		mode: 'light',
		primary: { main: '#1f4b99' },
		secondary: { main: '#c17e2f' },
		background: { default: '#f5f2ea', paper: '#ffffff' },
	},
	shape: { borderRadius: 10 },
	typography: {
		fontFamily: '"Space Grotesk", "Arial", sans-serif',
		h5: { fontWeight: 700 },
		button: { textTransform: 'none', fontWeight: 600 },
	},
})
