import { Box, Button, Stack, Step, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ConfigForm from "./components/ConfigForm";
import InformationForm from "./components/InformationForm";

export interface ICreateTournamentProps {}

const steps = ["Thêm thông tin cơ bản", "Đặt quy định giải đấu", "Kiểm tra và Xác nhận"];

function CreateTournament(props: ICreateTournamentProps) {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState({
		info: {
			name: "",
			sponsorName: "",
			image: null,
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

	const handleNextStep = (data: any) => {
		if (activeStep === 0) {
			setFormData({ ...formData, info: data });
		}
		if (activeStep === 1) {
			setFormData({ ...formData, config: data });
		}
		if (activeStep === 2) {
			// setFormData({ ...formData, info: data });
			// submit
			return;
		}
		setActiveStep(activeStep + 1);
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
								variant="outlined"
								onClick={() => setActiveStep(activeStep - 1)}
							>
								Quay lại
							</Button>
							<Button variant="contained">Xác nhận</Button>
						</Stack>
					</>
				)}
			</Box>
		</>
	);
}

export default CreateTournament;
