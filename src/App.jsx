import { Box, Button, Chip, Collapse, Container, Divider, Tab, Tabs, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import ModeToggle from './components/ModeToggle.jsx'
import StatusSummary from './components/StatusSummary.jsx'
import NewsTable from './components/NewsTable.jsx'
import SheetTable from './components/SheetTable.jsx'
import SlidesGallery from './components/SlidesGallery.jsx'
import AudioPlaylist from './components/AudioPlaylist.jsx'
import AdsManager from './components/AdsManager.jsx'
import SheetEditor from './components/SheetEditor.jsx'
import NewsEditor from './components/NewsEditor.jsx'
import PromptsEditor from './components/PromptsEditor.jsx'
import { checkApi, fetchAudio, fetchNews, fetchPrompts, fetchSheets, fetchSlides, savePrompts, saveSheetLocal, saveSheetRemote, setDataMode, updateNews } from './api.js'

export default function App() {
	const [mode, setMode] = useState('admin')
	const [tab, setTab] = useState(0)
	const [settingsTab, setSettingsTab] = useState(0)
	const [showSettings, setShowSettings] = useState(true)
	const [news, setNews] = useState([])
	const [selectedRows, setSelectedRows] = useState([])
	const [toAdd, setToAdd] = useState([])
	const [prompts, setPrompts] = useState({ headers: [], rows: [] })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [apiStatus, setApiStatus] = useState({ ok: false })
	const [sheets, setSheets] = useState({})
	const [activeSheet, setActiveSheet] = useState('')
	const [slides, setSlides] = useState([])
	const [audio, setAudio] = useState([])
	const [localAds, setLocalAds] = useState([])
	const [archiveSheet, setArchiveSheet] = useState('')

	// Sheets whose name starts with "news " (with date) = archive releases
	const archiveSheets = useMemo(() =>
		Object.keys(sheets || {}).filter(name => name !== 'news' && /^news\s/i.test(name)).sort().reverse(),
		[sheets]
	)

	const loadAll = async () => {
		setLoading(true)
		setError('')
		try {
			const [newsData, promptsData] = await Promise.all([fetchNews(), fetchPrompts()])
			setNews(newsData)
			setPrompts(promptsData)
			const allSheets = await fetchSheets()
			setSheets(allSheets || {})
			const firstSheet = Object.keys(allSheets || {})[0] || ''
			setActiveSheet(firstSheet)
			const [slidesData, audioData] = await Promise.all([fetchSlides(), fetchAudio()])
			setSlides(slidesData || [])
			setAudio(audioData || [])
			const status = await checkApi()
			setApiStatus(status)
		} catch (e) {
			setError(e?.message || 'Ошибка загрузки')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadAll()
	}, [])

	const handleProcess = async () => {
		setLoading(true)
		setError('')
		try {
			await updateNews({ add: toAdd, remove: selectedRows })
			setToAdd([])
			setSelectedRows([])
			await loadAll()
		} catch (e) {
			setError(e?.message || 'Ошибка обновления')
		} finally {
			setLoading(false)
		}
	}

	const handleSavePrompts = async payload => {
		setLoading(true)
		setError('')
		try {
			await savePrompts(payload)
			await loadAll()
		} catch (e) {
			setError(e?.message || 'Ошибка сохранения промптов')
		} finally {
			setLoading(false)
		}
	}

	/* ── Manager tabs (primary) ── */
	const mainTabs = useMemo(
		() => [
			{ label: 'Обзор' },
			{ label: 'Слайды' },
			{ label: 'Аудио' },
			{ label: 'Реклама' },
			{ label: 'Архив' },
		],
		[]
	)

	/* ── Technical tabs (under Settings) ── */
	const techTabs = useMemo(
		() => [
			{ label: 'Новости' },
			{ label: 'Промпты' },
			{ label: 'Листы' },
			{ label: 'REF' },
			{ label: 'Расписание' },
			{ label: 'Ошибки' },
			{ label: 'Audio Промпты' },
		],
		[]
	)

	return (
		<Container maxWidth="xl" sx={{ pb: 6 }}>
			<Header mode={mode} />
			<Box display="flex" alignItems="center" gap={2} mb={2}>
				<Chip
					label={apiStatus.ok ? 'Работаем с Google (API)' : 'Локальные данные'}
					color={apiStatus.ok ? 'success' : 'warning'}
				/>
				<Button
					variant="outlined"
					size="small"
					onClick={async () => {
						setDataMode('api')
						const status = await checkApi()
						setApiStatus(status)
						await loadAll()
					}}
				>
					Подключиться к Google
				</Button>
				<Button
					variant="text"
					size="small"
					onClick={async () => {
						setDataMode('local')
						setApiStatus({ ok: false })
						await loadAll()
					}}
				>
					Локально
				</Button>
			</Box>
			<ModeToggle mode={mode} onChange={setMode} />

			{/* ── Main manager tabs ── */}
			<Tabs value={tab} onChange={(_, next) => { setTab(next); setShowSettings(false) }} sx={{ mb: 3 }}>
				{mainTabs.map((t, i) => (
					<Tab key={i} label={t.label} />
				))}
			</Tabs>

			{error && (
				<Box mb={2}>
					<Typography color="error">{error}</Typography>
				</Box>
			)}

			{loading && (
				<Box mb={2}>
					<Typography>Загрузка…</Typography>
				</Box>
			)}

			{/* ── 0: Dashboard ── */}
			{tab === 0 && (
				<Box>
					<StatusSummary rows={news} />
					<Divider sx={{ my: 3 }} />
					<Typography variant="h6" gutterBottom>Последние новости</Typography>
					<NewsTable rows={news} onSelectRemove={setSelectedRows} density="compact" />
				</Box>
			)}

			{/* ── 1: Slides Gallery ── */}
			{tab === 1 && (
				<Box>
					<Typography variant="h6" gutterBottom>Презентация</Typography>
					<SlidesGallery rows={slides} />
				</Box>
			)}

			{/* ── 2: Audio Playlist ── */}
			{tab === 2 && (
				<Box>
					<Typography variant="h6" gutterBottom>Аудио</Typography>
					<AudioPlaylist rows={audio} />
				</Box>
			)}

			{/* ── 3: Ads Manager ── */}
			{tab === 3 && (
				<Box>
					<Typography variant="h6" gutterBottom>Управление рекламой</Typography>
					<AdsManager
						ads={localAds}
						onSave={ads => setLocalAds(ads)}
						canSaveGoogle={apiStatus.ok}
						onSaveGoogle={ads => {
							const headers = ['id', 'title', 'url', 'active', 'startDate', 'endDate', 'position', 'notes']
							saveSheetRemote('ads', { headers, rows: ads })
						}}
					/>
				</Box>
			)}

			{/* ── 4: Archive ── */}
			{tab === 4 && (
				<Box>
					<Typography variant="h6" gutterBottom>Архив выпусков</Typography>
					{archiveSheets.length === 0 ? (
						<Typography color="text.secondary">Архивных выпусков пока нет.</Typography>
					) : (
						<>
							<Box display="flex" gap={1} flexWrap="wrap" mb={2}>
								{archiveSheets.map(name => (
									<Chip
										key={name}
										label={name.replace(/^news\s*/i, '')}
										onClick={() => setArchiveSheet(name)}
										color={archiveSheet === name ? 'primary' : 'default'}
										variant={archiveSheet === name ? 'filled' : 'outlined'}
										sx={{ cursor: 'pointer' }}
									/>
								))}
							</Box>
							{archiveSheet && sheets[archiveSheet] && (
								<>
									<Typography variant="subtitle2" color="text.secondary" mb={1}>
										{archiveSheet} ({(sheets[archiveSheet]?.rows || []).length} новостей)
									</Typography>
									<NewsTable
										rows={sheets[archiveSheet]?.rows || []}
										density="compact"
									/>
								</>
							)}
						</>
					)}
				</Box>
			)}

			{/* ── Settings toggle ── */}
			<Divider sx={{ my: 3 }} />
			<Button
				variant="text"
				onClick={() => setShowSettings(prev => !prev)}
				sx={{ mb: 1, textTransform: 'none', color: 'text.secondary' }}
			>
				{showSettings ? '\u25BC' : '\u25B6'} Настройки и технические данные
			</Button>

			<Collapse in={showSettings}>
				<Tabs
					value={settingsTab}
					onChange={(_, next) => setSettingsTab(next)}
					variant="scrollable"
					scrollButtons="auto"
					sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
				>
					{techTabs.map((t, i) => (
						<Tab key={i} label={t.label} />
					))}
				</Tabs>

				{/* ── Settings 0: News ── */}
				{settingsTab === 0 && (
					<Box>
						{mode === 'editor' ? (
							<NewsEditor
								rows={news}
								selected={selectedRows}
								onAddUrl={url => setToAdd(prev => [...prev, url])}
								onRemoveSelection={setSelectedRows}
								onProcess={handleProcess}
							/>
						) : (
							<Box mb={2}>
								<Button variant="contained" onClick={handleProcess}>Обработать изменения</Button>
							</Box>
						)}
						<NewsTable rows={news} onSelectRemove={setSelectedRows} />
					</Box>
				)}

				{/* ── Settings 1: Prompts ── */}
				{settingsTab === 1 && (
					<PromptsEditor
						headers={prompts.headers || []}
						rows={prompts.rows || []}
						onSave={handleSavePrompts}
						canSaveGoogle={apiStatus.ok}
						onSaveGoogle={payload => saveSheetRemote('ai-instructions', payload)}
					/>
				)}

				{/* ── Settings 2: All Sheets ── */}
				{settingsTab === 2 && (
					<Box>
						<Typography variant="h6" gutterBottom>Все листы таблицы</Typography>
						<Tabs
							value={activeSheet}
							onChange={(_, next) => setActiveSheet(next)}
							variant="scrollable"
							scrollButtons="auto"
							sx={{ mb: 2 }}
						>
							{Object.keys(sheets || {}).map(name => (
								<Tab key={name} label={name} value={name} />
							))}
						</Tabs>
						{activeSheet && (
							<SheetTable
								headers={sheets?.[activeSheet]?.headers || []}
								rows={sheets?.[activeSheet]?.rows || []}
							/>
						)}
					</Box>
				)}

				{/* ── Settings 3: REF ── */}
				{settingsTab === 3 && (
					<SheetEditor
						title="REF"
						headers={sheets?.REF?.headers || []}
						rows={sheets?.REF?.rows || []}
						onSave={payload => {
							saveSheetLocal('REF', payload)
							setSheets(prev => ({ ...prev, REF: payload }))
						}}
						canSaveGoogle={apiStatus.ok}
						onSaveGoogle={payload => saveSheetRemote('REF', payload)}
					/>
				)}

				{/* ── Settings 4: Schedule ── */}
				{settingsTab === 4 && (
					sheets?.schedule ? (
						<SheetEditor
							title="Расписание"
							headers={sheets?.schedule?.headers || []}
							rows={sheets?.schedule?.rows || []}
							onSave={payload => {
								saveSheetLocal('schedule', payload)
								setSheets(prev => ({ ...prev, schedule: payload }))
							}}
							canSaveGoogle={apiStatus.ok}
							onSaveGoogle={payload => saveSheetRemote('schedule', payload)}
						/>
					) : (
						<Typography color="text.secondary">Лист "schedule" не найден в таблице.</Typography>
					)
				)}

				{/* ── Settings 5: Errors ── */}
				{settingsTab === 5 && (
					sheets?.errors ? (
						<SheetEditor
							title="Ошибки"
							headers={sheets?.errors?.headers || []}
							rows={sheets?.errors?.rows || []}
							onSave={payload => {
								saveSheetLocal('errors', payload)
								setSheets(prev => ({ ...prev, errors: payload }))
							}}
							canSaveGoogle={apiStatus.ok}
							onSaveGoogle={payload => saveSheetRemote('errors', payload)}
						/>
					) : (
						<Typography color="text.secondary">Лист "errors" не найден в таблице.</Typography>
					)
				)}

				{/* ── Settings 6: Audio Prompts ── */}
				{settingsTab === 6 && (
					sheets?.audio ? (
						<SheetEditor
							title="Audio Промпты"
							headers={sheets?.audio?.headers || []}
							rows={sheets?.audio?.rows || []}
							onSave={payload => {
								saveSheetLocal('audio', payload)
								setSheets(prev => ({ ...prev, audio: payload }))
							}}
							canSaveGoogle={apiStatus.ok}
							onSaveGoogle={payload => saveSheetRemote('audio', payload)}
						/>
					) : (
						<Typography color="text.secondary">Лист "audio" не найден в таблице.</Typography>
					)
				)}
			</Collapse>
		</Container>
	)
}
