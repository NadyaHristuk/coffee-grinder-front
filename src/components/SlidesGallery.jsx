import { Box, Card, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material'
import { useState } from 'react'

const TYPE_COLORS = {
	'topic-overview': 'primary',
	'news-slide': 'success',
	'ad-or-title': 'warning',
	other: 'default',
}

function getImageSrc(slide) {
	// Prefer API thumbnail, fallback to local file
	return slide.thumbnailUrl || `/slides/${slide.slide}.png`
}

function SlideCard({ slide, onClick, selected }) {
	const [imgError, setImgError] = useState(false)
	const title = (slide.texts || [])[0] || slide.slide || `Slide ${slide.id}`
	const subtitle = (slide.texts || []).slice(1, 3).join(' | ')

	return (
		<Card
			sx={{
				cursor: 'pointer',
				border: selected ? '2px solid #1f4b99' : '2px solid transparent',
				transition: 'all 0.2s',
				'&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
			}}
			onClick={() => onClick(slide)}
		>
			{!imgError ? (
				<CardMedia
					component="img"
					height="140"
					image={getImageSrc(slide)}
					alt={slide.slide}
					sx={{ objectFit: 'cover', bgcolor: '#e8e0d4' }}
					onError={() => setImgError(true)}
				/>
			) : (
				<Box
					sx={{
						height: 140,
						bgcolor: '#e8e0d4',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography variant="h4" color="text.secondary">{slide.id}</Typography>
				</Box>
			)}
			<CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
				<Box display="flex" alignItems="center" gap={1} mb={0.5}>
					<Chip
						label={slide.type || 'unknown'}
						size="small"
						color={TYPE_COLORS[slide.type] || 'default'}
					/>
					<Typography variant="caption" color="text.secondary">#{slide.id}</Typography>
				</Box>
				<Typography variant="body2" fontWeight={600} noWrap>{title}</Typography>
				{subtitle && (
					<Typography variant="caption" color="text.secondary" noWrap>{subtitle}</Typography>
				)}
			</CardContent>
		</Card>
	)
}

function SlideDetail({ slide }) {
	if (!slide) return null
	const [imgError, setImgError] = useState(false)

	return (
		<Card sx={{ p: 3 }}>
			{!imgError ? (
				<Box mb={2}>
					<img
						src={getImageSrc(slide)}
						alt={slide.slide}
						style={{ width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8, background: '#e8e0d4' }}
						onError={() => setImgError(true)}
					/>
				</Box>
			) : (
				<Box
					sx={{
						height: 200,
						bgcolor: '#e8e0d4',
						borderRadius: 2,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						mb: 2,
					}}
				>
					<Typography variant="h3" color="text.secondary">{slide.slide}</Typography>
				</Box>
			)}
			<Box display="flex" gap={1} mb={2}>
				<Chip label={slide.type || 'unknown'} color={TYPE_COLORS[slide.type] || 'default'} />
				{slide.sqk && <Chip label={`SQK: ${slide.sqk}`} variant="outlined" size="small" />}
				{slide.topicId && <Chip label={`Topic: ${slide.topicId}`} variant="outlined" size="small" />}
			</Box>
			<Typography variant="h6" gutterBottom>Содержимое слайда</Typography>
			{(slide.texts || []).map((text, i) => (
				<Typography key={i} variant="body2" sx={{ mb: 0.5, pl: 1, borderLeft: '3px solid #ddd' }}>
					{text}
				</Typography>
			))}
			{(slide.urls || []).length > 0 && (
				<Box mt={2}>
					<Typography variant="subtitle2">Ссылки:</Typography>
					{slide.urls.map((url, i) => (
						<Typography key={i} variant="caption" display="block" color="primary">{url}</Typography>
					))}
				</Box>
			)}
		</Card>
	)
}

export default function SlidesGallery({ rows }) {
	const [selected, setSelected] = useState(null)
	const slides = rows || []

	return (
		<Box>
			<Box display="flex" gap={1} mb={2}>
				<Chip label={`Всего: ${slides.length}`} />
				{Object.entries(TYPE_COLORS).map(([type, color]) => {
					const count = slides.filter(s => s.type === type).length
					if (!count) return null
					return <Chip key={type} label={`${type}: ${count}`} size="small" color={color} variant="outlined" />
				})}
			</Box>

			<Grid container spacing={2}>
				<Grid item xs={12} md={selected ? 7 : 12}>
					<Grid container spacing={2}>
						{slides.map(slide => (
							<Grid item xs={6} sm={4} md={selected ? 4 : 3} lg={selected ? 3 : 2} key={slide.id}>
								<SlideCard
									slide={slide}
									onClick={setSelected}
									selected={selected?.id === slide.id}
								/>
							</Grid>
						))}
					</Grid>
				</Grid>
				{selected && (
					<Grid item xs={12} md={5}>
						<SlideDetail slide={selected} />
					</Grid>
				)}
			</Grid>
		</Box>
	)
}
