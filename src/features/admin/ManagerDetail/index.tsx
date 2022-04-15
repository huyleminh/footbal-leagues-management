import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import { Box, Button, DialogActions, DialogContent, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface ManagerDetailProps extends IBaseComponentProps {
	open: boolean;
	managerId?: string;
	onClose: (value: boolean) => void;
}

interface ManagerDetail {
    name?: string;
    username?: string;
    email?: string;
    lastLockedDate?: string;
    address?: string;
    status?: number;
}

function ManagerDetail(props: ManagerDetailProps) {
	const { open, onClose, managerId } = props;
    const navigate = useNavigate()
    const [data, setData] = useState<ManagerDetail>({
        name: "Huy Le",
        username: "testuser",
        email: "huyle@gmail.com",
        status: 0,
        lastLockedDate: "15/04/2022"
    })

	const handleOnClose = () => {
		onClose(false);
	};

    const toTournamentList = () => {
        navigate("/tournaments") // change to query string when integrating API
    }

	return (
		<Dialog onClose={handleOnClose} open={open}>
			<DialogTitle>Thông tin quản lý</DialogTitle>
			<DialogContent>
                <Box sx={{
                    paddingTop: "10px",
                    minWidth: "450px"
                }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Tên"
                            variant="outlined"
                            defaultValue={data.name}
                            disabled
                        />
                        <TextField
                            label="Tên tài khoản"
                            variant="outlined"
                            defaultValue={data.username}
                            disabled
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            defaultValue={data.email}
                            disabled
                        />
                        <TextField
                            label="Ngày khóa gần nhất"
                            variant="outlined"
                            defaultValue={data.lastLockedDate}
                            disabled
                        />
                        <TextField
                            label="Địa chỉ"
                            variant="outlined"
                            defaultValue={data.address}
                            disabled
                        />
                        <FormControl>
                            <FormLabel id="status-radio-button">Trạng thái</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="status-radio-button"
                                name="row-radio-buttons-group"
                                value={data.status}
                            >
                                <FormControlLabel value={0} control={<Radio />} label="Hoạt động" disabled/>
                                <FormControlLabel value={1} control={<Radio />} label="Khóa" disabled/>
                            </RadioGroup>
                        </FormControl>
                        <Divider></Divider>
                        <Stack direction="row" spacing={3}>
                            <Typography variant="subtitle1" color="black">Danh sách giải đấu đang quản lý: </Typography>
                            <Tooltip title="Đến trang danh sách" placement="top">
                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                    onClick={toTournamentList}
                                >
                                    <OpenInNewRoundedIcon fontSize="small" />
                                </Button>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Box>
            </DialogContent>
			<DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleOnClose}
                >
                    Đóng
                </Button>
            </DialogActions>
		</Dialog>
	);
}

export default ManagerDetail;
