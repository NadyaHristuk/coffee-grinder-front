import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

export default function PromptsEditor({ headers, rows, onSave, onSaveGoogle, canSaveGoogle }) {
	const [localRows, setLocalRows] = useState(rows)

	useEffect(() => {
		setLocalRows(rows)
	}, [rows])

	const columns = useMemo(() => (headers || []).filter(Boolean), [headers])

	const updateCell = (rowIndex, key, value) => {
		setLocalRows(prev => {
			const next = [...prev]
			next[rowIndex] = { ...next[rowIndex], [key]: value }
			return next
		})
	}

	return (
		<Paper sx={{ p: 3 }}>
			<Typography variant="h6" gutterBottom>AI Prompts (ai-instructions)</Typography>
			<Box display="grid" gap={2}>
				{localRows.map((row, rowIndex) => (
					<Paper key={rowIndex} variant="outlined" sx={{ p: 2 }}>
						<Typography variant="subtitle2" gutterBottom>Строка {rowIndex + 1}</Typography>
						<Box display="grid" gap={2}>
							{columns.map(column => (
								<TextField
									key={`${rowIndex}-${column}`}
									label={column}
									value={row?.[column] || ''}
									multiline={column.toLowerCase().includes('prompt')}
									minRows={column.toLowerCase().includes('prompt') ? 3 : 1}
									onChange={e => updateCell(rowIndex, column, e.target.value)}
									fullWidth
								/>
							))}
						</Box>
					</Paper>
				))}
			</Box>
			<Box mt={3} display="flex" gap={2}>
				<Button variant="contained" onClick={() => onSave({ headers, rows: localRows })}>
					Сохранить локально
				</Button>
				<Button
					variant="outlined"
					disabled={!canSaveGoogle}
					onClick={() => onSaveGoogle && onSaveGoogle({ headers, rows: localRows })}
				>
					Сохранить в Google
				</Button>
			</Box>
		</Paper>
	)
}
