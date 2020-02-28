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
	@Input() employeeCommonDetails;
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
	honrificArr = [
		{ hon_id: "1", hon_name: 'Mr.' },
		{ hon_id: "2", hon_name: 'Mrs.' },
		{ hon_id: "3", hon_name: 'Miss.' },
		{ hon_id: "4", hon_name: 'Ms.' },
		{ hon_id: "5", hon_name: 'Mx.' },
		{ hon_id: "6", hon_name: 'Sir.' },
		{ hon_id: "7", hon_name: 'Dr.' },
		{ hon_id: "8", hon_name: 'Lady.' }

	];
	departmentArray;
	designationArray;
	wingArray;
	categoryOneArray: any[] = [];
	disabledApiButton = false;
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
			this.addOnly = false;
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
		this.getCategoryOne();
		this.getDepartment();
		this.getDesignation();
		this.getWing();
		this.documentsArray = [
			{ docreq_id: 1, docreq_name: "Id & Address Proof", docreq_alias: "Id", docreq_is_required: "1", docreq_status: "1", verified_status: false },
			{ docreq_id: 2, docreq_name: "Education", docreq_alias: "Education", docreq_is_required: "1", docreq_status: "1", verified_status: false },
			{ docreq_id: 3, docreq_name: "Experience", docreq_alias: "Experience", docreq_is_required: "1", docreq_status: "1", verified_status: false },
			{ docreq_id: 4, docreq_name: "Others", docreq_alias: "Others", docreq_is_required: "1", docreq_status: "1", verified_status: false }
		];
		this.getDocuments();
	}

	getDepartment() {
		this.sisService.getDepartment({}).subscribe((result: any) => {
			if (result && result.status == 'ok') {
				this.departmentArray = result.data;
			} else {
				this.departmentArray = [];
			}

		});
	}
	getDesignation() {
		this.commonAPIService.getMaster({ type_id: '2' }).subscribe((result: any) => {
			if (result) {
				this.designationArray = result;
			} else {
				this.designationArray = [];
			}

		});
	}
	getWing() {
		this.commonAPIService.getMaster({ type_id: '1' }).subscribe((result: any) => {
			if (result) {
				this.wingArray = result;
			} else {
				this.wingArray = [];
			}

		});
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

			// if (this.counter === this.currentFileChangeEvent.target.files.length) {
			// 	this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
			// 		if (result) {
			// 			for (const item of result.data) {
			// 				const findex = this.finalDocumentArray.findIndex(f =>
			// 					f.ed_login_id === item.login_id && f.ed_docreq_id === doc_req_id);
			// 				const findex2 = this.imageArray.findIndex(f =>
			// 					f.imgName === item.file_url && f.ed_docreq_id === doc_req_id);
			// 				if (findex === -1) {
			// 					this.finalDocumentArray.push({
			// 						ed_login_id: this.docContext,
			// 						ed_docreq_id: doc_req_id,
			// 						ed_name: item.file_name,
			// 						ed_link: item.file_url,
			// 						ed_is_verify: 'N'
			// 					});
			// 				} else {
			// 					this.finalDocumentArray.splice(findex, 1);
			// 				}
			// 				if (findex2 === -1) {
			// 					this.imageArray.push({
			// 						ed_docreq_id: doc_req_id,
			// 						imgName: item.file_url
			// 					});
			// 				} else {
			// 					this.imageArray.splice(findex2, 1);
			// 				}
			// 			}
			// 		}
			// 	});
			// }

			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						for (const item of result.data) {
							const findex = this.finalJSon.findIndex(f => f.document_id === doc_req_id);
							const findex2 = this.imageArray.findIndex(f => f.imgName === item.file_url && f.docreq_id === doc_req_id);
							if (findex === -1) {
								this.finalJSon.push({
									document_id: doc_req_id,
									document_name: this.getFileName(doc_req_id),
									verified_staus: false,
									files_data: [item]
								});
							}
							else {
								this.finalJSon[findex].files_data.push(item);
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
		for (let i = 0; i < this.finalJSon.length; i++) {
			if (this.finalJSon[i]['document_id'] === doc_req_id) {
				return true;
			}
		}
	}
	deleteFile(doc_name, doc_req_id) {
		console.log(this.finalJSon , 'before');
		const findex = this.finalJSon.findIndex(f => f.document_id === doc_req_id);
		if (findex !== -1) {
			const findex_1 = this.finalJSon[findex].files_data.findIndex(e => e.file_url === doc_name);
			this.finalJSon[findex].files_data.splice(findex_1, 1);
		}
		const findex2 = this.imageArray.findIndex(f => f.docreq_id === doc_req_id && f.imgName === doc_name);
		if (findex2 !== -1) {
			this.imageArray.splice(findex2, 1);
		}
		console.log(this.finalJSon , 'delete');
	}
	saveForm() {
		this.disabledApiButton = true;
		if (this.employeedetails) {
			this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
			this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
			this.employeedetails.emp_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.emp_profile_pic;
			this.employeedetails.emp_department_detail = {
				dpt_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id,
				dpt_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id)
			};
			this.employeedetails.emp_designation_detail = {
				des_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id,
				des_name: this.getDesignationName(this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id)
			};
			this.employeedetails.emp_honorific_detail = {
				hon_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id,
				hon_name: this.getHonorificName(this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id)
			};
			this.employeedetails.emp_wing_detail = {
				wing_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id,
				wing_name: this.getWingName(this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id)
			};
			this.employeedetails.emp_category_detail = {
				cat_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id,
				cat_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id)
			};
		}
		this.employeedetails['emp_document_detail'] = {
			document_data: this.finalJSon
		};
		this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
			if (result) {
				this.disabledApiButton = false;
				this.commonAPIService.showSuccessErrorMessage('Employee Documents Submitted Successfully', 'success');
				//this.commonAPIService.renderTab.next({ tabMove: true, renderForLast : true });				
				this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false, reRenderForm: true });
			} else {
				this.disabledApiButton = false;
				this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Documents', 'error');
			}
		});

	}

	updateForm() {
		this.disabledApiButton = true;
		if (this.employeedetails) {
			this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
			this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
			this.employeedetails.emp_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.emp_profile_pic;
			this.employeedetails.emp_department_detail = {
				dpt_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id,
				dpt_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id)
			};
			this.employeedetails.emp_designation_detail = {
				des_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id,
				des_name: this.getDesignationName(this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id)
			};
			this.employeedetails.emp_honorific_detail = {
				hon_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id,
				hon_name: this.getHonorificName(this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id)
			};
			this.employeedetails.emp_wing_detail = {
				wing_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id,
				wing_name: this.getWingName(this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id)
			};
			this.employeedetails.emp_category_detail = {
				cat_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id,
				cat_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id)
			};
		}
		this.employeedetails['emp_document_detail'] = {
			document_data: this.finalJSon
		};
		this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
			if (result) {
				this.disabledApiButton = false;
				//this.commonAPIService.renderTab.next({ tabMove: true, renderForLast : true });
				this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false, reRenderForm: true });

				this.commonAPIService.showSuccessErrorMessage('Employee Documents Updated Successfully', 'success');
			} else {
				this.disabledApiButton = false;
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
			for (var i = 0; i < this.documentArray.length; i++) {
				if (Number(this.documentArray[i].document_id) === ($event.source.value)) {
					this.documentArray[i].verified_staus = true;
				}
			}
		} else {
			for (var i = 0; i < this.documentArray.length; i++) {
				if (Number(this.documentArray[i].document_id) === ($event.source.value)) {
					this.documentArray[i].verified_staus = false;
				}
			}
		}


	}

	getDepartmentName(dpt_id) {
		const findIndex = this.departmentArray.findIndex(f => Number(f.dept_id) === Number(dpt_id));
		if (findIndex !== -1) {
			return this.departmentArray[findIndex].dept_name;
		}
	}
	getHonorificName(hon_id) {
		const findIndex = this.honrificArr.findIndex(f => Number(f.hon_id) === Number(hon_id));
		if (findIndex !== -1) {
			return this.honrificArr[findIndex].hon_name;
		}
	}
	getCategoryOne() {
		this.commonAPIService.getCategoryOne({}).subscribe((res: any) => {
			if (res) {
				this.categoryOneArray = [];
				this.categoryOneArray = res;
			}
		});
	}
	getCategoryOneName(cat_id) {
		const findex = this.categoryOneArray.findIndex(e => Number(e.cat_id) === Number(cat_id));
		if (findex !== -1) {
			return this.categoryOneArray[findex].cat_name;
		}
	}

	getWingName(wing_id) {
		const findIndex = this.wingArray.findIndex(f => Number(f.config_id) === Number(wing_id));
		if (findIndex !== -1) {
			return this.wingArray[findIndex].name;
		}
	}
	getDesignationName(des_id) {
		const findIndex = this.designationArray.findIndex(f => Number(f.config_id) === Number(des_id));
		if (findIndex !== -1) {
			return this.designationArray[findIndex].name;
		}
	}

}
