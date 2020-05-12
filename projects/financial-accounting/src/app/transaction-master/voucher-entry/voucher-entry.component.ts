import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import { saveAs } from 'file-saver';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { PreviewDocumentComponent } from '../../fa-shared/preview-document/preview-document.component';
@Component({
	selector: 'app-voucher-entry',
	templateUrl: './voucher-entry.component.html',
	styleUrls: ['./voucher-entry.component.scss']
})
export class VoucherEntryComponent implements OnInit {
	paramForm: FormGroup;
	voucherForm: FormGroup;
	voucherEntryArray:any[]=[];
	voucherFormGroupArray: any[] = [];
	attachmentArray:any[] =[];
	multipleFileArray: any[] = [];
	currentFileChangeEvent: any;
	currentFile: any;
	fileCounter = 0;
	totalDebit = 0;
	totalCredit = 0;
	currentVcType = 'Journel Entry';
	accountsArray:any[] = [];
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private faService:FaService,
		private dialog: MatDialog
	) { }


	ngOnInit() {
		this.setVcType(this.currentVcType);
	}

	setVcType(vcType) {
		console.log('vcType--', vcType);
		this.currentVcType = vcType;
		this.voucherFormGroupArray = [];
		this.totalDebit = 0;
		this.totalCredit = 0;
		this.buildForm();
		this.getAccounts();
	}

	getAccounts() {
		this.faService.getAllChartsOfAccount({}).subscribe((data:any)=>{
			if(data) {
				this.accountsArray = data;
			} else {
				this.accountsArray = [];
			}
		})
	}

	buildForm() {
		this.voucherForm = this.fbuild.group({
			vc_number: '',
			vc_date:'',
			vc_narrations: ''
		});
		this.paramForm = this.fbuild.group({
			vc_account_type_id: '',
			vc_particulars: '',
			vc_debit: '',
			vc_credit: ''
		});
		this.voucherFormGroupArray.push(this.paramForm);
		console.log(this.voucherFormGroupArray);
	}

	addVoucher() {
		this.paramForm = this.fbuild.group({
			vc_account_type_id: '',
			vc_particulars: '',
			vc_debit: '',
			vc_credit: ''
		});
		this.voucherFormGroupArray.push(this.paramForm);
	}

	deleteVoucherEntry(i) {
		this.voucherFormGroupArray.splice(i,1);
	}

	saveAsDraft() {
		console.log('this.voucherForm', this.voucherForm);
		console.log('this.voucherForm', this.voucherFormGroupArray);
		for (let i=0; i<this.voucherFormGroupArray.length;i++) {
			let vFormJson = {};
			vFormJson = {
				vc_account_type_id: this.voucherFormGroupArray[i].value.vc_account_type_id,
				vc_particulars: this.voucherFormGroupArray[i].value.vc_particulars,
				vc_debit: this.voucherFormGroupArray[i].value.vc_debit,
				vc_credit: this.voucherFormGroupArray[i].value.vc_credit
			};
			this.voucherEntryArray.push(vFormJson);
		}

		var inputJson = {
			vc_type:'journel-entry',
			vc_number:this.voucherForm.value.vc_number,
			vc_date:this.voucherForm.value.vc_date,
			vc_narrations:this.voucherForm.value.vc_narrations,
			vc_attachments: this.attachmentArray,
			vc_particulars_data: this.voucherEntryArray,
			vc_state : 'draft'
		}

		this.faService.insertVoucherEntry(inputJson).subscribe((data:any)=>{
			if(data) {
				this.commonAPIService.showSuccessErrorMessage('Voucher entry Published Successfully', 'success');
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Publish Voucher Entry', 'error');
			}
		});
	}

	saveAndPublish() {
		console.log('this.voucherForm', this.voucherForm);
		console.log('this.voucherForm', this.voucherFormGroupArray);
		for (let i=0; i<this.voucherFormGroupArray.length;i++) {
			let vFormJson = {};
			vFormJson = {
				vc_account_type_id: this.voucherFormGroupArray[i].value.vc_account_type_id,
				vc_particulars: this.voucherFormGroupArray[i].value.vc_particulars,
				vc_debit: this.voucherFormGroupArray[i].value.vc_debit,
				vc_credit: this.voucherFormGroupArray[i].value.vc_credit
			};
			this.voucherEntryArray.push(vFormJson);
		}

		var inputJson = {
			vc_type:'journel-entry',
			vc_number:this.voucherForm.value.vc_number,
			vc_date:this.voucherForm.value.vc_date,
			vc_narrations:this.voucherForm.value.vc_narrations,
			vc_attachments: this.attachmentArray,
			vc_particulars_data: this.voucherEntryArray,
			vc_state : 'publish'
		}

		this.faService.insertVoucherEntry(inputJson).subscribe((data:any)=>{
			if(data) {
				this.commonAPIService.showSuccessErrorMessage('Voucher entry Published Successfully', 'success');
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Publish Voucher Entry', 'error');
			}
		});
	}

	fileChangeEvent(fileInput) {
		this.multipleFileArray = [];
		this.fileCounter = 0;
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i]);
		}
	}

	IterateFileLoop(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentFile = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentFile
			};
			this.multipleFileArray.push(fileJson);
			this.fileCounter++;
			if (this.fileCounter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						for (const item of result.data) {
							const findex2 = this.attachmentArray.findIndex(f => f.imgUrl === item.file_url);
							if (findex2 === -1) {
								this.attachmentArray.push({
									imgUrl: item.file_url,
									imgName: item.file_name
								});
							} else {
								this.attachmentArray.splice(findex2, 1);
							}
						}
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}

	previewImage(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: imgArray,
				index: index
			},
			height: '70vh',
			width: '70vh'
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

	cancel() {
		this.voucherForm.reset();
		this.setVcType('Jornel Entry');
	}

	calculateDebitTotal() {
		
	}
}
