import { Component, OnInit } from '@angular/core';
import { SisService, CommonAPIService,SmartService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-cancel-slctc',
	templateUrl: './cancel-slctc.component.html',
	styleUrls: ['./cancel-slctc.component.scss']
})
export class CancelSlctcComponent implements OnInit {

	tc_id;
	tcdetails: any = {};
	issueform: FormGroup;
	classArray = [];
	sectionArray = [];
	selectedDepartmentArray = [];
	currentImage: any;
	multipleFileArray: any[] = [];
	counter = 0;
	currentFileChangeEvent: any;
	requestDoc = [];
	acknowledgement = '';
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	constructor(
		private sisService: SisService,
		private SmartService: SmartService,
		private commonAPIService: CommonAPIService,
		private fbuild: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getAcknowledgementData();
		this.route.queryParams.subscribe(param => {
			if (param && param.tc_id) {
				this.tc_id = param.tc_id;
				this.getSlcTc(param.tc_id);
			}
		});
	}
	buildForm() {
		this.issueform = this.fbuild.group({
			tc_login_id: '',
			tc_admission_no: '',
			tc_id: '',
			tc_approval_date: '',
			au_full_name: '',
			sec_id: '',
			class_id: '',
			tc_cancel_doc: ''
		});
	}
	getClass() {
		this.classArray = [];
		this.SmartService.getClassData({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({class_id: this.issueform.value.class_id}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	getSlcTc(tc_id) {
			this.sisService.getSlcTc({tc_id: tc_id}).subscribe((result: any) => {
				if (result.status === 'ok') {
					if (result.data.length > 0) {
						this.tcdetails = result.data[0];
						this.issueform.patchValue({
							tc_login_id: this.tcdetails.tc_login_id,
							tc_admission_no: this.tcdetails.tc_admission_no,
							tc_id: this.tcdetails.tc_id,
							tc_approval_date: this.tcdetails.tc_approval_date,
							au_full_name: this.tcdetails.au_full_name,
							sec_id: this.tcdetails.sec_id,
							class_id: this.tcdetails.class_id
						});
						this.getSectionsByClass();
					} else {
						this.commonAPIService.showSuccessErrorMessage('No Records Found', 'error');
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
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
						fileName :  files.name,
						imagebase64 : this.currentImage
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
								this.issueform.patchValue({
									tc_cancel_doc: result.data
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
		deleteRequestDoc(image) {
			if (this.requestDoc.length > 0) {
				const findex = this.requestDoc.findIndex(item => item.file_url === image.file_url);
				if (findex !== -1) {
					this.requestDoc.splice(findex, 1);
					this.issueform.patchValue({
						tc_cancel_doc: this.requestDoc
					});
				}
			}
		}
		isExistUserAccessMenu(mod_id) {
			return this.commonAPIService.isExistUserAccessMenu(mod_id);
		}
		saveForm() {
			if (this.issueform.valid) {
				this.issueform.value.tcd_doc_type = 'cancel';
				this.sisService.cancelSlcTc(this.issueform.value).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage(result.data, 'success');
						this.moveToSlc();
					} else {
						this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					}
				});
			}
		}
	moveToSlc() {
		this.router.navigate(['../slc'], {relativeTo: this.route});
	}
	// resetForm() {
	//   this.issueform.reset();
	//   this.multipleFileArray = [];
	//   this.currentFileChangeEvent = null;
	//   this.requestDoc = [];
	// }
	backUrl() {
		history.back();
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
	checkThumbnail(url: any) {
		if (url.match(/jpg/) || url.match(/png/) || url.match(/bmp/) ||
		url.match(/gif/) ||  url.match(/jpeg/) ||
		url.match(/JPG/) || url.match(/PNG/) || url.match(/BMP/) ||
		url.match(/GIF/) || url.match(/JPEG/)) {
			return true;
		} else {
			return false;
		}
	}

	getAcknowledgementData() {
		this.sisService.getSlcTcTemplateSetting({ usts_id: 7 }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.acknowledgement = result.data[0].usts_template;
			} else {
				this.acknowledgement = '';
			}
		});
	}
}
