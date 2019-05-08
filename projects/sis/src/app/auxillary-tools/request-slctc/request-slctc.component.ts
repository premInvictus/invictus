import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';

@Component({
	selector: 'app-request-slctc',
	templateUrl: './request-slctc.component.html',
	styleUrls: ['./request-slctc.component.scss']
})
export class RequestSlctcComponent implements OnInit {

	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	requestDoc = [];
	classArray = [];
	sectionArray = [];
	reasonDataArray = [];
	studentdetailsform: FormGroup;
	studentdetials: any = {};
	login_id: any;
	multipleFileArray: any[] = [];
	currentImage: any;
	counter = 0;
	currentFileChangeEvent: any;
	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getReason();
	}
	buildForm() {
		this.studentdetailsform = this.fbuild.group({
			tc_login_id: '',
			au_full_name: '',
			class_id: '',
			sec_id: '',
			father_name: '',
			mother_name: '',
			au_mobile: '',
			au_email: '',
			tc_admission_no: '',
			tc_request_date: '',
			tc_reason: '',
			tc_remark: '',
			tc_doc: '',
			tcd_doc_type: ''
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
	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.studentdetailsform.value.class_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	getReason() {
		this.sisService.getReason({ reason_type: 9 }).subscribe((result: any) => {
			if (result) {
				this.reasonDataArray = result.data;
			}
		});
	}
	getStudentDetails(admno) {
		if (admno) {
			this.sisService.getMasterStudentDetail({ admission_no: admno, enrollment_type: '4' }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.login_id = result.data[0].au_login_id;
					this.studentdetials = result.data[0];
					this.studentdetailsform.patchValue({
						tc_login_id: this.studentdetials.au_login_id,
						au_full_name: this.studentdetials.au_full_name,
						class_id: this.studentdetials.class_id,
						au_mobile: this.studentdetials.au_mobile,
						sec_id: this.studentdetials.sec_id,
						au_email: this.studentdetials.au_email,
						father_name: this.studentdetials.father_name,
						mother_name: this.studentdetials.mother_name,
					});
					this.getSectionsByClass();
				} else {
					this.resetForm();
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}

	fileChangeEvent(fileInput) {
		this.counter = 0;
		this.multipleFileArray = [];
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i]);
		}
	}
	IterateFileLoop(files) {
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
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage('Document Uploaded Successfully', 'success');
						if (result.data.length > 0) {
							this.studentdetailsform.patchValue({
								tc_doc: result.data
							});
							this.requestDoc = result.data;
						}
					} else {
						this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					}
				});
			}

		};
		reader.readAsDataURL(files);
	}

	saveForm() {
		if (this.studentdetailsform.valid) {
			this.studentdetailsform.value.tcd_doc_type = 'request';
			this.studentdetailsform.value.tc_request_date = this.commonAPIService.dateConvertion(new Date(), 'yyyy-MM-dd');
			this.sisService.insertSlcTc(this.studentdetailsform.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'success');
					this.resetForm();
					this.backUrl();
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	resetForm() {
		this.studentdetailsform.reset();
		this.multipleFileArray = [];
		this.currentFileChangeEvent = null;
		this.requestDoc = [];
	}
	deleteRequestDoc(image) {
		if (this.requestDoc.length > 0) {
			const findex = this.requestDoc.findIndex(item => item.file_url === image.file_url);
			if (findex !== -1) {
				this.requestDoc.splice(findex, 1);
				this.studentdetailsform.patchValue({
					tc_doc: this.requestDoc
				});
			}
		}
	}
	backUrl() {
		this.router.navigate(['../slc'], { relativeTo: this.route });
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
