import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { LoaderService, NotificationService } from 'projects/axiom/src/app/_services/index';
import { environment } from 'src/environments/environment';
@Injectable()
export class QbankService {
	constructor(private _http: HttpClient,
		private loaderService: LoaderService
	) { }

	public insertQuestion(value: any) {
		return this._http.post(environment.apiAxiomUrl + '/question/addQuestion', value);
	}
	public updateQuestion(value: any) {
		return this._http.put(environment.apiAxiomUrl + `/question/updateQuestion/${value.qus_id}`, value);
	}

	public uploadExcelFile(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
				const file: File = fileList[0];
				const formData: FormData = new FormData();
				formData.append('uploadFile', file, file.name);
				return this._http.post(environment.apiAxiomUrl + '/question/uploadExcelFile', formData)
	;
		}

	}

	public insertInstruction(value: any) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/templateInstruction', value);
	}
	public getInstruction() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + '/questiontemplate/templateInstruction');
	}
	public deleteInstruction(ti_id) {
		this.loaderService.startLoading();
		return this._http.delete(`/questiontemplate/templateInstruction/${ti_id}`);
	}
	public updateInstruction(value: any) {
		this.loaderService.startLoading();
		return this._http.put(environment.apiAxiomUrl + '/questiontemplate/templateInstruction', value);
	}

}
