import { Component, OnInit } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-reissue-slctc',
	templateUrl: './reissue-slctc.component.html',
	styleUrls: ['./reissue-slctc.component.scss']
})
export class ReissueSlctcComponent implements OnInit {

	tc_id;
	tcdetails: any = {};
	reissueform: FormGroup;
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
		this.reissueform = this.fbuild.group({
			tc_login_id: '',
			tc_admission_no: '',
			tc_id: '',
			tc_approval_date: '',
			au_full_name: '',
			sec_id: '',
			class_id: '',
			tc_reissued_doc: '',
			tc_reissue_check_list: '',
			tcd_doc_type: '',
			tcd_is_verify: '',
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
		this.sisService.getSectionsByClass({ class_id: this.reissueform.value.class_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	getSlcTc(tc_id) {
		this.sisService.getSlcTc({ tc_id: tc_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				if (result.data.length > 0) {
					this.tcdetails = result.data[0];
					this.reissueform.patchValue({
						tc_login_id: this.tcdetails.tc_login_id,
						tc_admission_no: this.tcdetails.tc_admission_no,
						tc_id: this.tcdetails.tc_id,
						tc_approval_date: this.tcdetails.tc_approval_date,
						au_full_name: this.tcdetails.au_full_name,
						sec_id: this.tcdetails.sec_id,
						class_id: this.tcdetails.class_id
					});
					this.getSectionsByClass();
					if (this.tcdetails.tc_doc.length > 0) {
						for (const item of this.tcdetails.tc_doc) {
							if (item.tcd_doc_type === 'reissued') {
								this.requestDoc.push({ file_name: item.tcd_doc_name, file_url: item.tcd_doc_link });
							}
						}
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage('No Records Found', 'error');
				}
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
			}
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
							for (const item of result.data) {
								this.requestDoc.push(item);
							}
							this.reissueform.patchValue({
								tc_reissued_doc: this.requestDoc
							});
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
				this.reissueform.patchValue({
					tc_reissued_doc: this.requestDoc
				});
			}
		}
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}
	saveForm() {
		if (this.reissueform.valid) {
			this.reissueform.value.tc_reissue_check_list = this.selectedDepartmentArray;
			this.reissueform.value.tcd_doc_type = 'reissued';
			this.sisService.reissueSlcTc(this.reissueform.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Reissue Successfully', 'success');
					if (result.data) {
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					}
					this.moveToSlc();
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	moveToSlc() {
		this.router.navigate(['../slc'], { relativeTo: this.route });
	}
	resetForm() {
		this.reissueform.reset();
		this.multipleFileArray = [];
		this.currentFileChangeEvent = null;
		this.requestDoc = [];
		this.selectedDepartmentArray = [];
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
	verifyDoc() {
		this.reissueform.patchValue({
			tcd_is_verify: 'Y'
		});
		this.commonAPIService.showSuccessErrorMessage('Docu,ments verified', 'success');
	}

	backUrl() {
		history.back(-1);
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

	getAcknowledgementData() {
		this.sisService.getSlcTcTemplateSetting({ usts_id: 6 }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.acknowledgement = result.data[0].usts_template;
			} else {
				this.acknowledgement = '';
			}
		});
	}

}
