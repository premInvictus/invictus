import { Component, OnInit, EventEmitter, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InvoiceDetails } from './invoice-details.model';
import { FeeService, CommonAPIService, ProcesstypeFeeService } from '../../_services/index';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { saveAs } from 'file-saver';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { parse } from 'querystring';
@Component({
	selector: 'app-invoice-details-modal',
	templateUrl: './invoice-details-modal.component.html',
	styleUrls: ['./invoice-details-modal.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class InvoiceDetailsModalComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('recalculateModal') recalculateModal;
	@ViewChild('editReference') editReference;
	ELEMENT_DATA: InvoiceDetails[] = [];
	DETAIL_ELEMENT_DATA: InvoiceDetails[] = [];
	ajustmentarray: any[] = [];
	displayedColumns: string[] = ['srno', 'feehead', 'feedue', 'concession', 'adjustment', 'netpay'];
	displayedColumns2: string[] = ['feemonth', 'value'];
	dataSource = new MatTableDataSource<InvoiceDetails>(this.ELEMENT_DATA);
	detaildataSource = new MatTableDataSource<InvoiceDetails>(this.DETAIL_ELEMENT_DATA);
	adjsource = new MatTableDataSource<any>(this.ajustmentarray);
	selection = new SelectionModel<InvoiceDetails>(true, []);
	invoiceBifurcationArray: any[] = [];
	invoiceDetails: any;
	invoiceBifurcationArray2: any[] = [];
	feePeriodArray: any[] = [];
	invoiceTotal = 0;
	adjustmentForm: FormGroup;
	modifyInvoiceForm: FormGroup;
	modificationFlag = false;
	adjRemark: string;
	checkChangedFieldsArray = [];
	class_name: any;
	section_name: any;
	class_sec: any;
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
	gender: any;
	inv_opening_balance: any;
	inv_fine_amount: any;
	selectedRowItem: any[] = [];
	showDetailRows = false;
	readonlyadjustment = false;
	showconcesstable = false;
	currentadj:any;

	constructor(
		public dialogRef: MatDialogRef<InvoiceDetailsModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private feeService: FeeService,
		private studentRouteStoreService: StudentRouteMoveStoreService,
		public processtypeService: ProcesstypeFeeService,
		private fb: FormBuilder,
		public commonAPIService: CommonAPIService,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	ngOnInit() {
		console.log('this.data', this.data);
		if (this.data.edit) {
			this.modificationFlag = true;
		} else {
			this.modificationFlag = false;
		}
		this.getInvoiceBifurcation(this.data);
		this.buildForm();
	}

	toggleDatePicker(picker) {
		picker.open();
	}

	openEditDialog = (data) => this.editReference.openModal(data);
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	openRecalculateDialog = (data) => this.recalculateModal.openModal(data);
	buildForm() {
		this.modifyInvoiceForm = this.fb.group({
			'inv_opening_balance': '',
			'inv_fine_amount': '',
			'inv_invoice_date': '',
			'inv_due_date': ''
		});
		this.adjustmentForm = this.fb.group({
			adjustmentField: this.fb.array([])
		});
	}
	closemodal(status = '1'): void {
		this.dialogRef.close({ status: status });
	}
	// modifyInvoice() {
	// 	this.modificationFlag = true;
	// 	this.checkChangedFieldsArray = [];
	// }
	changeDate(event) {
		console.log(event.target.value);
		this.checkChangedFieldsArray.push({
			rff_where_id: 'inv_id',
			rff_where_value: this.invoiceDetails.inv_id,
			rff_field_name: 'inv_invoice_date',
			rff_new_field_value: this.commonAPIService.dateConvertion(event.target.value, 'yyyy-MM-dd'),
			rff_old_field_value: this.invoiceDetails.inv_invoice_date,
			rff_custom_data: '',
		});
	}
	changeDueDate(event) {
		console.log(event.target.value);
		this.checkChangedFieldsArray.push({
			rff_where_id: 'inv_id',
			rff_where_value: this.invoiceDetails.inv_id,
			rff_field_name: 'inv_due_date',
			rff_new_field_value: this.commonAPIService.dateConvertion(event.target.value, 'yyyy-MM-dd'),
			rff_old_field_value: this.invoiceDetails.inv_due_date,
			rff_custom_data: '',
		});
	}
	changeAdjAmt(invg_id, $event) {
		const invg_id_idx = this.invoiceBifurcationArray.findIndex(item => item.invg_id === invg_id);
		if ($event.target.value) {
			this.checkChangedFieldsArray.push({
				rff_where_id: 'invg_id',
				rff_where_value: invg_id,
				rff_field_name: 'invg_adj_amount',
				rff_new_field_value: $event.target.value,
				rff_old_field_value: this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount,
				rff_custom_data: this.invoiceBifurcationArray[invg_id_idx].invg_fh_name,
			});
			this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount = $event.target.value;
		}
		this.invoiceDetialsTable(this.invoiceBifurcationArray);
	}
	changeOpeningAndFine(item, $event) {
		if (item.feehead === 'Fine & Penalties') {
			this.checkChangedFieldsArray.push({
				rff_where_id: 'inv_id',
				rff_where_value: this.invoiceDetails.inv_id,
				rff_field_name: 'inv_fine_amount',
				rff_new_field_value: $event.target.value,
				rff_old_field_value: this.modifyInvoiceForm.value.inv_fine_amount,
				rff_custom_data: '',
			});
			this.modifyInvoiceForm.patchValue({
				inv_fine_amount: $event.target.value
			});
			this.invoiceDetails.inv_fine_amount = $event.target.value;

		} else if (item.feehead === 'Previous Balance') {
			this.modifyInvoiceForm.patchValue({
				inv_opening_balance: $event.target.value
			});
			this.invoiceDetails.balance_amt = $event.target.value;
		}
		this.invoiceDetialsTable(this.invoiceBifurcationArray);
	}
	recalculateInvoice(event) {
		this.feeService.insertInvoice({ recalculation_flag: '1', inv_id: [this.invoiceDetails.inv_id], inv_activity: 'invoice' })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getInvoiceBifurcation(this.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	cancelInvoice() {
		if (this.data.edit) {
			this.modificationFlag = true;
			this.adjRemark = '';
			this.modifyInvoiceForm.patchValue({
				'inv_opening_balance': this.invoiceDetails.balance_amt,
				'inv_fine_amount': this.invoiceDetails.inv_fine_amount,
				'inv_invoice_date': this.invoiceDetails.inv_invoice_date,
				'inv_due_date': this.invoiceDetails.inv_due_date,
			});
		}
		this.getInvoiceBifurcation(this.invoiceDetails.inv_id);
	}
	updateInvoice() {
		let obcheck:any[] = [];
		const adj: any = { inv_id: '', adjustment: [], remark: '', login_id: this.invoiceDetails.login_id };
		adj.inv_id = this.invoiceDetails.inv_id;
		this.invoiceBifurcationArray.forEach(item => {
			adj.adjustment.push({ invg_id: item.invg_id, invg_adj_amount: item.invg_adj_amount });
		});
		this.invoiceBifurcationArray2.forEach(item2 => {
			const adj2: any = { inv_id: item2.inv_id, adjustment: [], remark: '', login_id: this.invoiceDetails.login_id };
			item2.bifurcation.forEach(item => {
				adj2.adjustment.push({ invg_id: item.invg_id, invg_adj_amount: item.adjustment });
			});
			obcheck.push(adj2);
		})
		adj.remark = this.adjRemark;
		adj.inv_fine_amount = this.modifyInvoiceForm.value.inv_fine_amount;
		adj.inv_opening_balance = this.modifyInvoiceForm.value.inv_opening_balance;
		adj.inv_invoice_date = new DatePipe('en-in').transform(this.modifyInvoiceForm.value.inv_invoice_date, 'yyyy-MM-dd');
		adj.inv_due_date = new DatePipe('en-in').transform(this.modifyInvoiceForm.value.inv_due_date, 'yyyy-MM-dd');
		console.log('menus', this.commonAPIService.menus);
		// this.commonAPIService.isExistUserAccessMenu('358') Bulk Update
		// this.commonAPIService.isExistUserAccessMenu('365') Individual Update
		console.log('adj--', adj);
		if ((this.commonAPIService.isExistUserAccessMenu('358') || this.commonAPIService.isExistUserAccessMenu('365')) && this.adjRemark) {
			this.feeService.invoiceAdjustmentRemark(adj).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.closemodal();
				}
			});
			this.feeService.invoiceAdjustmentRemarkForConsolidatedAdjustment(obcheck).subscribe((res:any) => {
				if (res && res.status === 'ok') {
					// this.commonAPIService.showSuccessErrorMessage(res.message, 'success');
					// this.closemodal();
				}
			})
		} else if (this.commonAPIService.isExistUserAccessMenu('432')) {  // when both are unchecked 
			const param: any = {};
			const params: any[] = [];
			const datalist: any[] = [];
			if (!this.adjRemark) {
				this.commonAPIService.showSuccessErrorMessage('Please enter remarks', 'error');
			}
			if (this.checkChangedFieldsArray.length > 0 && this.adjRemark) {
				param.req_login_id = this.invoiceDetails.login_id ? this.invoiceDetails.login_id : '';
				param.req_process_type = '4';
				param.req_tab_id = '18';
				param.req_priority = '';
				param.req_remarks = '';
				param.req_reason = '';
				param.req_param = [];
				param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
				param.req_custom_data = JSON.stringify({
					belongsTo: 'invoice',
					belongsToFieldId: 'inv_id',
					belongsToFieldValue: this.invoiceDetails.inv_id,
					belongsToFieldAlias: 'inv_invoice_no',
					belongsToFieldAliasValue: this.invoiceDetails.inv_invoice_no
				});
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
				this.openEditDialog({ data: datalist, reqParam: params });
				console.log(datalist);
			} else {
				this.commonAPIService.showSuccessErrorMessage('No changes to update', 'error');
			}
		} else {
			this.commonAPIService.showSuccessErrorMessage('No right to update', 'error');
		}
	}
	deleteInvoice(event) {
		this.feeService.deleteInvoice({ inv_id: [this.invoiceDetails.inv_id] })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getInvoiceBifurcation(this.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	invoiceDetialsTable(arr) {
		console.log('modificationFlag-->', this.modificationFlag);
		this.ELEMENT_DATA = [];
		this.invoiceTotal = 0;
		let i = 0;
		if (this.invoiceDetails.balance_amt && Number(this.invoiceDetails.balance_amt) !== 0) {
			const element = {
				srno: ++i,
				feehead: 'Previous Balance',
				feedue: Number(this.invoiceDetails.balance_amt),
				concession: 0,
				adjustment: 0,
				netpay: Number(this.invoiceDetails.balance_amt),
				invg_id: ''
			};
			this.invoiceTotal += element.netpay;
			this.ELEMENT_DATA.push(element);
		}
		arr.forEach(item => {
			const element = {
				srno: ++i,
				feehead: item.group_detail ? '-' : item.invg_fh_name,
				fs_name: item.fs_name ? item.fs_name : '',
				feedue: Number(item.invg_fh_amount),
				concession: Number(item.invg_fcc_amount),
				adjustment: Number(item.invg_adj_amount),
				netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
				invg_id: item.invg_id,
				grouped_data: item.group_detail ? true : false,
				action: item
			};


			this.invoiceTotal += element.netpay;
			console.log('item', item);
			console.log('this.invoiceTotal', this.invoiceTotal);
			this.ELEMENT_DATA.push(element);
		});
		// this.invoiceDetails.inv_fine_amount && Number(this.invoiceDetails.inv_fine_amount > 0
		if (true) {
			const element = {
				srno: ++i,
				feehead: 'Fine & Penalties',
				feedue: Number(this.invoiceDetails.inv_fine_amount),
				concession: 0,
				adjustment: 0,
				netpay: Number(this.invoiceDetails.inv_fine_amount),
				invg_id: ''
			};
			this.invoiceTotal += element.netpay;

			this.ELEMENT_DATA.push(element);
		}
		this.dataSource = new MatTableDataSource<InvoiceDetails>(this.ELEMENT_DATA);
	}


	getInvoiceBifurcation(data: any) {
		this.invoiceBifurcationArray = [];
		console.log('this.modificationFlag', this.modificationFlag);
		if (this.modificationFlag) {
			this.callgetInvoiceBifurcationAPI(data);
		} else {
			let param: any = {};
			param.gs_name = ['show_grouped_head_invoice_bifurcation'];
			this.feeService.getGlobalSetting(param).subscribe((result: any) => {
				if (result && result.status === 'ok' && result.data) {
					if (result.data[0]['gs_value'] == '1') {
						this.getInvoiceGroupBifurcation(data);
					} else {
						this.callgetInvoiceBifurcationAPI(data);
					}

				} else {
					this.callgetInvoiceBifurcationAPI(data);
				}
			});
		}
	}


	callgetInvoiceBifurcationAPI(data) {
		if (this.data.invoiceNo) {
			this.feeService.getInvoiceBifurcation({ inv_id: this.data.invoiceNo, 'no_partial': true, fromModel: true }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						this.invoiceDetails = result.data[0];
						console.log("i am here--------------", result.data[0].fp_months[0].includes("-"));
						
						if (result.data[0].fp_months.length > 1 || result.data[0].fp_months[0].includes("-")) {
							this.readonlyadjustment = true;
							this.feePeriodArray = result.data[0].fp_months;

							this.feeService.getConcessionInvoiceBifurcation({ inv_id: result.data[0].inv_id }).subscribe((res: any) => {
								if (res && res.status == 'ok' && res.data.length > 0) {
									res.data.forEach(ele => {
										let i = 0;
										let obj: any = {};
										obj.fp_id = ele.fp_months[0];
										obj.inv_id = ele.inv_id;
										obj.bifurcation = [];
										if (ele.balance_amt && Number(ele.balance_amt) !== 0) {
											const element = {
												srno: ++i,
												feehead: 'Previous Balance',
												feedue: Number(ele.balance_amt),
												concession: 0,
												adjustment: 0,
												netpay: Number(ele.balance_amt),
												invg_id: ''
											};
											// this.invoiceTotal += element.netpay;
											obj.bifurcation.push(element);
										}
										ele.invoice_bifurcation.forEach(item => {
											const element = {
												srno: ++i,
												feehead: item.group_detail ? '-' : item.invg_fh_name,
												fs_name: item.fs_name ? item.fs_name : '',
												feedue: Number(item.invg_fh_amount),
												concession: Number(item.invg_fcc_amount),
												adjustment: Number(item.invg_adj_amount),
												netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
												invg_id: item.invg_id,
												grouped_data: item.group_detail ? true : false,
												action: item
											};


											// this.invoiceTotal += element.netpay;
											// console.log('item', item);
											// console.log('this.invoiceTotal', this.invoiceTotal);
											obj.bifurcation.push(element);
										});
										// this.invoiceDetails.inv_fine_amount && Number(this.invoiceDetails.inv_fine_amount > 0
										if (true) {
											const element = {
												srno: ++i,
												feehead: 'Fine & Penalties',
												feedue: Number(ele.inv_fine_amount),
												concession: 0,
												adjustment: 0,
												netpay: Number(ele.inv_fine_amount),
												invg_id: '',
												inv_id: ele.inv_id
											};
											obj.bifurcation.push(element);
										}
										this.invoiceBifurcationArray2.push(obj);
									});
									console.log(this.invoiceBifurcationArray2, "++++++++++++++++++++++++");
								}

							})
						}
						
						
						// this.inv_opening_balance = this.invoiceDetails.inv_opening_balance;
						// this.inv_fine_amount = this.invoiceDetails.inv_fine_amount;
						this.modifyInvoiceForm.patchValue({
							'inv_opening_balance': this.invoiceDetails.balance_amt,
							'inv_fine_amount': this.invoiceDetails.inv_fine_amount,
							'inv_invoice_date': this.invoiceDetails.inv_invoice_date,
							'inv_due_date': this.invoiceDetails.inv_due_date,
						});

						this.class_name = this.invoiceDetails.class_name;
						this.section_name = this.invoiceDetails.sec_name;
						if (this.section_name !== '') {
							this.class_sec = this.class_name + ' - ' + this.section_name;
						} else {
							this.class_sec = this.class_name;
						}
						this.gender = this.invoiceDetails.au_gender;
						if (this.gender === 'M') {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
						} else if (this.gender === 'F') {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
						} else {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
						}
						if (this.invoiceDetails.invoice_bifurcation.length > 0) {
							this.invoiceBifurcationArray = this.invoiceDetails.invoice_bifurcation;
							this.invoiceDetialsTable(this.invoiceDetails.invoice_bifurcation);
						}
						this.adjustmentForm.patchValue({
							au_profileimage: this.invoiceDetails.au_profileimage
								? this.invoiceDetails.au_profileimage
								: this.defaultsrc,
						});
						this.defaultsrc =
							this.invoiceDetails.au_profileimage !== ''
								? this.invoiceDetails.au_profileimage
								: this.defaultsrc;

					}
				} else {

					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.closemodal();
				}
			});
		} else if (this.data.inv_invoice_no) {
			this.feeService.getInvoiceBifurcation({ inv_invoice_no: this.data.inv_invoice_no, fromModel: true }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						this.invoiceDetails = result.data[0];
						// inv_opening_balance = this.invoiceDetails.inv_opening_balance;
						// this.inv_fine_amount = this.invoiceDetails.inv_fine_amount;
						this.modifyInvoiceForm.patchValue({
							'inv_opening_balance': this.invoiceDetails.balance_amt,
							'inv_fine_amount': this.invoiceDetails.inv_fine_amount,
							'inv_invoice_date': this.invoiceDetails.inv_invoice_date,
							'inv_due_date': this.invoiceDetails.inv_due_date,
						});
						if (this.invoiceDetails.invoice_bifurcation.length > 0) {
							this.invoiceBifurcationArray = this.invoiceDetails.invoice_bifurcation;
							this.invoiceDetialsTable(this.invoiceDetails.invoice_bifurcation);
						}

					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.closemodal();
				}
			});
		}
	}

	getInvoiceGroupBifurcation(data: any) {
		if (this.data.invoiceNo) {
			this.feeService.getInvoiceGroupBifurcation({ inv_id: this.data.invoiceNo, 'no_partial': true, fromModel: true }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						this.invoiceDetails = result.data[0];
						// this.inv_opening_balance = this.invoiceDetails.inv_opening_balance;
						// this.inv_fine_amount = this.invoiceDetails.inv_fine_amount;
						this.modifyInvoiceForm.patchValue({
							'inv_opening_balance': this.invoiceDetails.balance_amt,
							'inv_fine_amount': this.invoiceDetails.inv_fine_amount,
							'inv_invoice_date': this.invoiceDetails.inv_invoice_date,
							'inv_due_date': this.invoiceDetails.inv_due_date,
						});

						this.class_name = this.invoiceDetails.class_name;
						this.section_name = this.invoiceDetails.sec_name;
						if (this.section_name !== '') {
							this.class_sec = this.class_name + ' - ' + this.section_name;
						} else {
							this.class_sec = this.class_name;
						}
						this.gender = this.invoiceDetails.au_gender;
						if (this.gender === 'M') {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
						} else if (this.gender === 'F') {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
						} else {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
						}
						if (this.invoiceDetails.invoice_bifurcation.length > 0) {
							this.invoiceBifurcationArray = this.invoiceDetails.invoice_bifurcation;
							this.invoiceDetialsTable(this.invoiceDetails.invoice_bifurcation);
						}
						this.adjustmentForm.patchValue({
							au_profileimage: this.invoiceDetails.au_profileimage
								? this.invoiceDetails.au_profileimage
								: this.defaultsrc,
						});
						this.defaultsrc =
							this.invoiceDetails.au_profileimage !== ''
								? this.invoiceDetails.au_profileimage
								: this.defaultsrc;

					}
				} else {

					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.closemodal();
				}
			});
		} else if (this.data.inv_invoice_no) {
			this.feeService.getInvoiceGroupBifurcation({ inv_invoice_no: this.data.inv_invoice_no, fromModel: true }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						this.invoiceDetails = result.data[0];
						// inv_opening_balance = this.invoiceDetails.inv_opening_balance;
						// this.inv_fine_amount = this.invoiceDetails.inv_fine_amount;
						this.modifyInvoiceForm.patchValue({
							'inv_opening_balance': this.invoiceDetails.balance_amt,
							'inv_fine_amount': this.invoiceDetails.inv_fine_amount,
							'inv_invoice_date': this.invoiceDetails.inv_invoice_date,
							'inv_due_date': this.invoiceDetails.inv_due_date,
						});
						if (this.invoiceDetails.invoice_bifurcation.length > 0) {
							this.invoiceBifurcationArray = this.invoiceDetails.invoice_bifurcation;
							this.invoiceDetialsTable(this.invoiceDetails.invoice_bifurcation);
						}

					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.closemodal();
				}
			});
		}
	}

	printInvoice() {
		this.feeService.printInvoice({ inv_id: [this.invoiceDetails.inv_id] }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
				window.open(result.data, '_blank');
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}
	editConfirm() { }
	makePayment(invoiceDetails) {
		if (invoiceDetails.inv_id) {
			this.studentRouteStoreService.setProcessRouteType(
				invoiceDetails.inv_process_type
			);
			this.processtypeService.setProcesstype(invoiceDetails.inv_process_type);
			this.studentRouteStoreService.setInvoiceId(invoiceDetails);
			this.closemodal();
			this.router.navigate(['fees/school/feemaster/fee-transaction-entry-individual']);
		}
	}

	showStructureDetail(element) {
		console.log(element);
		this.DETAIL_ELEMENT_DATA = [];
		this.selectedRowItem = element.action.group_detail;
		var i = 0;
		this.selectedRowItem.forEach(item => {
			const element = {
				srno: ++i,
				feehead: item.group_detail ? '-' : item.invg_fh_name,
				fs_name: item.fs_name ? item.fs_name : '',
				feedue: Number(item.invg_fh_amount),
				concession: Number(item.invg_fcc_amount),
				adjustment: Number(item.invg_adj_amount),
				netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
				invg_id: item.invg_id,
				grouped_data: item.group_detail ? true : false,
				action: item
			};


			// this.invoiceTotal += element.netpay;
			console.log('item', item);
			console.log('this.invoiceTotal', this.invoiceTotal);
			this.DETAIL_ELEMENT_DATA.push(element);
		});
		this.detaildataSource = new MatTableDataSource<InvoiceDetails>(this.DETAIL_ELEMENT_DATA);
		console.log('this.detaildatasource', this.detaildataSource);
		// this.detaildataSource = element.action.group_detail
	}

	checkstatusofadj(data) {
		console.log("i am data", data);
		
		this.currentadj = data;
		this.ajustmentarray = [];
		this.adjsource = new MatTableDataSource<any>(this.ajustmentarray);

		this.showconcesstable = true;
		this.invoiceBifurcationArray2.forEach((el: any) => {
			let obj: any = {};
			obj.fp_id = el.fp_id;
			el.bifurcation.forEach(element => {
				if (data.feehead === element.feehead) {
					obj.feed = element;
				}
			});
			if (obj.feed) {
				this.ajustmentarray.push(obj)
			}
		});
		this.adjsource = new MatTableDataSource<any>(this.ajustmentarray);

		console.log("i am here===================================", this.ajustmentarray, this.invoiceBifurcationArray2);


	}

	changeAdjAmt2(adj_val, fp_id,invg_id, $event) {
		console.log("i am here", adj_val);
		
		const invg_id_idx = this.invoiceBifurcationArray.findIndex(item => item.invg_id === this.currentadj.invg_id);
		if ($event.target.value) {
			this.checkChangedFieldsArray.push({
				rff_where_id: 'invg_id',
				rff_where_value: this.currentadj.invg_id,
				rff_field_name: 'invg_adj_amount',
				rff_new_field_value: parseInt(this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount) + parseInt($event.target.value),
				rff_old_field_value: this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount,
				rff_custom_data: this.invoiceBifurcationArray[invg_id_idx].invg_fh_name,
			});
			this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount = parseInt(this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount) + parseInt($event.target.value) - parseInt(adj_val);
		}
		let a = 0;
		this.invoiceBifurcationArray2.map((el:any) => {
			
			if(el.fp_id === fp_id) {
				const invg_id_idx = el.bifurcation.findIndex(item => item.invg_id === invg_id);
				if(this.invoiceBifurcationArray2[a].bifurcation[invg_id_idx]) {
					this.invoiceBifurcationArray2[a].bifurcation[invg_id_idx].adjustment = parseInt($event.target.value);
				}
				
			}
			a+=1;
		});
		
		this.invoiceDetialsTable(this.invoiceBifurcationArray);

	}
}
