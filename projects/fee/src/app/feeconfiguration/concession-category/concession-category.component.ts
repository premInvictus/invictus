import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, ErrorStateMatcher, MatSort, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { ConCatElement } from '../concession-category/concession-category.model';
import { FeeService, SisService, CommonAPIService } from '../../_services/index';
import { ConfirmValidParentMatcher } from '../../_validationclass/confirmValidParentMatcher.class';
@Component({
	selector: 'app-concession-category',
	templateUrl: './concession-category.component.html',
	styleUrls: ['./concession-category.component.scss']
})

export class ConcessionCategoryComponent implements OnInit, AfterViewInit {

	displayedColumns: string[] = ['position', 'category', 'head', 'class', 'type', 'amount', 'status', 'action'];
	CONCESSION_ELEMENT_DATA: ConCatElement[] = [];
	dataSource = new MatTableDataSource(this.CONCESSION_ELEMENT_DATA);
	conccesionCategoryForm: FormGroup;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('deleteModal') deleteModal;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	feeheadArray: any[] = [];
	ruleArray: any[] = [];
	classArray: any[] = [];
	classDataArray: any[] = [];
	amountPlaceHolder: any = 'Concession';
	editFlag = false;
	concessionAmountFlag = true;
	fcc_is_hostel_fee = 0;
	constructor(private fbuild: FormBuilder,
		private feeService: FeeService,
		private sisService: SisService,
		private common: CommonAPIService) { }

	ngOnInit() {
		this.buildForm();
		this.getFeeHeads();
		this.getConcessionRules();
		this.getConcessionCategory();
		this.getClassData();
	}
	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	buildForm() {
		this.conccesionCategoryForm = this.fbuild.group({
			fcc_id: '',
			fcc_name: '',
			fcc_fh_id: '',
			fcc_class_id: [],
			fcc_fcrt_id: '',
			fcc_amount: '',
			fcc_status: '1'
		});
	}
	submit() {
		if (!this.conccesionCategoryForm.valid) {
			this.common.showSuccessErrorMessage('Please fill required fields', 'error');
			this.conccesionCategoryForm.markAsDirty();
		} else {
			this.conccesionCategoryForm.markAsPristine();
			this.conccesionCategoryForm.updateValueAndValidity();
			this.conccesionCategoryForm.value['fcc_is_hostel_fee'] = this.fcc_is_hostel_fee;
			this.feeService.insertConcessionCategory(this.conccesionCategoryForm.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Inserted Successfully', 'success');
					this.getConcessionCategory();
					this.conccesionCategoryForm.reset();
					this.concessionAmountFlag = true;
					this.amountPlaceHolder = 'Concession';
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	reset() {
		this.conccesionCategoryForm.reset();
		this.conccesionCategoryForm.markAsPristine();
		this.conccesionCategoryForm.markAsUntouched();
		this.conccesionCategoryForm.updateValueAndValidity();
	}
	getClass() {
		this.classArray = [];
		this.sisService.getClass({ fh_id: this.conccesionCategoryForm.value.fcc_fh_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data[0].fh_classes;
			}
		});
	}
	getFeeHeads() {
		this.feeService.getFeeHeads({ fh_is_hostel_fee: this.fcc_is_hostel_fee }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.feeheadArray = result.data;
			}
		});
	}

	getConcessionRules() {
		this.feeService.getConcessionRuleType({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.ruleArray = result.data;
			}
		});
	}
	disableConcessionAmount(event) {
		if (event.value === '4') {
			this.concessionAmountFlag = false;
			this.conccesionCategoryForm.patchValue({
				fcc_amount: 0
			});
		} else {
			this.concessionAmountFlag = true;
		}
		if (event.value === '3') {
			this.amountPlaceHolder = 'Amount Chargeable';
		} else {
			this.amountPlaceHolder = 'Concession';
		}
	}
	getConcessionCategory() {
		this.CONCESSION_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<ConCatElement>(this.CONCESSION_ELEMENT_DATA);
		this.feeService.getConcessionCategory({ fcc_is_hostel_fee: this.fcc_is_hostel_fee }).subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					this.CONCESSION_ELEMENT_DATA.push({
						position: pos,
						category: item.fcc_name ? item.fcc_name : '-',
						head: item.fcc_fh_id,
						class: item.fcc_class_id,
						type: item.fcc_fcrt_id,
						amount: item.fcc_amount ? item.fcc_amount : '-',
						status: item.fcc_status,
						action: item
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<ConCatElement>(this.CONCESSION_ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.dataSource.sort = this.sort;
			}
			this.conccesionCategoryForm.reset();
		});
	}
	getFeeHeadName(id) {
		if (id) {
			const findex = this.feeheadArray.findIndex(f => f.fh_id === id);
			if (findex !== -1) {
				return this.feeheadArray[findex].fh_name;
			}
		} else {
			return '-';
		}
	}
	getRuleName(id) {
		if (id) {
			const findex = this.ruleArray.findIndex(f => f.fcrt_id === id);
			if (findex !== -1) {
				return this.ruleArray[findex].fcrt_name;
			}
		} else {
			return '-';
		}
	}
	getClassName(classArray) {
		let className = '';
		for (const item of classArray) {
			for (const titem of this.classDataArray) {
				if (item === titem.class_id) {
					className = className + titem.class_name + ',';
				}
			}
		}
		return className;
	}
	getClassData() {
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classDataArray = result.data;
			}
		});
	}
	changeStatus($event, value: any) {
		let finalJSon = {};
		if ($event.checked) {
			finalJSon = {
				fcc_status: '1',
				fcc_id: value.fcc_id ? value.fcc_id : '',
				fcc_class_id: value.fcc_class_id,
				fcc_fcrt_id: value.fcc_fcrt_id,
				fcc_fh_id: value.fcc_fh_id,
				fcc_name: value.fcc_name,
				fcc_amount: value.fcc_amount,
			};
		} else {
			finalJSon = {
				fcc_status: '0',
				fcc_id: value.fcc_id ? value.fcc_id : '',
				fcc_class_id: value.fcc_class_id,
				fcc_fcrt_id: value.fcc_fcrt_id,
				fcc_fh_id: value.fcc_fh_id,
				fcc_name: value.fcc_name,
				fcc_amount: value.fcc_amount,
			};
		}
		finalJSon['fh_is_hostel_fee'] = this.fcc_is_hostel_fee;
		this.feeService.updateConcessionCategory(finalJSon).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Updated Successfully', 'success');
				this.getConcessionCategory();
			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	patchValue(value: any) {
		this.editFlag = true;
		this.conccesionCategoryForm.patchValue({
			fcc_fh_id: value.fcc_fh_id
		});
		this.getClass();
		if (value.fcc_fcrt_id === '4') {
			this.concessionAmountFlag = false;
		}
		this.conccesionCategoryForm.patchValue({
			fcc_id: value.fcc_id,
			fcc_class_id: value.fcc_class_id,
			fcc_fcrt_id: value.fcc_fcrt_id,
			fcc_name: value.fcc_name,
			fcc_amount: value.fcc_amount,
			fcc_status: value.fcc_status
		});
	}
	update() {
		if (!this.conccesionCategoryForm.valid) {
			this.conccesionCategoryForm.markAsDirty();
		} else {
			this.conccesionCategoryForm.markAsPristine();
			this.conccesionCategoryForm.updateValueAndValidity();
			this.conccesionCategoryForm.value['fcc_is_hostel_fee'] = this.fcc_is_hostel_fee;
			this.feeService.updateConcessionCategory(this.conccesionCategoryForm.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Updated Successfully', 'success');
					this.getConcessionCategory();
					this.editFlag = false;
					this.conccesionCategoryForm.reset();
					this.concessionAmountFlag = true;
					this.amountPlaceHolder = 'Concession';
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	deleteConfirm(value: any) {
		this.feeService.deleteConcessionCategory(
			{
				fcc_id: value.fcc_id,
			}).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Concession Category deleted successfully', 'success');
					this.getConcessionCategory();
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
				}
			});
	}

	changeIsHostelFee(event) {
		if (event.checked) {
			this.fcc_is_hostel_fee = 1;
		} else {
			this.fcc_is_hostel_fee = 0;
		}
		this.getFeeHeads();
		this.getConcessionCategory();
	}
}
