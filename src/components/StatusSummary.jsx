import { Box, Paper, Typography } from '@mui/material'

export default function StatusSummary({ rows }) {
	const total = rows.length
	const errors = rows.filter(r => String(r.status || '').toLowerCase() === 'error').length
	const pending = rows.filter(r => String(r.status || '').toLowerCase() === 'pending').length
	const done = total - errors - pending

	return (
		<Box display="flex" gap={2} mb={3}>
			<Paper sx={{ p: 2, flex: 1 }}>
				<Typography variant="subtitle2">Всего</Typography>
				<Typography variant="h6">{total}</Typography>
			</Paper>
			<Paper sx={{ p: 2, flex: 1 }}>
				<Typography variant="subtitle2">Готово</Typography>
				<Typography variant="h6">{done}</Typography>
			</Paper>
			<Paper sx={{ p: 2, flex: 1 }}>
				<Typography variant="subtitle2">В ожидании</Typography>
				<Typography variant="h6">{pending}</Typography>
			</Paper>
			<Paper sx={{ p: 2, flex: 1 }}>
				<Typography variant="subtitle2">Ошибки</Typography>
				<Typography variant="h6">{errors}</Typography>
			</Paper>
		</Box>
	)
}
