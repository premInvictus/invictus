import { Component, OnInit, ViewChild, OnChanges,Input } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';

// import { ChildDetailsEmployeeComponent } from '../child-details-theme-two/child-details-theme-two.component';
// import { ParentDetailsEmployeeComponent } from '../parent-details-theme-two/parent-details-theme-two.component';
// import { MedicalInformationEmployeeComponent } from '../medical-information-theme-two/medical-information-theme-two.component';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-employee-tab-six-container',
	templateUrl: './employee-tab-six-container.component.html',
	styleUrls: ['./employee-tab-six-container.component.scss']
})
export class EmployeeTabSixContainerComponent implements OnInit, OnChanges { 
	@Input() employeedetails;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	panelOpenState = true;
	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	editRequestFlag = false;
	taboneform: any = {};
	login_id = '';
	studentdetails: any = {};
	parentDetails2: any = {};
	addressDetails: any[] = [];
	parentJson: any[] = [];
	reqParamArray = [];
	finalSibReqArray = [];
	finalSibReqArray2 = [];
	checkChangedFieldsArray: any = [];
	finalArray: any = [];
	settingsArray: any[] = [];
	finalDocumentArray: any[] = [];
	verifyArray: any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	currentImage: any;
	currentUser: any;
	documentArray: any[] = [];
	imageArray: any[] = [];
	documentFormData: any[] = [];
	finalJSon: any[] = [];
	documentsArray: any[] = [
		{ docreq_id: "1", docreq_name: "Id & Address Proof", docreq_alias: "Id", docreq_is_required: "1", docreq_status: "1" },
		{ docreq_id: "2", docreq_name: "Education", docreq_alias: "Education", docreq_is_required: "1", docreq_status: "1" },
		{ docreq_id: "3", docreq_name: "Experience", docreq_alias: "Experience", docreq_is_required: "1", docreq_status: "1" },
		{ docreq_id: "4", docreq_name: "Others", docreq_alias: "Others", docreq_is_required: "1", docreq_status: "1" }
	];
	parentId;
	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService,
		private sisService: SisService) {

	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.viewOnly = false;
		}
		if (data.editMode) {
			this.editOnly = true;
			this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.saveFlag = false;
			this.editRequestFlag = false;

			if (this.addOnly) {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						//this.commonAPIService.studentData.next(result.data[0]);
						this.addOnly = false;
					}
				});
			} else {
				//this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			}
		}
	}

	ngOnInit() {

	}
	ngOnChanges() {
	}

	saveForm() {
	}
	updateForm(isview) {

	}

	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT);
		// }
	}
	editConfirm() { }
	getDocuments() {
		this.documentArray = [];
		this.verifyArray = [];
		this.finalDocumentArray = [];
		this.imageArray = [];
		this.documentArray = this.documentFormData;		
		for (const item of this.finalDocumentArray) {
			this.imageArray.push({
				ed_docreq_id: item.ed_docreq_id,
				imgName: item.ed_link
			});
		}
		const tempArray: any[] = [];
		for (const item of this.documentArray) {
			const findex = tempArray.indexOf(item.ed_docreq_id);
			if (findex === -1) {
				tempArray.push(item.ed_docreq_id);
			}
		}
		this.verifyArray = tempArray;
	}
	fileChangeEvent(fileInput, doc_req_id) {
		this.multipleFileArray = [];
		this.counter = 0;
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i], doc_req_id);
		}
	}

	IterateFileLoop(files, doc_req_id) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage,
				module: 'attachment'
			};
			this.multipleFileArray.push(fileJson);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						for (const item of result.data) {
							const findex = this.finalDocumentArray.findIndex(f =>
								f.ed_login_id === item.login_id && f.ed_docreq_id === doc_req_id);
							const findex2 = this.imageArray.findIndex(f =>
								f.imgName === item.file_url && f.ed_docreq_id === doc_req_id);
							if (findex === -1) {
								// this.finalDocumentArray.push({
								// 	ed_docreq_id: doc_req_id,
								// 	ed_name: item.file_name,
								// 	ed_link: item.file_url,
								// });
								this.finalJSon.push({
									document_id: doc_req_id,
									document_name: '',
									document_data: {
										verified_staus: false,
										files_data: [
											{
												file_name: item.file_name,
												file_url: item.file_url
											}
										]
									}
								});
							} else {
								this.finalDocumentArray.splice(findex, 1);
							}
							if (findex2 === -1) {
								this.imageArray.push({
									ed_docreq_id: doc_req_id,
									imgName: item.file_url
								});
							} else {
								this.imageArray.splice(findex2, 1);
							}

						}
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
	checkVerifiedStatus(value) {
		const index = this.verifyArray.indexOf(value);
		if (index !== -1) {
			return true;
		} else {
			return false;
		}
	}
	checkThumbnail(url: any) {
		if (url.match(/jpg/) || url.match(/png/) || url.match(/bmp/) ||
			url.match(/gif/) || url.match(/jpeg/) ||
			url.match(/JPG/) || url.match(/PNG/) || url.match(/BMP/) ||
			url.match(/GIF/) || url.match(/JPEG/)) {
			return true;
		} else {
			return false;
		}
	}

	fileUploadedStatus(doc_req_id) {
		for (let i = 0; i < this.finalDocumentArray.length; i++) {
			if (this.finalDocumentArray[i]['ed_docreq_id'] === doc_req_id) {
				return true;
			}
		}
	}
	deleteFile(doc_name, doc_req_id) {
		const findex = this.finalDocumentArray.findIndex(f => f.ed_docreq_id === doc_req_id && f.ed_link === doc_name);
		const findex2 = this.imageArray.findIndex(f => f.ed_docreq_id === doc_req_id && f.imgName === doc_name);
		if (findex !== -1) {
			this.finalDocumentArray.splice(findex, 1);
		}
		if (findex2 !== -1) {
			this.imageArray.splice(findex2, 1);
		}
	}
}
