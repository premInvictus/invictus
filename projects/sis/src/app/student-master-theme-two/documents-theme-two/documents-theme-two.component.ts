import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ViewDocumentsComponent } from '../../student-master/documents/view-documents/view-documents.component';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';

@Component({
	selector: 'app-documents-theme-two',
	templateUrl: './documents-theme-two.component.html',
	styleUrls: ['./documents-theme-two.component.scss']
})
export class DocumentsThemeTwoComponent implements OnInit, OnChanges {
	dialogRef: MatDialogRef<ViewDocumentsComponent>;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	Documents_Form: FormGroup;
	currentImage: any;
	documentsArray: any[] = [];
	finalDocumentArray: any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	@Input() addOnly = false;
	@Input() viewOnly = false;
	@Input() editFlag = false;
	@Input() documentFormData: any;
	@Input() docContext: any;
	@Input() configSetting: any;
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
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getDocumentRequired();
		this.getDocuments();
	}
	ngOnChanges() {
		this.getDocuments();
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
									ed_login_id: this.docContext,
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
				view_login_id: '1001',
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
			height: '100vh',
			width: '100vh'
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
	insertVerifyId($event) {
		const index = this.verifyArray.indexOf($event.source.value);
		if (index === -1) {
			this.verifyArray.push($event.source.value);
		} else {
			this.verifyArray.splice(index, 1);
		}
	}
	verifyDocument() {
		this.sisService.verifyDocuments({
			ed_login_id: this.docContext,
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

	getDocuments() {
		this.documentArray = [];
		this.verifyArray = [];
		this.finalDocumentArray = [];
		this.imageArray = [];
		this.documentArray = this.documentFormData;
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

}
