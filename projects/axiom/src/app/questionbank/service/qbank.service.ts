import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { LoaderService, NotificationService } from '../../_services/index';
@Injectable()
export class QbankService {
	constructor(private _http: HttpClient,
		private loaderService: LoaderService
	) { }

	public insertQuestion(value: any) {
		return this._http.post('/question/addQuestion', value);
	}
	public updateQuestion(value: any) {
		return this._http.put(`/question/updateQuestion/${value.qus_id}`, value);
	}

	public uploadExcelFile(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
				const file: File = fileList[0];
				const formData: FormData = new FormData();
				formData.append('uploadFile', file, file.name);
				return this._http.post('/question/uploadExcelFile', formData)
	;
		}

	}

	public insertInstruction(value: any) {
		this.loaderService.startLoading();
		return this._http.post('/questiontemplate/templateInstruction', value);
	}
	public getInstruction() {
		this.loaderService.startLoading();
		return this._http.get('/questiontemplate/templateInstruction');
	}
	public deleteInstruction(ti_id) {
		this.loaderService.startLoading();
		return this._http.delete(`/questiontemplate/templateInstruction/${ti_id}`);
	}
	public updateInstruction(value: any) {
		this.loaderService.startLoading();
		return this._http.put('/questiontemplate/templateInstruction', value);
	}

}
