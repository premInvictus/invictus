import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ViewDocumentsComponent } from './view-documents/view-documents.component';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { PreviewDocumentComponent } from './preview-document/preview-document.component';
@Component({
	selector: 'app-documents',
	templateUrl: './documents.component.html',
	styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent extends DynamicComponent implements OnInit {
	dialogRef: MatDialogRef<ViewDocumentsComponent>;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	Documents_Form: FormGroup;
	currentImage: any;
	documentsArray: any[] = [];
	finalDocumentArray: any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	addOnly = false;
	viewOnly = false;
	editOnly = false;
	editFlag = false;
	saveFlag = false;
	login_id; any;
	verifyArray: any[] = [];
	currentUser: any;
	documentArray: any[] = [];
	imageArray: any[] = [];
	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private dialog: MatDialog,
		private commomService: CommonAPIService,
		private formEnabledService: FormEnabledService,
		private processtypeService: ProcesstypeService
	) { super(); }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getDocumentRequired();
		this.commomService.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				const processType = this.processtypeService.getProcesstype();
				if (processType === '2' || processType === '3' || processType === '4') {
					this.getDocuments(this.login_id);
				}
			}
		});
		this.commomService.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.buildForm();
				this.viewOnly = false;
				this.addOnly = true;
			}
			if (data && data.viewMode) {
				this.viewOnly = true;
				this.addOnly = false;
				this.editOnly = false;
				this.saveFlag = false;
			}
			if (data && data.editMode) {
				this.viewOnly = false;
				this.saveFlag = true;
			}
		});
	}
	buildForm() {
		this.Documents_Form = this.fbuild.group({
			au_dob: '',
			file_doc: '',
			au_si_prefix: '',
			au_examination_report: '',
			au_bg: '',
			upd_aadhaar_no: '',
			upd_id: '',
			upd_assessment: '',
			ur_other: '',
		});
	}
	getDocumentRequired() {
		this.sisService.getDocumentRequired().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					if (item.docreq_status === '1') {
						this.documentsArray.push(item);
					}
				}
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
								this.finalDocumentArray.push({
									ed_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
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
				view_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
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
			ed_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			document_array: this.finalDocumentArray
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commomService.showSuccessErrorMessage('Inserted Successfully', 'success');
				this.commomService.renderTab.next({ tabMove: true });
			}
		});
	}
	deleteComplete(doc_req_id, docreq_name) {
		this.sisService.deleteDocuments({
			ed_login_id: this.login_id,
			ed_docreq_id: doc_req_id
		}).subscribe((result: any) => {
			if (result) {
				this.commomService.showSuccessErrorMessage('All Records Deleted for ' + docreq_name, 'success');
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
	updateDocuments(isview) {
		this.sisService.updateDocuments({
			ed_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			document_array: this.finalDocumentArray
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commomService.showSuccessErrorMessage('Document Updated Successfully', 'success');
				this.getDocuments(this.login_id);
				if (isview) {
					// this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
					this.commomService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
				}
			} else {
				this.commomService.showSuccessErrorMessage(result.data, 'error');
				this.commomService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
			}
		});
	}
	verifyDocument() {
		this.sisService.verifyDocuments({
			ed_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			ed_docreq_id: this.verifyArray,
			ed_verify_by: this.currentUser.login_id
		}).subscribe((result: any) => {
			if (result) {
				this.commomService.showSuccessErrorMessage('All Documents Verified', 'success');
				for (const item of this.verifyArray) {
					for (const titem of this.finalDocumentArray) {
						if (Number(item) === Number(titem.ed_docreq_id)) {
							titem.ed_is_verify = 'Y';
						}
					}
				}
			}
		});
	}

	getDocuments(login_id) {
		if (login_id) {
			this.documentArray = [];
			this.verifyArray = [];
			this.finalDocumentArray = [];
			this.imageArray = [];
			this.sisService.getDocuments({
				login_id: login_id
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
					this.documentArray = [];
					this.verifyArray = [];
					this.finalDocumentArray = [];
					this.imageArray = [];
				}
			});
		}
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

	cancelForm() {
		if (this.addOnly) {
			this.commomService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag) {
			this.commomService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
			this.getDocuments(this.login_id);
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
}
