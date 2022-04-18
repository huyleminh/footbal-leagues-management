import {
	FormControl,
	MenuItem,
	Pagination,
	Select,
	SelectChangeEvent,
	Stack,
	SxProps,
	Theme,
	Typography,
} from "@mui/material";
import React from "react";

export interface ICustomPaginationProps {
	page: number;
	totalPage: number;
	onChange: (value: number) => void | undefined;

	allowChangeMax: boolean;
	maxItem?: number;
	maxItemList?: number[];
	onChangeMaxItem?: (value: number) => void | undefined;

	sx?: SxProps<Theme> | undefined;
}

function CustomPagination(props: ICustomPaginationProps) {
	const { totalPage, page, onChange, maxItem, maxItemList, onChangeMaxItem, sx } = props;

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		if (!onChange) return;
		onChange(value);
	};

	const handleChangeMaxItem = (event: SelectChangeEvent<number>) => {
		const target = event.target;
		if (!onChangeMaxItem) return;
		onChangeMaxItem(+target.value);
	};

	return (
		<Stack direction="row" spacing={2} sx={{ ...sx, display: "flex", alignItems: "center" }}>
			{props.allowChangeMax && (
				<>
					<Typography sx={{ fontSize: "15px" }}>Số lượng</Typography>
					<FormControl size="small">
						<Select
							value={maxItem}
							onChange={handleChangeMaxItem}
							sx={{ minWidth: 100 }}
							defaultValue={maxItem}
						>
							{maxItemList
								? maxItemList.map((item, index) => (
										<MenuItem value={item} key={index}>{item}</MenuItem>
								  ))
								: null}
						</Select>
					</FormControl>
				</>
			)}

			<Pagination
				size="large"
				count={totalPage}
				page={page}
				onChange={handlePageChange}
				variant="outlined"
				shape="rounded"
			/>
		</Stack>
	);
}

export default CustomPagination;
