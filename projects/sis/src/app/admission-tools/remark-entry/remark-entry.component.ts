import { Component, OnInit, AfterContentInit, AfterContentChecked, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService,SmartService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
// documents upload
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ViewDocumentsComponent } from '../../student-master/documents/view-documents/view-documents.component';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';

@Component({
	selector: 'app-remark-entry',
	templateUrl: './remark-entry.component.html',
	styleUrls: ['./remark-entry.component.scss']
})
export class RemarkEntryComponent implements OnInit, AfterContentInit, AfterContentChecked, DoCheck {

	classArray = [];
	studentdetailsform: FormGroup;
	admissionremarkform: FormGroup;
	studentremarkform: FormGroup;
	parentremarkform: FormGroup;
	finalremarksform: FormGroup;
	managementform: any = {};
	studentdetials: any = {};
	pclass = false;
	maxDate = new Date();
	disableApiCall = false;
	// documents upload
	dialogRef: MatDialogRef<ViewDocumentsComponent>;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	Documents_Form: FormGroup;
	currentImage: any;
	documentsArray: any[] = [];
	documentFlag = false;
	finalDocumentArray: any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	viewOnlyRemark = true;
	viewOnly = false;
	editFlag = false;
	login_id: any;
	verifyArray: any[] = [];
	currentUser: any;
	documentArray: any[] = [];
	imageArray: any[] = [];
	dynamicMarksForm: any;
	marksTableJson: any[] = [];
	marksTableJson2: any[] = [];
	marksTableJson3: any[] = [];
	markObjectLength;
	managementRemarkData: any;
	remarkEntryFlag = false;

	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private SmartService: SmartService,
		private commonAPIService: CommonAPIService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

		localStorage.removeItem('remark_entry_status_last_state');
		this.buildForm();
		this.getClass();
	}
	ngAfterContentInit() {
	}
	ngAfterContentChecked() {
	}
	ngDoCheck() {
	}
	buildForm() {
		this.studentdetailsform = this.fbuild.group({
			au_login_id: '',
			au_full_name: '',
			class_id: '',
			father_name: '',
			mother_name: '',
			au_mobile: '',
			upd_dob: '',
			upd_doj: '',
			au_test_date: '',
			au_interview_date: ''
		});
		this.admissionremarkform = this.fbuild.group({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'admission',
			erm_mark_obtained: '',
			erm_remark: ''
		});
		this.studentremarkform = this.fbuild.group({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'student',
			erm_mark_obtained: '',
			erm_remark: ''
		});
		this.parentremarkform = this.fbuild.group({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'parent',
			erm_mark_obtained: '',
			erm_remark: ''
		});
		this.finalremarksform = this.fbuild.group({
			au_is_eligible_adimission: '',
			au_process_class: '',
			au_final_remark: '',
			au_test_date: '',
			au_interview_date: ''
		});

		const enrollment_no = this.route.snapshot.queryParams &&
			this.route.snapshot.queryParams.login_id !== '' ? this.route.snapshot.queryParams.login_id : '';
		if (enrollment_no) {
			// this.suspensionForm.value.susp_login_id = param_login_id;
			this.studentdetailsform.patchValue({
				'au_login_id': enrollment_no
			});
			this.getStudentDetails('', enrollment_no);
		}
	}
	getClass() {
		this.classArray = [];
		this.SmartService.getClassData({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getStudentDetails(event, au_login_id) {
		if (event) {
			event.stopPropagation();
		}
		if (au_login_id) {
			this.sisService.getMasterStudentDetail({ regd_no: au_login_id, enrollment_type: '2' }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.remarkEntryFlag = true;
					this.login_id = result.data[0].au_login_id;
					this.getManagementRemarks(this.login_id);
					this.getDocumentRequired();
					this.studentdetials = result.data[0];
					this.studentdetailsform.patchValue({
						au_full_name: this.studentdetials.au_full_name,
						class_id: this.studentdetials.class_id,
						au_mobile: this.studentdetials.au_mobile,
						upd_dob: this.studentdetials.upd_dob,
						upd_doj: this.studentdetials.upd_doj,
						father_name: this.studentdetials.father_name,
						mother_name: this.studentdetials.mother_name,
					});
				} else {
					this.remarkEntryFlag = false;
					this.resetForm();
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	viewProfile(login_id) {
		if (login_id) {
			const last_state_json = {
				url: JSON.stringify(['../../admissiontool/remark-entry']),
				login_id: this.studentdetailsform.value.au_login_id
			};
			localStorage.setItem('remark_entry_last_state', JSON.stringify(last_state_json));
			this.router.navigate(['../../studentmaster/registration'], { queryParams: { login_id: login_id }, relativeTo: this.route });
		}
	}
	prepareMarkSplitTable(markSplitData) {
		this.marksTableJson = markSplitData;
		this.marksTableJson2 = [];
		this.marksTableJson3 =  [];
		// console.log("i am mark table", this.marksTableJson);
		const fGroupArr = [];
		// let count = 0;
		markSplitData.forEach(element => {
			this.marksTableJson3.push(element.gt_name)
			element.data.forEach(element1 => {
				const inputJson = {};
				this.marksTableJson2.push(element1);
				const key = 'col0';
				inputJson[key] = element1.erms_value;
				fGroupArr.push(this.fbuild.group(inputJson));
			});
		});
		// console.log("i am this.mak", this.marksTableJson2);
		
		
		this.markObjectLength = this.marksTableJson.length;
		this.dynamicMarksForm = fGroupArr;
		console.log("i am dynamic form", this.marksTableJson3);
		
	}
	patchMtRemarks(mtRemark) {
		const managementRemark = mtRemark;
		if (managementRemark && managementRemark['markSplit'] && managementRemark['markSplit'].length > 0) {
			this.prepareMarkSplitTable(managementRemark['markSplit']);
		}
		if (managementRemark && managementRemark['marks'] && managementRemark['marks'].length > 0) {
			managementRemark['marks'].forEach(element => {
				if (element.erm_type === 'admission' && this.admissionremarkform) {
					this.admissionremarkform.setValue({
						erm_id: element.erm_id,
						erm_login_id: element.erm_login_id,
						erm_type: element.erm_type,
						erm_mark_obtained: element.erm_mark_obtained,
						erm_remark: element.erm_remark
					});
				} else if (element.erm_type === 'student' && this.studentremarkform) {
					this.studentremarkform.setValue({
						erm_id: element.erm_id,
						erm_login_id: element.erm_login_id,
						erm_type: element.erm_type,
						erm_mark_obtained: element.erm_mark_obtained,
						erm_remark: element.erm_remark
					});
				} else if (element.erm_type === 'parent' && this.parentremarkform) {
					this.parentremarkform.setValue({
						erm_id: element.erm_id,
						erm_login_id: element.erm_login_id,
						erm_type: element.erm_type,
						erm_mark_obtained: element.erm_mark_obtained,
						erm_remark: element.erm_remark
					});
				}
			});
		} else {
			if (this.admissionremarkform) {
				this.admissionremarkform.setValue({
					erm_id: '',
					erm_login_id: '',
					erm_type: 'admission',
					erm_mark_obtained: '',
					erm_remark: ''
				});
			}
			if (this.studentremarkform) {
				this.studentremarkform.setValue({
					erm_id: '',
					erm_login_id: '',
					erm_type: 'student',
					erm_mark_obtained: '',
					erm_remark: ''
				});
			}
			if (this.parentremarkform) {
				this.parentremarkform.setValue({
					erm_id: '',
					erm_login_id: '',
					erm_type: 'parent',
					erm_mark_obtained: '',
					erm_remark: ''
				});
			}

		}

		if (managementRemark['finalRemark'] && this.finalremarksform) {
			this.finalremarksform.patchValue({
				au_is_eligible_adimission: managementRemark.finalRemark[0].au_is_eligible_adimission === 'Y' ? true : false,
				au_process_class: managementRemark.finalRemark[0].au_process_class,
				au_final_remark: managementRemark.finalRemark[0].au_final_remark
			});
			this.studentdetailsform.patchValue({
				au_test_date: managementRemark.finalRemark[0].au_test_date,
				au_interview_date: managementRemark.finalRemark[0].au_interview_date
			});
		} else {
			if (this.finalremarksform) {
				this.finalremarksform.patchValue({
					au_final_remark: '',
					au_is_eligible_adimission: '',
					au_process_class: ''
				});
			}
		}
	}
	getManagementRemarks(login_id) {
		this.sisService.getManagementRemarks({ login_id: login_id, era_type: 'management', process_type: '2' }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.managementRemarkData = result.data[0];
				this.patchMtRemarks(result.data[0]);
				/* if (managementRemark.marks.length > 0) {
					managementRemark.marks.forEach(element => {
						if (element.erm_type === 'admission') {
							this.admissionremarkform.setValue({
								erm_id: element.erm_id,
								erm_login_id: element.erm_login_id,
								erm_type: element.erm_type,
								erm_mark_obtained: element.erm_mark_obtained,
								erm_remark: element.erm_remark
							});
						} else if (element.erm_type === 'student') {
							this.studentremarkform.setValue({
								erm_id: element.erm_id,
								erm_login_id: element.erm_login_id,
								erm_type: element.erm_type,
								erm_mark_obtained: element.erm_mark_obtained,
								erm_remark: element.erm_remark
							});
						} else if (element.erm_type === 'parent') {
							this.parentremarkform.setValue({
								erm_id: element.erm_id,
								erm_login_id: element.erm_login_id,
								erm_type: element.erm_type,
								erm_mark_obtained: element.erm_mark_obtained,
								erm_remark: element.erm_remark
							});
						}
					});
				} else {
					this.resetManagementForm();
				}
				this.finalremarksform.patchValue({
					au_is_eligible_adimission: managementRemark.finalRemark[0].au_is_eligible_adimission === 'Y' ? true : false,
					au_process_class: managementRemark.finalRemark[0].au_process_class,
					au_final_remark: managementRemark.finalRemark[0].au_final_remark
				});
				this.studentdetailsform.patchValue({
					au_test_date: managementRemark.finalRemark[0].au_test_date,
					au_interview_date: managementRemark.finalRemark[0].au_interview_date
				}); */
			} else if (result.status === 'error') {
				this.resetManagementForm();
			}
		});
	}
	prepareMarkSplitData() {
		const markSplitData = this.managementRemarkData['markSplit'];
		const dynamicRemarkForm = this.dynamicMarksForm;
		let count = 0
		for (let i = 0; i < markSplitData.length; i++) {
			for (let j = 0; j < markSplitData[i]['data'].length; j++) {
				markSplitData[i]['data'][j]['erms_value'] = dynamicRemarkForm[count]['value']['col0'];
				count++;
			}
		}
		return markSplitData;
	}
	updateForm() {
		if (this.studentdetailsform.valid &&
			this.studentremarkform.valid &&
			this.admissionremarkform.valid &&
			this.parentremarkform.valid &&
			this.finalremarksform.valid) {
			this.finalremarksform.patchValue({
				au_is_eligible_adimission: this.finalremarksform.value.au_is_eligible_adimission === true ? 'Y' : 'N',
				au_test_date: this.commonAPIService.dateConvertion(this.studentdetailsform.value.au_test_date, 'yyyy-MM-dd'),
				au_interview_date: this.commonAPIService.dateConvertion(this.studentdetailsform.value.au_interview_date, 'yyyy-MM-dd')
			});
			this.managementform.login_id = this.login_id;
			this.managementform.marks = [this.admissionremarkform.value, this.studentremarkform.value, this.parentremarkform.value];
			this.managementform.finalRemark = [this.finalremarksform.value];
			this.managementform.process_type = '2';
			this.managementform.markSplit = this.prepareMarkSplitData();
			this.disableApiCall = true;
			this.sisService.updateManagementRemarks(this.managementform).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.updateDocuments();
					this.commonAPIService.showSuccessErrorMessage('Updated Successfully', 'success');
					this.disableApiCall = false;
					this.resetForm();
				} else {
					this.disableApiCall = false;
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} else {
			this.disableApiCall = false;
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}
	resetForm() {
		this.studentdetailsform.reset();
		this.resetManagementForm();
		this.finalremarksform.reset();
		this.documentsArray = [];
		this.finalDocumentArray = [];
		this.documentFlag = false;
		this.marksTableJson = [];
		this.marksTableJson2 = [];
		this.remarkEntryFlag = false;
	}
	resetManagementForm() {
		this.admissionremarkform.patchValue({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'admission',
			erm_mark_obtained: '',
			erm_remark: ''
		});
		this.studentremarkform.patchValue({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'student',
			erm_mark_obtained: '',
			erm_remark: ''
		});
		this.parentremarkform.patchValue({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'parent',
			erm_mark_obtained: '',
			erm_remark: ''
		});
	}

	// upload documents
	getDocumentRequired() {
		this.documentsArray = [];
		this.sisService.getDocumentRequired().subscribe((result: any) => {
			if (result.status === 'ok') {
				for (const item of result.data) {
					if (item.docreq_status === '1') {
						this.documentsArray.push(item);
					}
				}
				this.documentFlag = true;
				this.getDocuments();
			}
		});
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
				imagebase64: this.currentImage
			};
			this.multipleFileArray.push(fileJson);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result.status === 'ok') {
						for (const item of result.data) {
							const findex = this.finalDocumentArray.findIndex(f =>
								f.ed_login_id === item.login_id && f.ed_docreq_id === doc_req_id);
							const findex2 = this.imageArray.findIndex(f =>
								f.imgName === item.file_url && f.ed_docreq_id === doc_req_id);
							if (findex === -1) {
								this.finalDocumentArray.push({
									ed_login_id: this.login_id,
									ed_docreq_id: doc_req_id,
									ed_name: item.file_name,
									ed_link: item.file_url,
									ed_is_verify: 'N'
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
	viewDocumentUploaded(doc_req_id, docreq_name) {
		this.dialogRef = this.dialog.open(ViewDocumentsComponent, {
			data: {
				doc_req_id: doc_req_id,
				doc_name: docreq_name,
				login_id: this.login_id,
				viewFlag: this.viewOnly,
				editFlag: this.editFlag,
				view_login_id: this.login_id,
				docArray: this.finalDocumentArray
			},
			height: '70vh',
			width: '70vh'
		});
	}
	previewImage(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imgArray,
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
	}
	insertDocuments() {
		this.sisService.insertDocuments({
			ed_login_id: this.login_id,
			document_array: this.finalDocumentArray
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage('Inserted Successfully', 'success');
			}
		});
	}
	deleteComplete(doc_req_id, docreq_name) {
		this.sisService.deleteDocuments({
			ed_login_id: this.login_id,
			ed_docreq_id: doc_req_id
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.getDocuments();
				this.commonAPIService.showSuccessErrorMessage('All Records Deleted for ' + docreq_name, 'success');
			}
		});
	}
	enableEdit() {
		this.viewOnly = false;
		this.editFlag = true;
	}
	insertVerifyId($event) {
		const index = this.verifyArray.indexOf($event.source.value);
		if (index === -1) {
			this.verifyArray.push($event.source.value);
		} else {
			this.verifyArray.splice(index, 1);
		}
	}
	updateDocuments() {
		this.sisService.updateDocuments({
			process_type: '2',
			ed_login_id: this.login_id,
			document_array: this.finalDocumentArray
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				// this.commonAPIService.showSuccessErrorMessage('Updated Successfully', 'success');
				this.getDocuments();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	verifyDocument() {
		this.disableApiCall = true;
		this.sisService.verifyDocuments({
			ed_login_id: this.login_id,
			ed_docreq_id: this.verifyArray,
			ed_verify_by: this.currentUser.login_id
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage('All Documents Verified', 'success');
				for (const item of this.verifyArray) {
					for (const titem of this.finalDocumentArray) {
						if (Number(item) === Number(titem.ed_docreq_id)) {
							titem.ed_is_verify = 'Y';
						}
					}
				}
				this.disableApiCall = false;
			} else {
				this.disableApiCall = false;
			}
		});
	}

	getDocuments() {
		this.documentArray = [];
		this.verifyArray = [];
		this.finalDocumentArray = [];
		this.imageArray = [];
		this.sisService.getDocuments({
			login_id: this.login_id, process_type: '2'
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.documentArray = result.data;
				for (const item of this.documentArray) {
					this.finalDocumentArray.push({
						ed_login_id: item.ed_login_id,
						ed_docreq_id: item.ed_docreq_id,
						ed_name: item.ed_name,
						ed_link: item.ed_link,
						ed_is_verify: item.ed_is_verify
					});
				}
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
			} else {
				// this.commonAPIService.showSuccessErrorMessage('No Record Found', 'error');
			}
		});
	}
	checkVerifiedStatus(value) {
		const index = this.verifyArray.indexOf(value);
		if (index !== -1) {
			return true;
		} else {
			return false;
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
	togglpclass(e) {
		this.pclass = e.checked;
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}
	capitalizeString($event) {
		$event.target.value = $event.target.value.charAt(0).toUpperCase() + $event.target.value.slice(1);
	}

}
