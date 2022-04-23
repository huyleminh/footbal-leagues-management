import * as xlsx from "xlsx";
import {
	IPlayerExcelModel,
	IPlayerExcelResult,
	IStaffExcelModel,
	IStaffExcelResult,
} from "../@types/models/ExcelModels";

const regex = {
	name: `^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ]+(([',. -][a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ ])?[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ]*)*$`,
};

export function readPlayersTemplateUploadAsync(inputFile: File): Promise<IPlayerExcelResult> {
	return new Promise(async function (resolve, reject) {
		try {
			const buffers = await inputFile.arrayBuffer();
			const workbook = xlsx.read(buffers, {});
			const workSheet = workbook.Sheets["Sheet2"];
			if (workSheet === undefined) {
				throw new Error("wrong_format");
			}

			const playerListJson: Array<any> = xlsx.utils.sheet_to_json(workSheet);
			const importResult: IPlayerExcelResult = {
				data: [],
				totalError: 0,
				totalImported: playerListJson.length,
			};
			const playerList: Array<IPlayerExcelModel> = [];

			for (let playerRow of playerListJson) {
				if (playerRow["Name"] === undefined || !playerRow["Name"].match(regex.name)) {
					importResult.totalError++;
					continue;
				}
				if (playerRow["IdNumber"] === undefined || playerRow["IdNumber"].length < 9) {
					importResult.totalError++;
					continue;
				}
				if (
					playerRow["Nationality"] === undefined ||
					!playerRow["Nationality"].match(regex.name)
				) {
					importResult.totalError++;
					continue;
				}
				if (playerRow["StripNumber"] === undefined) {
					importResult.totalError++;
					continue;
				}
				if (
					playerRow["Position"] === undefined ||
					!playerRow["Position"].match(regex.name)
				) {
					importResult.totalError++;
					continue;
				}
				if (playerRow["Type"] === undefined) {
					importResult.totalError++;
					continue;
				}

				const player: IPlayerExcelModel = {
					playerName: playerRow["Name"],
					idNumber: `${playerRow["IdNumber"]}`,
					country: playerRow["Nationality"],
					stripNumber: playerRow["StripNumber"],
					position: playerRow["Position"],
					type: playerRow["Type"],
				};
				playerList.push(player);
			}
			importResult.data = importResult.data.concat(playerList);
			resolve(importResult);
		} catch (error) {
			console.log("Import Excel Error: " + error);
			reject(error);
		}
	});
}

export function readStaffsTemplateUploadAsync(inputFile: File): Promise<IStaffExcelResult> {
	return new Promise(async function (resolve, reject) {
		try {
			const buffers = await inputFile.arrayBuffer();
			const workbook = xlsx.read(buffers, {});
			const workSheet = workbook.Sheets["Sheet2"];
			if (workSheet === undefined) {
				throw new Error("wrong_format");
			}

			const staffListJson: Array<any> = xlsx.utils.sheet_to_json(workSheet);
			const importResult: IStaffExcelResult = {
				data: [],
				totalError: 0,
				totalImported: staffListJson.length,
			};
			const staffList: Array<IStaffExcelModel> = [];

			for (let staffRow of staffListJson) {
				if (staffRow["Name"] === undefined || !staffRow["Name"].match(regex.name)) {
					console.log(1);
					importResult.totalError++;
					continue;
				}
				if (
					staffRow["Role"] === undefined ||
					staffRow["Role"] < 0 ||
					staffRow["Role"] > 2
				) {
					console.log(2);
					importResult.totalError++;
					continue;
				}
				if (
					staffRow["Nationality"] === undefined ||
					!staffRow["Nationality"].match(regex.name)
				) {
					console.log(3);
					importResult.totalError++;
					continue;
				}

				const staff: IStaffExcelModel = {
					fullname: staffRow["Name"],
					country: staffRow["Nationality"],
					role: staffRow["Role"],
				};
				staffList.push(staff);
			}
			importResult.data = importResult.data.concat(staffList);
			resolve(importResult);
		} catch (error) {
			console.log("Import Excel Error: " + error);
			reject(error);
		}
	});
}
