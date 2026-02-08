import seedNews from './data/news.json'
import seedPrompts from './data/prompts.json'
import seedSheets from './data/sheets.json'
import seedSlides from './data/slides.json'
import seedAudio from './data/audio.json'
import seedRelease from './data/release.json'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'
const defaultUseLocal = import.meta.env.VITE_USE_LOCAL_DATA === '1'
const MODE_KEY = 'coffeeGrinderDataMode'

function shouldUseLocal() {
	const stored = localStorage.getItem(MODE_KEY)
	if (stored === 'api') return false
	if (stored === 'local') return true
	return defaultUseLocal
}

export function setDataMode(mode) {
	if (mode === 'api' || mode === 'local') {
		localStorage.setItem(MODE_KEY, mode)
	}
}

const STORAGE_KEYS = {
	news: 'coffeeGrinderNews',
	prompts: 'coffeeGrinderPrompts',
	sheets: 'coffeeGrinderSheets',
	release: 'coffeeGrinderRelease',
}

function readLocal(key, fallback) {
	try {
		const raw = localStorage.getItem(key)
		if (!raw) return fallback
		return JSON.parse(raw)
	} catch {
		return fallback
	}
}

function writeLocal(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {}
}

export async function fetchNews() {
	if (shouldUseLocal()) {
		return readLocal(STORAGE_KEYS.news, seedNews)
	}
	try {
		const res = await fetch(`${API_BASE}/report`)
		if (!res.ok) throw new Error('Failed to load news')
		const data = await res.json()
		// API returns { headers, rows } — extract rows array, keep compat with seed format
		if (data && Array.isArray(data.rows)) return data.rows
		if (Array.isArray(data)) return data
		return readLocal(STORAGE_KEYS.news, seedNews)
	} catch {
		return readLocal(STORAGE_KEYS.news, seedNews)
	}
}

export async function updateNews(payload) {
	const applyLocal = () => {
		const current = readLocal(STORAGE_KEYS.news, seedNews)
		const removeSet = new Set((payload?.remove || []).map(String))
		const filtered = current.filter(row => !removeSet.has(String(row.id)))
		const add = (payload?.add || []).map((url, index) => ({
			id: filtered.length + index + 1,
			url,
			status: 'pending',
			result: '',
			error: '',
			processed_at: '',
		}))
		const next = [...filtered, ...add]
		writeLocal(STORAGE_KEYS.news, next)
		return { ok: true }
	}

	if (shouldUseLocal()) {
		return applyLocal()
	}
	try {
		const res = await fetch(`${API_BASE}/report/update`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
		if (!res.ok) throw new Error('Failed to update news')
		return await res.json()
	} catch {
		return applyLocal()
	}
}

export async function fetchPrompts() {
	if (shouldUseLocal()) {
		return readLocal(STORAGE_KEYS.prompts, seedPrompts)
	}
	try {
		const res = await fetch(`${API_BASE}/prompts`)
		if (!res.ok) throw new Error('Failed to load prompts')
		return await res.json()
	} catch {
		return readLocal(STORAGE_KEYS.prompts, seedPrompts)
	}
}

export async function savePrompts(payload) {
	if (shouldUseLocal()) {
		writeLocal(STORAGE_KEYS.prompts, payload)
		return { ok: true }
	}
	try {
		const res = await fetch(`${API_BASE}/prompts`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
		if (!res.ok) throw new Error('Failed to save prompts')
		return await res.json()
	} catch {
		writeLocal(STORAGE_KEYS.prompts, payload)
		return { ok: true }
	}
}

export async function fetchSheets() {
	if (shouldUseLocal()) {
		return readLocal(STORAGE_KEYS.sheets, seedSheets)
	}
	try {
		const res = await fetch(`${API_BASE}/sheets`)
		if (!res.ok) throw new Error('Failed to load sheets')
		return await res.json()
	} catch {
		return readLocal(STORAGE_KEYS.sheets, seedSheets)
	}
}

export function saveSheetLocal(sheetName, payload) {
	const current = readLocal(STORAGE_KEYS.sheets, seedSheets)
	current[sheetName] = payload
	writeLocal(STORAGE_KEYS.sheets, current)
	return { ok: true }
}

export async function saveSheetRemote(sheetName, payload) {
	if (!sheetName) throw new Error('Sheet name is required')
	const res = await fetch(`${API_BASE}/sheets/${encodeURIComponent(sheetName)}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	})
	if (!res.ok) throw new Error('Failed to save sheet')
	return res.json()
}

export async function fetchSlides() {
	if (shouldUseLocal()) return seedSlides
	try {
		const res = await fetch(`${API_BASE}/slides`)
		if (!res.ok) throw new Error('Failed to load slides')
		return await res.json()
	} catch {
		return seedSlides
	}
}

export async function fetchAudio() {
	if (shouldUseLocal()) return seedAudio
	try {
		const res = await fetch(`${API_BASE}/audio`)
		if (!res.ok) throw new Error('Failed to load audio')
		return await res.json()
	} catch {
		return seedAudio
	}
}

export async function fetchRelease() {
	if (shouldUseLocal()) {
		return readLocal(STORAGE_KEYS.release, seedRelease)
	}
	try {
		const res = await fetch(`${API_BASE}/release`)
		if (!res.ok) throw new Error('Failed to load release')
		return await res.json()
	} catch {
		return readLocal(STORAGE_KEYS.release, seedRelease)
	}
}

export function saveReleaseLocal(payload) {
	writeLocal(STORAGE_KEYS.release, payload)
	return { ok: true }
}
export async function checkApi() {
	try {
		const res = await fetch(`${API_BASE}/health`)
		if (!res.ok) return { ok: false }
		return await res.json()
	} catch {
		return { ok: false }
	}
}
