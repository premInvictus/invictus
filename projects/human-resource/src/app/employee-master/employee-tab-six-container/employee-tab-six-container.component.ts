import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { PreviewDocumentComponent } from './preview-document/preview-document.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
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
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
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
		{ docreq_id: 1, docreq_name: "Id & Address Proof", docreq_alias: "Id", docreq_is_required: "1", docreq_status: "1", verified_status: false },
		{ docreq_id: 2, docreq_name: "Education", docreq_alias: "Education", docreq_is_required: "1", docreq_status: "1", verified_status: false },
		{ docreq_id: 3, docreq_name: "Experience", docreq_alias: "Experience", docreq_is_required: "1", docreq_status: "1", verified_status: false },
		{ docreq_id: 4, docreq_name: "Others", docreq_alias: "Others", docreq_is_required: "1", docreq_status: "1", verified_status: false }
	];
	parentId;
	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService, private dialog: MatDialog,
		private sisService: SisService) {

	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.editOnly = false;
			this.viewOnly = false;
		}
		if (data.editMode) {
			this.editOnly = true;
			this.viewOnly = false;
			this.saveFlag = true;
			this.addOnly = false;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.editOnly = false;
			this.saveFlag = false;
		}
	}

	ngOnInit() {
		// this.getDocuments();
		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data) {
				if (data.addMode) {
					this.setActionControls({ addMode: true });
				}
				if (data.editMode) {
					this.setActionControls({ editMode: true });
				}
				if (data.viewMode) {
					this.setActionControls({ viewMode: true });
				}

			}
		});
	}
	ngOnChanges() {
		this.getDocuments();
	}


	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT);
		// }
	}
	editConfirm() { }
	previewImage(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imgArray,
				index: index
			},
			height: '100vh',
			width: '100vh'
		});
	}
	getDocuments() {
		this.documentArray = [];
		this.verifyArray = [];
		this.finalDocumentArray = [];
		this.imageArray = [];
		this.documentArray = this.employeedetails.emp_document_detail && this.employeedetails.emp_document_detail.document_data ? this.employeedetails.emp_document_detail.document_data : [];
		console.log('this.documentArray', this.documentArray);
		this.finalJSon = this.documentArray;
		for (const item of this.documentArray) {
			if (item && item.files_data) {
				for (const iitem of item.files_data) {
					this.imageArray.push({
						docreq_id: item.document_id,
						imgName: iitem.file_url
					});
				}

			}
			console.log('item',item);
			if (item.verified_staus) {
				if (item.document_id === 1) {
					this.documentsArray[0]['verified_status'] = true;
				}
				if (item.document_id === 2) {
					this.documentsArray[1]['verified_status'] = true;
				}
				if (item.document_id === 3) {
					this.documentsArray[2]['verified_status'] = true;
				}
				if (item.document_id === 4) {
					this.documentsArray[3]['verified_status'] = true;
				}
				
			}

		}
		console.log('this.finalJSon', this.documentsArray);
		const tempArray: any[] = [];
		for (const item of this.documentArray) {
			const findex = tempArray.indexOf(item.docreq_id);
			if (findex === -1) {
				tempArray.push(item.docreq_id);
			}
		}
		this.verifyArray = tempArray;
	}
	getFileName(doc_req_id) {
		const findIndex = this.documentsArray.findIndex(f => f.docreq_id === doc_req_id);
		if (findIndex !== -1) {
			return this.documentsArray[findIndex].docreq_alias;
		}
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
						console.log('this.finalJSon', this.finalJSon);
						for (const item of result.data) {
							const findex = this.finalDocumentArray.findIndex(f => f.docreq_id === doc_req_id);
							const findex2 = this.imageArray.findIndex(f => f.imgName === item.file_url && f.docreq_id === doc_req_id);
							if (findex === -1) {
								// this.finalDocumentArray.push({
								// 	docreq_id: doc_req_id,
								// 	ed_name: item.file_name,
								// 	ed_link: item.file_url,
								// });
								this.finalJSon.push({
									document_id: doc_req_id,
									document_name: this.getFileName(doc_req_id),
									verified_staus: false,
									files_data: [
										{
											file_name: item.file_name,
											file_url: item.file_url
										}
									]

								});
							} else {
								this.finalDocumentArray.splice(findex, 1);
							}
							if (findex2 === -1) {
								this.imageArray.push({
									docreq_id: doc_req_id,
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
	// checkVerifiedStatus(value) {
	// 	const index = this.verifyArray.indexOf(value);
	// 	if (index !== -1) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }
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
			if (this.finalDocumentArray[i]['docreq_id'] === doc_req_id) {
				return true;
			}
		}
	}
	deleteFile(doc_name, doc_req_id) {
		const findex = this.finalDocumentArray.findIndex(f => f.docreq_id === doc_req_id && f.ed_link === doc_name);
		const findex2 = this.imageArray.findIndex(f => f.docreq_id === doc_req_id && f.imgName === doc_name);
		if (findex !== -1) {
			this.finalDocumentArray.splice(findex, 1);
		}
		if (findex2 !== -1) {
			this.imageArray.splice(findex2, 1);
		}
	}
	saveForm() {
		this.employeedetails['emp_document_detail'] = {
			document_data: this.finalJSon
		};
		this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.showSuccessErrorMessage('Employee Documents Submitted Successfully', 'success');
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Documents', 'error');
			}
		});

	}

	updateForm() {
		this.employeedetails['emp_document_detail'] = {
			document_data: this.finalJSon
		};
		this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.showSuccessErrorMessage('Employee Documents Updated Successfully', 'success');
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Documents', 'error');
			}
		});

	}

	cancelForm() {
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.getDocuments();
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}

	insertVerifyId($event) {
		if ($event.checked) {
			for (var i=0; i < this.documentArray.length; i++) {
				if (Number(this.documentArray[i].document_id) === ($event.source.value)) {
					this.documentArray[i].verified_staus = true;
				}
			}
		} else {
			for (var i=0; i < this.documentArray.length; i++) {
				if (Number(this.documentArray[i].document_id) === ($event.source.value)) {
					this.documentArray[i].verified_staus = false;
				}
			}
		}

		
	}
}
