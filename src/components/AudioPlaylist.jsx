import { Box, Button, Card, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useRef, useState } from 'react'

function formatSize(bytes) {
	if (!bytes) return ''
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(seconds) {
	if (!seconds || !Number.isFinite(seconds)) return ''
	const min = Math.floor(seconds / 60)
	const sec = Math.floor(seconds % 60)
	return `${min}:${sec.toString().padStart(2, '0')}`
}

export default function AudioPlaylist({ rows }) {
	const [playing, setPlaying] = useState(null)
	const [durations, setDurations] = useState({})
	const audioRef = useRef(null)
	const files = rows || []

	const handlePlay = (file) => {
		if (playing === file.name) {
			audioRef.current?.pause()
			setPlaying(null)
		} else {
			if (audioRef.current) {
				audioRef.current.pause()
			}
			const audio = new Audio(`/audio/${file.name}`)
			audio.onended = () => setPlaying(null)
			audio.onloadedmetadata = () => {
				setDurations(prev => ({ ...prev, [file.name]: audio.duration }))
			}
			audio.play()
			audioRef.current = audio
			setPlaying(file.name)
		}
	}

	return (
		<Box>
			<Typography variant="body2" color="text.secondary" mb={2}>
				{files.length} файлов
			</Typography>

			<Card>
				<List disablePadding>
					{files.map((file, index) => (
						<ListItem
							key={file.name}
							divider={index < files.length - 1}
							sx={{
								bgcolor: playing === file.name ? 'action.selected' : 'transparent',
								'&:hover': { bgcolor: 'action.hover' },
							}}
							secondaryAction={
								<Box display="flex" alignItems="center" gap={2}>
									<Typography variant="caption" color="text.secondary">
										{formatDuration(durations[file.name])}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{formatSize(file.size)}
									</Typography>
								</Box>
							}
						>
							<Button
								variant={playing === file.name ? 'contained' : 'outlined'}
								size="small"
								onClick={() => handlePlay(file)}
								sx={{ mr: 2, minWidth: 40 }}
							>
								{playing === file.name ? '\u23F8' : '\u25B6'}
							</Button>
							<ListItemText
								primary={file.name}
								primaryTypographyProps={{ fontWeight: playing === file.name ? 700 : 400 }}
							/>
						</ListItem>
					))}
				</List>
			</Card>
		</Box>
	)
}
