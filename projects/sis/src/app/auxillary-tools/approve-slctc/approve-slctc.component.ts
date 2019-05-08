import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-approve-slctc',
	templateUrl: './approve-slctc.component.html',
	styleUrls: ['./approve-slctc.component.scss']
})
export class ApproveSlctcComponent implements OnInit {

	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	classArray = [];
	sectionArray = [];
	departmentArray = [];
	selectedDepartmentArray = [];
	reasonDataArray = [];
	studentdetailsform: FormGroup;
	studentdetials: any = {};
	requestDoc = [];
	approvetDoc = [];
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
		this.route.queryParams.subscribe(param => {
			if (param && param.tc_id) {
				this.getStudentDetails(param.tc_id);
			}
		});
		this.buildForm();
		this.getClass();
		this.getReason();
		this.getDepartment();
	}
	buildForm() {
		this.studentdetailsform = this.fbuild.group({
			tc_id: '',
			tc_login_id: '',
			au_full_name: '',
			class_id: '',
			sec_id: '',
			father_name: '',
			mother_name: '',
			au_mobile: '',
			au_email: '',
			tc_admission_no: '',
			tc_approval_date: '',
			tc_reason: '',
			tc_remark: '',
			tc_approval_doc: '',
			tc_approval_check_list: []
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
	getDepartment() {
		this.departmentArray = [];
		this.sisService.getDepartment({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.departmentArray = result.data;
			}
		});
	}
	getReason() {
		this.sisService.getReason({ reason_type: 10 }).subscribe((result: any) => {
			if (result) {
				this.reasonDataArray = result.data;
			}
		});
	}
	getStudentDetails(tc_id) {
		if (tc_id) {
			this.requestDoc = [];
			this.sisService.getSlcTc({ tc_id: tc_id }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.login_id = result.data[0].au_login_id;
					this.studentdetials = result.data[0];
					this.studentdetailsform.patchValue({
						tc_id: this.studentdetials.tc_id,
						tc_admission_no: this.studentdetials.tc_admission_no,
						tc_login_id: this.studentdetials.tc_login_id,
						au_full_name: this.studentdetials.au_full_name,
						class_id: this.studentdetials.class_id,
						au_mobile: this.studentdetials.au_mobile,
						sec_id: this.studentdetials.sec_id,
						au_email: this.studentdetials.au_email,
						father_name: this.studentdetials.father_name,
						mother_name: this.studentdetials.mother_name,
						tc_remark: this.studentdetials.tc_remark,
						tc_reason: this.studentdetials.tc_reason
					});
					this.getSectionsByClass();
					if (this.studentdetials.tc_doc.length > 0) {
						for (const item of this.studentdetials.tc_doc) {
							if (item.tcd_doc_type === 'request' && item.tcd_doc_link) {
								this.requestDoc.push(item);
							}
						}
					}
				} else {
					this.resetForm();
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
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
	previewImage1(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imgArray,
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
	}
	addDept(value) {
		const findex = this.selectedDepartmentArray.findIndex(item => item === value);
		if (findex === -1) {
			this.selectedDepartmentArray.push(value);
		} else {
			this.selectedDepartmentArray.splice(findex, 1);
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
						const fileUrl = [];
						if (result.data.length > 0) {
							/* for (const item of result.data) {
                fileUrl.push(item);
              } */
							this.studentdetailsform.patchValue({
								tc_approval_doc: result.data
							});
							this.approvetDoc = result.data;
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
			this.studentdetailsform.value.tc_approval_check_list = this.selectedDepartmentArray;
			this.studentdetailsform.value.tcd_doc_type = 'approve';
			this.studentdetailsform.value.tc_approval_date = this.commonAPIService.dateConvertion(new Date(), 'yyyy-MM-dd');
			this.sisService.approveSlcTc(this.studentdetailsform.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'success');
					this.resetForm();
					this.router.navigate(['../slc'], { relativeTo: this.route });
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	resetForm() {
		this.studentdetailsform.reset();
		this.selectedDepartmentArray = [];
		this.requestDoc = [];
		this.multipleFileArray = [];
		this.currentFileChangeEvent = null;
	}
	deleteRequestDoc(image) {
		if (this.approvetDoc.length > 0) {
			const findex = this.approvetDoc.findIndex(item => item.file_url === image.file_url);
			if (findex !== -1) {
				this.approvetDoc.splice(findex, 1);
				this.studentdetailsform.patchValue({
					tc_approval_doc: this.approvetDoc
				});
			}
		}
	}
	backUrl() {
		// history.back(-1);
		history.back();
	}
	printRequestSlcTc() {
		this.sisService.printRequestSlcTc({ tc_id: this.studentdetailsform.value.tc_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				// const url = result.data;
				// window.open(url, 'Download');
				if (result.data) {
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
				}
			}
		});
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
