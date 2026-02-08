import { Box, Button, Card, CardContent, Chip, Grid, Paper, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const DEFAULT_AD = {
	title: '',
	url: '',
	active: true,
	startDate: '',
	endDate: '',
	position: 'any',
	notes: '',
}

function AdCard({ ad, index, onToggle, onDelete, onUpdate }) {
	return (
		<Card
			variant="outlined"
			sx={{
				opacity: ad.active ? 1 : 0.5,
				transition: 'opacity 0.2s',
			}}
		>
			<CardContent>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
					<Box display="flex" alignItems="center" gap={1}>
						<Chip
							label={ad.active ? 'Активна' : 'Выключена'}
							color={ad.active ? 'success' : 'default'}
							size="small"
						/>
						{ad.position && ad.position !== 'any' && (
							<Chip label={`Позиция: ${ad.position}`} size="small" variant="outlined" />
						)}
					</Box>
					<Box display="flex" alignItems="center" gap={1}>
						<Switch
							checked={ad.active}
							onChange={() => onToggle(index)}
							size="small"
						/>
						<Button size="small" color="error" onClick={() => onDelete(index)}>
							Удалить
						</Button>
					</Box>
				</Box>

				<TextField
					label="Название"
					value={ad.title || ''}
					onChange={e => onUpdate(index, 'title', e.target.value)}
					fullWidth
					size="small"
					sx={{ mb: 1.5 }}
				/>
				<TextField
					label="Ссылка / материал"
					value={ad.url || ''}
					onChange={e => onUpdate(index, 'url', e.target.value)}
					fullWidth
					size="small"
					sx={{ mb: 1.5 }}
				/>
				<Box display="flex" gap={2}>
					<TextField
						label="Дата начала"
						type="date"
						value={ad.startDate || ''}
						onChange={e => onUpdate(index, 'startDate', e.target.value)}
						InputLabelProps={{ shrink: true }}
						size="small"
						fullWidth
					/>
					<TextField
						label="Дата окончания"
						type="date"
						value={ad.endDate || ''}
						onChange={e => onUpdate(index, 'endDate', e.target.value)}
						InputLabelProps={{ shrink: true }}
						size="small"
						fullWidth
					/>
				</Box>
				<TextField
					label="Заметки"
					value={ad.notes || ''}
					onChange={e => onUpdate(index, 'notes', e.target.value)}
					fullWidth
					size="small"
					multiline
					minRows={1}
					sx={{ mt: 1.5 }}
				/>
			</CardContent>
		</Card>
	)
}

export default function AdsManager({ ads, onSave, onSaveGoogle, canSaveGoogle }) {
	const [localAds, setLocalAds] = useState(ads || [])

	const handleAdd = () => {
		setLocalAds(prev => [...prev, { ...DEFAULT_AD, id: Date.now() }])
	}

	const handleDelete = (index) => {
		setLocalAds(prev => prev.filter((_, i) => i !== index))
	}

	const handleToggle = (index) => {
		setLocalAds(prev => {
			const next = [...prev]
			next[index] = { ...next[index], active: !next[index].active }
			return next
		})
	}

	const handleUpdate = (index, field, value) => {
		setLocalAds(prev => {
			const next = [...prev]
			next[index] = { ...next[index], [field]: value }
			return next
		})
	}

	const activeCount = localAds.filter(a => a.active).length

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Box display="flex" gap={1}>
					<Chip label={`Всего: ${localAds.length}`} />
					<Chip label={`Активных: ${activeCount}`} color="success" variant="outlined" />
				</Box>
				<Button variant="outlined" onClick={handleAdd}>
					+ Добавить рекламу
				</Button>
			</Box>

			{localAds.length === 0 && (
				<Paper sx={{ p: 4, textAlign: 'center' }}>
					<Typography color="text.secondary">
						Рекламы пока нет. Нажмите "Добавить рекламу" чтобы создать первую.
					</Typography>
				</Paper>
			)}

			<Grid container spacing={2}>
				{localAds.map((ad, index) => (
					<Grid item xs={12} md={6} key={ad.id || index}>
						<AdCard
							ad={ad}
							index={index}
							onToggle={handleToggle}
							onDelete={handleDelete}
							onUpdate={handleUpdate}
						/>
					</Grid>
				))}
			</Grid>

			{localAds.length > 0 && (
				<Box mt={3} display="flex" gap={2}>
					<Button variant="contained" onClick={() => onSave(localAds)}>
						Сохранить локально
					</Button>
					<Button
						variant="outlined"
						disabled={!canSaveGoogle}
						onClick={() => onSaveGoogle && onSaveGoogle(localAds)}
					>
						Сохранить в Google
					</Button>
				</Box>
			)}
		</Box>
	)
}
