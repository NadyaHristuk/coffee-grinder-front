import { useMemo } from 'react'
import { DataGrid } from '@mui/x-data-grid'

// Ordered list of important columns to show first, with custom widths
const PRIORITY_COLUMNS = [
	{ field: 'id', headerName: 'ID', width: 70 },
	{ field: 'sqk', headerName: 'SQK', width: 80 },
	{ field: 'url', headerName: 'URL', flex: 2, minWidth: 260 },
	{ field: 'topic', headerName: 'Topic', width: 140 },
	{ field: 'priority', headerName: 'Priority', width: 100 },
	{ field: 'titleRu', headerName: 'Title RU', flex: 2, minWidth: 220 },
	{ field: 'summary', headerName: 'Summary', flex: 3, minWidth: 320 },
	{ field: 'titleEn', headerName: 'Title EN', flex: 2, minWidth: 220 },
	{ field: 'source', headerName: 'Source', width: 140 },
	{ field: 'verifyStatus', headerName: 'Verify', width: 110 },
	{ field: 'contentMethod', headerName: 'Method', width: 110 },
	{ field: 'metaDate', headerName: 'Date', width: 160 },
	{ field: 'metaAuthor', headerName: 'Author', width: 140 },
	{ field: 'metaSiteName', headerName: 'Site', width: 140 },
	{ field: 'metaLang', headerName: 'Lang', width: 80 },
	{
		field: 'error',
		headerName: 'Error / Log',
		flex: 2,
		minWidth: 220,
		renderCell: params => (params.value ? <span style={{ color: '#c62828' }}>{params.value}</span> : null),
	},
	{ field: 'status', headerName: 'Status', width: 120 },
	{ field: 'result', headerName: 'Result', flex: 2, minWidth: 200 },
	{ field: 'processed_at', headerName: 'Processed At', width: 160 },
]

// Fields to skip in the auto-generated columns (internal or already handled)
const SKIP_FIELDS = new Set(['__rowNumber', 'null'])

export default function NewsTable({ rows, onSelectRemove, density = 'standard' }) {
	// Build columns dynamically from actual data fields
	const columns = useMemo(() => {
		if (!rows || rows.length === 0) return PRIORITY_COLUMNS.slice(0, 10)

		// Collect all fields that actually have data
		const fieldsWithData = new Set()
		for (const row of rows) {
			for (const [key, val] of Object.entries(row || {})) {
				if (val !== null && val !== undefined && val !== '' && !SKIP_FIELDS.has(key)) {
					fieldsWithData.add(key)
				}
			}
		}

		// Use priority columns that have data, in order
		const result = []
		const usedFields = new Set()
		for (const col of PRIORITY_COLUMNS) {
			if (fieldsWithData.has(col.field)) {
				result.push(col)
				usedFields.add(col.field)
			}
		}

		// Add any remaining fields not in priority list
		for (const field of fieldsWithData) {
			if (!usedFields.has(field)) {
				result.push({ field, headerName: field, minWidth: 120, flex: 1 })
			}
		}

		return result
	}, [rows])

	// Ensure every row has a unique `id` for DataGrid
	const gridRows = useMemo(() => {
		return (rows || []).map((row, index) => ({
			...row,
			id: row.id ?? row.sqk ?? index + 1,
		}))
	}, [rows])

	return (
		<div style={{ height: 520 }}>
			<DataGrid
				rows={gridRows}
				columns={columns}
				checkboxSelection
				density={density}
				getRowClassName={params => {
					const status = String(params.row.status || params.row.verifyStatus || '').toLowerCase()
					if (status === 'error') return 'row-error'
					if (status === 'pending') return 'row-pending'
					return ''
				}}
				onRowSelectionModelChange={ids => onSelectRemove(ids)}
			/>
		</div>
	)
}
