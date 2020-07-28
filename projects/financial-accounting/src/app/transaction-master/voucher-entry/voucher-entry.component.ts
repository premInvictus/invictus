import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import { saveAs } from 'file-saver';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { PreviewDocumentComponent } from '../../fa-shared/preview-document/preview-document.component';
import { VoucherRefModalComponent } from '../../fa-shared/voucher-ref-modal/voucher-ref-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemCodeGenerationComponent } from 'projects/inventory/src/app/inventory-configuration/item-code-generation/item-code-generation.component';
import * as moment from 'moment';
@Component({
	selector: 'app-voucher-entry',
	templateUrl: './voucher-entry.component.html',
	styleUrls: ['./voucher-entry.component.scss']
})
export class VoucherEntryComponent implements OnInit {
	refData: any
	paramForm: FormGroup;
	voucherForm: FormGroup;
	voucherEntryArray: any[] = [];
	voucherFormGroupArray: any[] = [];
	attachmentArray: any[] = [];
	multipleFileArray: any[] = [];
	currentFileChangeEvent: any;
	currentFile: any;
	fileCounter = 0;
	totalDebit = 0;
	totalCredit = 0;
	currentVcType = 'Journal';
	suffix = 'Voucher';
	accountsArray: any[] = [];
	editMode = false;
	currentVoucherId = '';
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	orderMaster: any[] = [];
	today = new Date();
	vcYearlyStatus = 0;
	acc_type_id_arr:any[] = [];
	accountTypeArr:any=[];

	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private faService: FaService,
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute
	) { }


	ngOnInit() {
		this.getAccountMaster();
		this.route.queryParams.subscribe(value => {
			if (value.voucher_id) {
				this.getGlobalSetting();
				this.editMode = true;
				this.currentVoucherId = value.voucher_id;
				this.getVoucherData(value.voucher_id);
			}
		});
		this.getGlobalSetting();
		if(this.commonAPIService.currentVcType){
			this.setVcType(this.commonAPIService.currentVcType);
		} else {
			this.setVcType(this.currentVcType);
		}
		//this.getOrderMaster();
	}
	getAccountMaster() {
		this.faService.getAccountMaster({}).subscribe((data:any)=>{
			if(data) {
				for(let i=0; i<data.length;i++) {
					if(data[i]['acc_state']==='acc_type') {
						if((data[i].acc_id)){
							this.accountTypeArr.push(data[i].acc_id);
						}
						console.log('this.accountTypeArr',this.accountTypeArr);
					}
				}
			}
		});
	}
	setaccount(item, i) {
		this.voucherFormGroupArray[i].patchValue({
			vc_account_type_id: item.coa_id,
			vc_account_type: item.coa_acc_name
		});
		console.log('voucherFormGroupArray', this.voucherFormGroupArray[i].value);
	}
	getVoucherTypeMaxId() {
		let param: any = {};
		const tempDate = this.voucherForm.value.vc_date;
		param.vc_type = this.currentVcType;
		param.vc_date = tempDate.format('YYYY-MM-DD');

		this.faService.getVoucherTypeMaxId(param).subscribe((data: any) => {
			if (data) {
				this.voucherForm.patchValue({
					vc_number: data.vc_code,
				})
				console.log('voucher max id--', data);
			}
		});
	}

	getOrderMaster(event = null) {

		if (event) {
			console.log('key', event.keyCode);
			if (event.keyCode != 38 && event.keyCode != 40) {
				let param: any = {};
				param.pm_type = 'GR'
				if (event) {
					param.pm_id = event.target.value
				}
				this.faService.getOrderMaster(param).subscribe((data: any) => {
					if (data) {
						this.orderMaster = data;
						console.log('getOrderMaster', data);
					}
				});
			}
		} else {
			let param: any = {};
			param.pm_type = 'GR'
			if (event) {
				param.pm_id = event.target.value
			}
			this.faService.getOrderMaster(param).subscribe((data: any) => {
				if (data) {
					this.orderMaster = data;
					console.log('getOrderMaster', data);
				}
			});
		}
	}

	getVoucherData(voucherId) {
		this.faService.getVoucherEntry({ vc_id: voucherId }).subscribe((data: any) => {
			if (data) {
				this.currentVcType = data.vc_type;
				this.voucherForm.patchValue({
					vc_number: data.vc_number.vc_code,
					vc_date: data.vc_date,
					vc_narrations: data.vc_narrations
				});
				this.attachmentArray = data.vc_attachments;
				for (let i = 0; i < data.vc_particulars_data.length; i++) {
					var paramjson = this.fbuild.group({
						vc_account_type: data.vc_particulars_data[i]['vc_account_type'],
						vc_account_type_id: data.vc_particulars_data[i]['vc_account_type_id'],
						vc_particulars: data.vc_particulars_data[i]['vc_particulars'],
						vc_grno: data.vc_particulars_data[i]['vc_grno'],
						vc_invoiceno: data.vc_particulars_data[i]['vc_invoiceno'],
						selected: data.vc_particulars_data[i]['selected'],
						vc_debit: data.vc_particulars_data[i]['vc_debit'],
						vc_credit: data.vc_particulars_data[i]['vc_credit'],
					});
					this.voucherFormGroupArray.push(paramjson);
				}
				this.calculateDebitTotal();
				this.calculateCreditTotal();
				this.refData = {
					currentTabIndex: data.vc_particulars_data[0].vc_grno,
					selection: data.vc_particulars_data[0].vc_invoiceno,
					amount: data.vc_particulars_data[0].vc_debit,
					selected: data.vc_particulars_data[0].selected,
					update: this.editMode
				}
			} else {

			}
		})
	}
	setVcType(vcType) {
		this.commonAPIService.currentVcType = vcType;
		console.log('vcType--', vcType);
		this.currentVcType = vcType;
		this.voucherFormGroupArray = [];
		this.totalDebit = 0;
		this.totalCredit = 0;
		this.buildForm();
		this.getAccounts();
	}

	getAccounts(event = null) {
		console.log('event', event);
		this.acc_type_id_arr = [];
		if(this.currentVcType == 'Contra'){
			this.acc_type_id_arr.push(13);
		} else if(this.currentVcType == 'Journal' || this.currentVcType == 'Credit Note' || this.currentVcType == 'Debit Note'){
			this.accountTypeArr.forEach(element => {
				if(element != 13){
					this.acc_type_id_arr.push(element);
				}
			});
		}
		console.log('this.acc_type_id_arr',this.acc_type_id_arr);
		if (event) {
			console.log('key', event.keyCode);
			if (event.keyCode != 38 && event.keyCode != 40) {
				let param: any = {};
				if (event) {
					param.coa_acc_name = event.target.value
				}
				if(this.acc_type_id_arr.length > 0){
					param.acc_type_id =this.acc_type_id_arr;
				}
				this.faService.getAllChartsOfAccount(param).subscribe((data: any) => {
					if (data) {
						this.accountsArray = data;
					} else {
						this.accountsArray = [];
					}
				})
			}
		} else {
			let param: any = {};
			if (event) {
				param.coa_acc_name = event.target.value
			}
			if(this.acc_type_id_arr.length > 0){
				param.acc_type_id =this.acc_type_id_arr;
			}
			this.faService.getAllChartsOfAccount(param).subscribe((data: any) => {
				if (data) {
					this.accountsArray = data;
				} else {
					this.accountsArray = [];
				}
			})
		}
	}
	setOrderMaster(item, i) {
		this.voucherFormGroupArray[i].patchValue({
			vc_grno: item.pm_id,
			vc_invoiceno: item.pm_details.invoice_no
		});
		console.log('voucherFormGroupArray', this.voucherFormGroupArray[i].value);
	}
	buildForm() {
		this.voucherForm = this.fbuild.group({
			vc_number: '',
			vc_date: moment(),
			vc_narrations: ''
		});
		if (!(this.editMode)) {
			this.paramForm = this.fbuild.group({
				vc_account_type: '',
				vc_account_type_id: '',
				vc_particulars: '',
				vc_grno: '',
				vc_invoiceno: '',
				selected: '',
				vc_debit: '',
				vc_credit: ''
			});
			this.voucherFormGroupArray.push(this.paramForm);
			this.addVoucher();
			this.getVoucherTypeMaxId();
		}


		console.log(this.voucherFormGroupArray);
	}

	addVoucher() {
		this.paramForm = this.fbuild.group({
			vc_account_type: '',
			vc_account_type_id: '',
			vc_particulars: '',
			vc_grno: '',
			vc_invoiceno: '',
			selected: '',
			vc_debit: '',
			vc_credit: ''
		});
		this.voucherFormGroupArray.push(this.paramForm);
	}

	deleteVoucherEntry(i) {
		this.voucherFormGroupArray.splice(i, 1);
		this.calculateDebitTotal();
		this.calculateCreditTotal();
	}

	validateVoucher() {
		let valid = true;
		for (let i = 0; i < this.voucherFormGroupArray.length; i++) {
			if (this.voucherFormGroupArray[i].value.vc_credit && this.voucherFormGroupArray[i].value.vc_debit) {
				valid = false;
				break;
			}
		}
		return valid;
	}

	saveAsDraft() {
		console.log('this.voucherForm', this.voucherForm);
		console.log('this.voucherForm', this.voucherFormGroupArray);
		this.voucherEntryArray = [];
		if (this.validateVoucher()) {
			if (this.voucherForm.valid) {
				for (let i = 0; i < this.voucherFormGroupArray.length; i++) {
					if (this.voucherFormGroupArray[i].value.vc_credit || this.voucherFormGroupArray[i].value.vc_debit) {
						let vFormJson = {};
						vFormJson = {
							vc_account_type: this.voucherFormGroupArray[i].value.vc_account_type,
							vc_account_type_id: this.voucherFormGroupArray[i].value.vc_account_type_id,
							vc_particulars: this.voucherFormGroupArray[i].value.vc_particulars,
							vc_grno: this.voucherFormGroupArray[i].value.vc_grno,
							vc_invoiceno: this.voucherFormGroupArray[i].value.vc_invoiceno,
							selected: this.voucherFormGroupArray[i].value.selected,
							vc_debit: this.voucherFormGroupArray[i].value.vc_debit,
							vc_credit: this.voucherFormGroupArray[i].value.vc_credit
						};
						this.voucherEntryArray.push(vFormJson);
					}

				}
				if (this.voucherEntryArray.length > 0) {
					let tempdate: any;
					if (!moment.isMoment(this.voucherForm.value.vc_date)) {
						tempdate = moment(this.voucherForm.value.vc_date);
					} else {
						tempdate = (this.voucherForm.value.vc_date);
					}
					var inputJson = {
						vc_id: this.editMode ? this.currentVoucherId : null,
						vc_type: this.currentVcType,
						vc_number: { vc_code: this.voucherForm.value.vc_number, vc_name: this.getVcName() },
						vc_date: tempdate.format("YYYY-MM-DD"),
						vc_narrations: this.voucherForm.value.vc_narrations,
						vc_attachments: this.attachmentArray,
						vc_particulars_data: this.voucherEntryArray,
						vc_state: 'draft',
						vc_sattle_status: 1
					}

					if (this.currentVoucherId) {
						this.faService.updateVoucherEntry(inputJson).subscribe((data: any) => {
							if (data) {
								this.commonAPIService.showSuccessErrorMessage('Voucher entry Published Successfully', 'success');
								this.cancel();
							} else {
								this.commonAPIService.showSuccessErrorMessage('Error While Publish Voucher Entry', 'error');
							}
						});
					} else {
						this.faService.insertVoucherEntry(inputJson).subscribe((data: any) => {
							if (data) {
								this.commonAPIService.showSuccessErrorMessage('Voucher entry Published Successfully', 'success');
								this.cancel();
							} else {
								this.commonAPIService.showSuccessErrorMessage('Error While Publish Voucher Entry', 'error');
							}
						});
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage('Please Fill all Required Fields', 'error');
				}



			} else {
				this.commonAPIService.showSuccessErrorMessage('Please Fill all Required Fields', 'error');
			}
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Fill either debit or credit', 'error');
		}
	}

	saveAndPublish() {
		console.log('this.voucherForm', this.voucherForm);
		console.log('this.voucherForm', this.voucherFormGroupArray);
		console.log(this.totalCredit, this.totalDebit);
		this.voucherEntryArray = [];
		if (this.validateVoucher()) {
			if (this.voucherForm.valid) {
				if (this.totalDebit == this.totalCredit) {
					for (let i = 0; i < this.voucherFormGroupArray.length; i++) {
						let vFormJson = {};
						vFormJson = {
							vc_account_type: this.voucherFormGroupArray[i].value.vc_account_type,
							vc_account_type_id: this.voucherFormGroupArray[i].value.vc_account_type_id,
							vc_particulars: this.voucherFormGroupArray[i].value.vc_particulars,
							vc_grno: this.voucherFormGroupArray[i].value.vc_grno,
							vc_invoiceno: this.voucherFormGroupArray[i].value.vc_invoiceno,
							selected: this.voucherFormGroupArray[i].value.selected,
							vc_debit: this.voucherFormGroupArray[i].value.vc_debit,
							vc_credit: this.voucherFormGroupArray[i].value.vc_credit
						};
						this.voucherEntryArray.push(vFormJson);
					}
					let tempdate: any;
					if (!moment.isMoment(this.voucherForm.value.vc_date)) {
						tempdate = moment(this.voucherForm.value.vc_date);
					} else {
						tempdate = (this.voucherForm.value.vc_date);
					}
					var inputJson = {
						vc_id: this.editMode ? this.currentVoucherId : null,
						vc_type: this.currentVcType,
						vc_number: { vc_code: this.voucherForm.value.vc_number, vc_name: this.getVcName() },
						vc_date: tempdate.format("YYYY-MM-DD"),
						vc_narrations: this.voucherForm.value.vc_narrations,
						vc_attachments: this.attachmentArray,
						vc_particulars_data: this.voucherEntryArray,
						vc_state: 'publish',
						vc_sattle_status: 1
					}

					if (this.currentVoucherId) {
						this.faService.updateVoucherEntry(inputJson).subscribe((data: any) => {
							if (data) {
								this.commonAPIService.showSuccessErrorMessage('Voucher entry Published Successfully', 'success');
								this.cancel();
							} else {
								this.commonAPIService.showSuccessErrorMessage('Error While Publish Voucher Entry', 'error');
							}
						});
					} else {
						this.faService.insertVoucherEntry(inputJson).subscribe((data: any) => {
							if (data) {
								this.commonAPIService.showSuccessErrorMessage('Voucher entry Published Successfully', 'success');
								this.cancel();
							} else {
								this.commonAPIService.showSuccessErrorMessage('Error While Publish Voucher Entry', 'error');
							}
						});
					}

				} else {
					this.commonAPIService.showSuccessErrorMessage('Total of Debit and Credit should be same for publish', 'error');
				}
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please Fill all Required Fields', 'error');
			}
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Fill either debit or credit', 'error');
		}

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
		console.log('imgArray--', imgArray, index);
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
		this.editMode = false;
		this.voucherForm.reset();
		this.totalCredit = 0;
		this.totalDebit = 0;
		this.voucherFormGroupArray = [];
		this.attachmentArray = [];
		this.setVcType(this.currentVcType);
		this.refData = null;
		// this.voucherForm.patchValue({
		// 	vc_date: moment()
		// })
		// this.getVoucherTypeMaxId();
		this.router.navigate(['../../transaction-master/voucher-entry'], { queryParams: {}, relativeTo: this.route });
	}

	calculateDebitTotal() {
		this.totalDebit = 0;
		for (let i = 0; i < this.voucherFormGroupArray.length; i++) {
			this.totalDebit = this.totalDebit + Number(this.voucherFormGroupArray[i].value.vc_debit);
		}

	}
	getColor(i) {
		var color = "#fe756d";
		if (this.voucherFormGroupArray[i].value.vc_credit && this.voucherFormGroupArray[i].value.vc_debit) {
			return color;
		} else {
			return '';
		}
	}
	oneValueDebitOrCredit(i) {
		if (this.voucherFormGroupArray[i].value.vc_credit && this.voucherFormGroupArray[i].value.vc_debit) {
			this.commonAPIService.showSuccessErrorMessage('Error Plese fill eiher credit or debit', 'error');
		}
	}

	calculateCreditTotal() {
		this.totalCredit = 0;
		for (let i = 0; i < this.voucherFormGroupArray.length; i++) {
			this.totalCredit = this.totalCredit + Number(this.voucherFormGroupArray[i].value.vc_credit);
		}
	}

	getVcName() {
		let vcType = '';
		let currentVcTypeTemp = this.currentVcType+' '+this.suffix;
		//const vcTypeArr = this.currentVcType.split(" ");
		const vcTypeArr = currentVcTypeTemp.split(" ");
		if (vcTypeArr.length > 0) {
			vcTypeArr.forEach(element => {
				vcType += element.substring(0, 1).toUpperCase();
			});
		}
		//vcType = (this.currentVcType.split(" ")[0].substring(0,1)+this.currentVcType.split(" ")[1].substring(0,1)).toUpperCase();
		let tempDate: any;
		if (!moment.isMoment(this.voucherForm.value.vc_date)) {
			tempDate = moment(this.voucherForm.value.vc_date);
		} else {
			tempDate = this.voucherForm.value.vc_date;
		}

		console.log('tempDate', tempDate);

		let vcDay = tempDate.format('DD')
		let vcMonth = tempDate.format('MMM');
		let vcYear = tempDate.format('YYYY');
		let vcNumber = this.voucherForm.value.vc_number;
		return this.vcYearlyStatus ? vcType + '/' + ((vcNumber.toString()).padStart(4, '0')) : vcType + '/' + vcMonth + '/' + ((vcNumber.toString()).padStart(4, '0'));


	}
	setDate() {
		console.log('imgArray--', this.voucherForm.value.vc_date);

	}
	listVoucherRoute() {
		this.router.navigate(['../../transaction-master/daybook'], { queryParams: { tab: 3 }, relativeTo: this.route });
	}
	getuploadurl(fileurl: string) {
		const filetype = fileurl.substr(fileurl.lastIndexOf('.') + 1);
		if (filetype === 'pdf') {
			return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-pdf.png';
		} else if (filetype === 'doc' || filetype === 'docx') {
			return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-word.png';
		} else {
			return fileurl;
		}
	}
	getSattleJV(i) {
		if (this.voucherFormGroupArray[i].value.vc_account_type_id) {
			if (this.currentVcType == 'Bank Payment' || this.currentVcType == 'Cash Payment' || this.currentVcType == 'Credit Note' || this.currentVcType == 'Debit Note') {
				console.log('index', i);
				const inputJson: any = {};
				inputJson.vc_type = 'Journal Voucher';
				inputJson.vc_sattle_status = 1;
				inputJson.vc_state = 'publish';
				inputJson.coa_id = this.voucherFormGroupArray[i].value.vc_account_type_id;
				const dialogRef3 = this.dialog.open(VoucherRefModalComponent, {
					data: {
						title: 'Add Ref',
						param: inputJson,
						refData: this.refData
					},
					height: '70vh',
					width: '70vh'
				});
				dialogRef3.afterClosed().subscribe((result: any) => {
					if (result) {
						console.log(result);
						if (result) {
							this.voucherFormGroupArray[i].patchValue({
								vc_invoiceno: result.selection,
								vc_grno: result.currentTabIndex,
								vc_debit: result.amount,
								selected: result.selected
							});
							this.calculateDebitTotal();
						}
						this.refData = result
					}
				});
			}
		}

	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}

	getGlobalSetting() {
		let param: any = {};
		param.gs_alias = ['fa_voucher_code_format_yearly_status'];
		this.faService.getGlobalSetting(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (result.data && result.data[0]) {
					this.vcYearlyStatus = Number(result.data[0]['gs_value']);
					console.log('this.vcYearlyStatus', this.vcYearlyStatus)
				}

			}
		})
	}
}
