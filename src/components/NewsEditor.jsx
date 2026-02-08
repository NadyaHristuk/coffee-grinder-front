import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'

export default function NewsEditor({ onAddUrl, onProcess, selected }) {
	const [value, setValue] = useState('')

	const handleAdd = () => {
		const url = value.trim()
		if (!url) return
		onAddUrl(url)
		setValue('')
	}

	return (
		<Paper sx={{ p: 3, mb: 3 }}>
			<Typography variant="h6" gutterBottom>Управление новостями</Typography>
			<Box display="flex" gap={2} mb={2}>
				<TextField
					label="Добавить ссылку"
					value={value}
					onChange={e => setValue(e.target.value)}
					fullWidth
				/>
				<Button variant="outlined" onClick={handleAdd}>Добавить</Button>
			</Box>
			<Box display="flex" gap={2}>
				<Button variant="contained" onClick={onProcess}>Обработать изменения</Button>
				<Button variant="text" disabled={!selected.length}>
					Выбрано для удаления: {selected.length}
				</Button>
			</Box>
		</Paper>
	)
}
