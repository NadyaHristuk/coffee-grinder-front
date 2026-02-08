import { DataGrid } from '@mui/x-data-grid'

export default function SlidesTable({ rows }) {
	const columns = [
		{ field: 'slide', headerName: 'Slide', width: 90 },
		{ field: 'type', headerName: 'Type', width: 140 },
		{ field: 'sqk', headerName: 'SQK', width: 80 },
		{ field: 'topicId', headerName: 'Topic', width: 90 },
		{
			field: 'preview',
			headerName: 'Preview',
			width: 140,
			sortable: false,
			filterable: false,
			renderCell: params => (
				<img
					src={`/slides/${params.row.slide}.png`}
					alt={params.row.slide}
					style={{ width: 120, height: 68, objectFit: 'cover' }}
					onError={e => {
						e.currentTarget.style.display = 'none'
					}}
				/>
			),
		},
		{
			field: 'urls',
			headerName: 'URLs',
			flex: 2,
			minWidth: 240,
			valueGetter: (value, row) => (row.urls || []).join(' '),
		},
		{
			field: 'texts',
			headerName: 'Text Preview',
			flex: 3,
			minWidth: 360,
			valueGetter: (value, row) => (row.texts || []).slice(0, 3).join(' | '),
		},
	]

	return (
		<div style={{ height: 520 }}>
			<DataGrid
				rows={rows || []}
				columns={columns}
				density="compact"
				disableRowSelectionOnClick
				rowHeight={80}
			/>
		</div>
	)
}
