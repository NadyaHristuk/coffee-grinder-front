import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

export default function ModeToggle({ mode, onChange }) {
	return (
		<Box mb={3} display="flex" alignItems="center" gap={2}>
			<Typography variant="subtitle1">Режим:</Typography>
			<ToggleButtonGroup
				value={mode}
				exclusive
				onChange={(_, next) => next && onChange(next)}
				size="small"
			>
				<ToggleButton value="admin">Админка</ToggleButton>
				<ToggleButton value="editor">Редактор</ToggleButton>
			</ToggleButtonGroup>
		</Box>
	)
}
