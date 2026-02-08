import { Box, Chip, Typography } from '@mui/material'

export default function Header({ mode }) {
	return (
		<Box mt={4} mb={3} display="flex" alignItems="center" gap={2}>
			<Typography variant="h4">Coffee Grinder Console</Typography>
			<Chip label={mode === 'admin' ? 'Админка' : 'Редактор'} color="secondary" />
		</Box>
	)
}
