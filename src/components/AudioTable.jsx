import { DataGrid } from '@mui/x-data-grid'

function formatSize(bytes) {
	if (!bytes && bytes !== 0) return ''
	const mb = bytes / (1024 * 1024)
	return `${mb.toFixed(2)} MB`
}

export default function AudioTable({ rows }) {
	const columns = [
		{ field: 'name', headerName: 'File', flex: 2, minWidth: 200 },
		{ field: 'size', headerName: 'Size', width: 120, valueGetter: (value, row) => formatSize(row.size) },
		{ field: 'path', headerName: 'Path', flex: 3, minWidth: 260 },
		{
			field: 'player',
			headerName: 'Play',
			width: 220,
			sortable: false,
			filterable: false,
			renderCell: params => (
				<audio controls src={`/audio/${params.row.name}`} style={{ width: 200 }} />
			),
		},
	]

	return (
		<div style={{ height: 420 }}>
			<DataGrid
				rows={(rows || []).map((r, idx) => ({ id: idx + 1, ...r }))}
				columns={columns}
				density="compact"
				disableRowSelectionOnClick
				rowHeight={60}
			/>
		</div>
	)
}
