import { Box, Button, CircularProgress, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { toast } from "material-react-toastify";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IAPIResponse } from "../../../@types/AppInterfaces";
import ToastMsg from "../../../components/toast/ToastMsg";
import HttpService from "../../../services/HttpService";
import ConfigForm, { ITournamentConfigForm } from "./components/ConfigForm";
import InformationForm, { ITournamentInfoForm } from "./components/InformationForm";

export interface ICreateTournamentProps {}

const steps = ["Thêm thông tin cơ bản", "Đặt quy định giải đấu", "Kiểm tra và Xác nhận"];

interface IFormData {
	info: ITournamentInfoForm;
	config: ITournamentConfigForm;
}

function CreateTournament(props: ICreateTournamentProps) {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState<IFormData>({
		info: {
			name: "",
			sponsorName: "",
			image: null,
			scheduledDate: null,
		},
		config: {
			maxAdditionalPlayer: 0,
			maxChangingPlayer: 0,
			maxPlayerAge: 0,
			maxAbroardPlayer: 0,
			maxTeam: 0,
			maxPlayerPerMatch: 0,
		},
	});

	const [isLoading, setIsLoading] = useState(false);

	const handleNextStep = (data: any) => {
		if (activeStep === 0) {
			setFormData({ ...formData, info: data });
		}
		if (activeStep === 1) {
			setFormData({ ...formData, config: data });
		}
		if (activeStep === 2) {
			return;
		}
		setActiveStep(activeStep + 1);
	};

	const handleSubmit = async () => {
		if (!formData.info.image) {
			return;
		}
		const data = new FormData();
		data.append("name", formData.info.name);
		data.append("sponsorName", formData.info.sponsorName);
		data.append("config", JSON.stringify(formData.config));
		data.append("scheduledDate", formData.info.scheduledDate!.toISOString());
		data.append("logo", formData.info.image);

		setIsLoading(true);
		try {
			const res = await HttpService.post<IAPIResponse<any | string>>("/tournaments", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (res.code === 201) {
				toast(<ToastMsg title="Tạo mới thành công" type="success" />, {
					type: toast.TYPE.SUCCESS,
				});
				setTimeout(() => {
					navigate("/tournaments");
				}, 1500);
			} else if (res.code === 400) {
				toast(<ToastMsg title={res.data as string} type="error" />, {
					type: toast.TYPE.ERROR,
				});
			} else throw new Error("unexpected_code");
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
				type: toast.TYPE.ERROR,
			});
		}
	};

	const handlePrevStep = () => {
		if (activeStep === 0) {
			Swal.fire({
				title: "Hủy thao tác tạo giải đấu",
				text: "Mọi thay đổi sẽ không được lưu lại, bạn sẽ quay lại trang danh sách giải đấu",
				icon: "warning",
				confirmButtonText: "Đồng ý",
				cancelButtonText: "Hủy",
				showCancelButton: true,
			}).then((result) => {
				if (result.isConfirmed) {
					navigate("../");
				}
			});
			return;
		}
		setActiveStep(activeStep - 1);
	};

	return (
		<>
			<Stepper activeStep={activeStep} sx={{ mb: 1, px: 1, py: 2 }}>
				{steps.map((step, index) => {
					return (
						<Step key={index}>
							<StepLabel>{step}</StepLabel>
						</Step>
					);
				})}
			</Stepper>

			<Box sx={{ p: 2 }}>
				{activeStep === 0 && (
					<InformationForm
						onNext={handleNextStep}
						onPrevious={handlePrevStep}
						data={formData.info}
					/>
				)}
				{activeStep === 1 && (
					<ConfigForm
						onNext={handleNextStep}
						onPrevious={handlePrevStep}
						data={formData.config}
					/>
				)}
				{activeStep === 2 && (
					<>
						<InformationForm disabled data={formData.info} />
						<ConfigForm disabled data={formData.config} />
						<Stack
							direction="row"
							sx={{ display: "flex", justifyContent: "center" }}
							spacing={2}
						>
							<Button
								variant="text"
								onClick={() => setActiveStep(activeStep - 1)}
							>
								Quay lại
							</Button>
							<Button
								variant="contained"
								onClick={handleSubmit}
								startIcon={
									isLoading ? (
										<CircularProgress color="inherit" size={15} />
									) : (
										<></>
									)
								}
							>
								Xác nhận
							</Button>
						</Stack>
					</>
				)}
			</Box>
		</>
	);
}

export default CreateTournament;
