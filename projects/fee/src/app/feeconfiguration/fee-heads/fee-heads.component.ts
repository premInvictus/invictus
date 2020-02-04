import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FHModel } from './fee-heads.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FeeService, SisService, CommonAPIService } from '../../_services';
import { DecimalPipe } from '@angular/common';

@Component({
	selector: 'app-fee-heads',
	templateUrl: './fee-heads.component.html',
	styleUrls: ['./fee-heads.component.scss']
})



export class FeeHeadsComponent implements OnInit, AfterViewInit {

	@ViewChild('deleteModal') deleteModal;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('paginator') paginator: MatPaginator;
	ELEMENT_DATA: FHModel[] = [];
	displayedColumns: string[] = ['srno', 'feehead', 'feetype', 'class', 'calculate', 'period', 'date', 'status', 'action'];
	dataSource = new MatTableDataSource(this.ELEMENT_DATA);

	// member declaration
	feeheadform: FormGroup;
	feetypeArray: any[] = [];
	feeperiodArray: any[] = [];
	feemonthArray: any[] = [];
	feeotherArray: any[] = [];
	feeheadArray: any[] = [];
	calculationmethodArray: any[] = [];
	concessionruleArray: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	genderArray: any[] = [];
	updateFlag = false;
	fh_is_hostel_fee = 0;
	amountDetailArray: any[] = [];
	formGroupArray: any[] = [];
	newAmtDetails: any[] = [];
	constructor(
		private fb: FormBuilder,
		private feeService: FeeService,
		private sisService: SisService,
		private commonAPIService: CommonAPIService
	) { }
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	ngOnInit() {
		this.buildForm();
		this.getCalculationMethods();
		this.getConcessionCategory();
		this.getFeeHeads();
		this.getFeeMonths();
		this.getFeePeriods();
		this.getFeeOthers();
		this.getFeeTypes();
		this.getClass();
		this.getSectionAll();
		this.getGender();
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	buildForm() {
		this.feeheadform = this.fb.group({
			fh_id: '',
			fh_name: '',
			fh_ft_id: '',
			fh_fp_id: '',
			fh_fm_id: '',
			fh_class_id: '',
			fh_calm_id: '',
			fh_amount: '',
			fh_gen_id: '',
			fh_fo_id: '',
			fh_transport: '',
			fh_class_amount_detail: '',
			fh_hostel: '',
			fh_fcc_id: '',
			fh_status: ''

		});
	}
	getFeeTypes() {
		this.feetypeArray = [];
		this.feeService.getFeeTypes({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feetypeArray = result.data;
			}
		});
	}
	getFeeMonths() {
		this.feemonthArray = [];
		this.feeService.getFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feemonthArray = result.data;
			}
		});
	}
	getFeeOthers() {
		this.feeotherArray = [];
		this.feeService.getFeeOthers({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeotherArray = result.data;
			}
		});
	}
	getFeePeriods() {
		this.feeperiodArray = [];
		this.feeService.getFeePeriods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeperiodArray = result.data;
			}
		});
	}
	getCalculationMethods() {
		this.calculationmethodArray = [];
		this.feeService.getCalculationMethods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.calculationmethodArray = result.data;
			}
		});
	}
	getConcessionCategory() {
		this.concessionruleArray = [];
		this.feeService.getConcessionCategory({ fcc_is_hostel_fee: this.fh_is_hostel_fee }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.concessionruleArray = result.data;
			}
		});
	}
	getFeeHeads() {
		this.feeheadArray = [];
		this.feeService.getFeeHeads({ fh_is_hostel_fee: this.fh_is_hostel_fee }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeheadArray = result.data;
				this.ELEMENT_DATA = [];
				let srno = 0;
				if (this.feeheadArray.length > 0) {

					this.feeheadArray.forEach(item => {
						const pushitem: any = {};
						let class_name = '';
						if (item.fh_class_amount_detail && item.fh_class_amount_detail.length > 0) {
							for (const cname of item.fh_class_amount_detail) {
								class_name = class_name + 'Class' + cname.class_name + ':' +
								new DecimalPipe('en-us').transform(cname.head_amt) +  ' ,';
							}
							class_name = class_name.substring(0, class_name.length - 2);
						}
						pushitem.srno = ++srno;
						pushitem.feehead = item.fh_name;
						pushitem.feetype = item.ft_name;
						pushitem.class = class_name;
						pushitem.calculate = item.calm_name;
						pushitem.period = item.fp_name;
						pushitem.date = item.fh_created_date;
						pushitem.status = item.fh_status === '1' ? true : false;
						pushitem.action = item;
						this.ELEMENT_DATA.push(pushitem);
					});
					this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.dataSource.sort = this.sort;
				}
			}
			this.resetForm();
		});
	}
	getClass() {
		this.classArray = [];
		this.commonAPIService.getClassData({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSectionAll() {
		this.sectionArray = [];
		this.sisService.getSectionAll().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	getGender() {
		this.genderArray = [];
		this.sisService.getGender().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.genderArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	editFeehead(value) {
		this.updateFlag = true;
		this.setFeehead(value);
	}
	setFeehead(value) {
		this.newAmtDetails = [];
		const classArray: any = [];
		this.formGroupArray = [];
		if (value.fh_class_amount_detail) {
			for (const item of value.fh_class_amount_detail) {
				this.formGroupArray.push({
					class_id: item.class_id,
					class_name: item.class_name,
					formGroup: this.fb.group({
						'head_amt': item.head_amt
					})
				});
				classArray.push(item.class_id);
			}
			this.newAmtDetails = value.fh_class_amount_detail;
		}
		this.feeheadform.patchValue({
			fh_id: value.fh_id,
			fh_name: value.fh_name,
			fh_ft_id: value.fh_ft_id,
			fh_fp_id: value.fh_fp_id,
			fh_fm_id: value.fh_fm_id,
			fh_class_id: classArray,
			fh_calm_id: value.fh_calm_id,
			fh_amount: value.fh_amount,
			fh_gen_id: value.fh_gen_id,
			fh_fo_id: value.fh_fo_id,
			fh_transport: value.fh_transport,
			fh_hostel: value.fh_hostel,
			fh_fcc_id: value.fh_fcc_id,
			fh_status: value.fh_status

		});
	}

	saveForm() {
		let validateFlag = true;
		this.amountDetailArray = [];
		if (this.formGroupArray.length > 0) {
			for (const item of this.formGroupArray) {
				if (item.formGroup.value.head_amt !== '') {
					validateFlag = true;
					this.amountDetailArray.push({
						class_id: item.class_id,
						class_name: item.class_name,
						head_amt: item.formGroup.value.head_amt
					});
				} else {
					validateFlag = false;
					item.formGroup.controls['head_amt'].markAsDirty();
					break;
				}
			}
		}
		if (this.feeheadform.valid && validateFlag) {
			let apiactionname = '';
			if (this.feeheadform.value.fh_id === '') {
				apiactionname = 'insertFeeHeads';
			} else {
				apiactionname = 'updateFeeHeads';
				this.updateFlag = false;
			}
			this.feeheadform.value['fh_is_hostel_fee'] = this.fh_is_hostel_fee;
			this.feeheadform.value['fh_class_amount_detail'] = this.amountDetailArray;
			this.feeService[apiactionname](this.feeheadform.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.getFeeHeads();
					this.resetForm();
					this.amountDetailArray = [];
					this.formGroupArray = [];
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	deleteConfirm(value, status = '5') {
		if (value) {
			value.fh_status = status;
		}
		this.feeService.deleteFeeHeads(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getFeeHeads();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	toggleFeeHeadStatus($event, value: any) {
		if ($event.checked) {
			this.deleteConfirm(value, '1');
		} else {
			this.deleteConfirm(value, '0');
		}
	}
	cancelForm() {
		this.updateFlag = false;
		this.resetForm();
		this.formGroupArray = [];
		this.amountDetailArray = [];
	}
	resetForm() {
		this.feeheadform.patchValue({
			fh_id: '',
			fh_name: '',
			fh_ft_id: '',
			fh_fp_id: '',
			fh_fm_id: '',
			fh_class_id: '',
			fh_calm_id: '',
			fh_amount: '',
			fh_gen_id: '',
			fh_fo_id: '',
			fh_transport: '',
			fh_class_amount_detail: '',
			fh_hostel: '',
			fh_fcc_id: '',
			fh_status: ''

		});
	}

	changeIsHostelFee(event) {
		if (event.checked) {
			this.fh_is_hostel_fee = 1;
		} else {
			this.fh_is_hostel_fee = 0;
		}
		this.getFeeHeads();
	}
	getClassAmount($event) {
		let classArray: any[] = [];
		this.formGroupArray = [];
		classArray = $event.value;
		if (this.newAmtDetails.length === 0) {
			for (const titem of classArray) {
				const findex = this.formGroupArray.findIndex(f => Number(f.class_id) === Number(titem));
				if (findex === -1) {
					this.formGroupArray.push({
						class_id: titem,
						class_name: this.getClassName(titem),
						formGroup: this.fb.group({
							'head_amt': ''
						})
					});
				}
			}
		} else {
			for (const item of this.newAmtDetails) {
				for (const titem of classArray) {
					const findex = this.formGroupArray.findIndex(f => Number(f.class_id) === Number(titem));
					const findex2 = this.newAmtDetails.findIndex(f => Number(f.class_id) === Number(titem));
					if (findex === -1 && Number(titem) === Number(item.class_id)
						&& findex2 !== -1) {
						this.formGroupArray.push({
							class_id: titem,
							class_name: this.getClassName(titem),
							formGroup: this.fb.group({
								'head_amt': item.head_amt
							})
						});
					}
					if (findex === -1 && findex2 === -1) {
						this.formGroupArray.push({
							class_id: titem,
							class_name: this.getClassName(titem),
							formGroup: this.fb.group({
								'head_amt': ''
							})
						});
					}
				}
			}
		}
	}
	getClassName(class_id) {
		const findex = this.classArray.findIndex(f => Number(f.class_id) === Number(class_id));
		if (findex !== -1) {
			return this.classArray[findex].class_name;
		}
	}

}
