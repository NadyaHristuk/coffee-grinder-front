import { DataGrid } from '@mui/x-data-grid'

export default function SheetTable({ headers, rows }) {
	const columns = (headers || []).filter(Boolean).map((header, idx) => ({
		field: header,
		headerName: header,
		minWidth: 140,
		flex: 1,
	}))

	const gridRows = (rows || []).map((row, index) => ({
		id: row.id || row.sqk || index + 1,
		...row,
	}))

	return (
		<div style={{ height: 520 }}>
			<DataGrid
				rows={gridRows}
				columns={columns}
				density="compact"
				disableRowSelectionOnClick
			/>
		</div>
	)
}
