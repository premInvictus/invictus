import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './system-info.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { FeeService, CommonAPIService } from '../../_services';
@Component({
	selector: 'app-system-info',
	templateUrl: './system-info.component.html',
	styleUrls: ['./system-info.component.scss']
})
export class SystemInfoComponent implements OnInit, AfterViewInit {

	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	formGroupArray: any[] = [];
	configValue: any;
	vaccinationArray: any[] = [];
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['position', 'name', 'alias', 'column1', 'column2', 'action', 'modify'];
	firstHeaderArray: any[] = ['Bank Name'];
	column1HeaderArray: any[] = ['Account Number'];
	column2HeaderArray: any[] = ['IFSC Code'];
	secondHeaderArray: any[] = ['Branch'];
	configFlag = false;
	updateFlag = false;
	allBanks: any[] = [];
	constructor(private fbuild: FormBuilder,
		public feeService: FeeService,
		private commonService: CommonAPIService) { }

	ngOnInit() {
		this.buildForm();
		this.getAllBanks();
	}
	ngAfterViewInit() {
		this.configDataSource.sort = this.sort;
		this.configDataSource.paginator = this.paginator;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	buildForm() {
		this.formGroupArray = [{
			formGroup: this.fbuild.group({
				bnk_id: '',
				bnk_branch: '',
				bnk_account_no: '',
				bnk_ifsc: '',
				bnk_status: ''
			})
		}];
	}
	loadConfiguration($event) {
		this.configFlag = false;
		this.updateFlag = false;
		this.configValue = $event.value;
		if (Number(this.configValue) === 1) {
			this.getBankAll(this);
			this.configFlag = true;
		}
	}
	getActiveStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.bnk_status === '1') {
				return true;
			}
		}
	}
	toggleStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.bnk_status === '1') {
				value.bnk_status = '0';
			} else {
				value.bnk_status = '1';
			}
			this.feeService.updateSchoolBank(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getBankAll(this);
				}
			});
		}
	}
	deleteConfirm({ data, type }) {
		switch (type) {
			case '1':
				this.deleteEntry(data, 'deleteBank', this.getBankAll);
				break;
		}
	}
	getBankAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.feeService.getBanks().subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.bank_name,
						alias: item.bnk_branch,
						column1: item.bnk_account_no,
						column2: item.bnk_ifsc,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	resetForm(value) {
		this.formGroupArray[value - 1].formGroup.reset();
	}
	addConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.formGroupArray[value - 1].formGroup.value.bnk_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'addSchoolBank', this.getBankAll);
					break;
			}
		}
	}
	formEdit(value: any) {
		if (Number(this.configValue) === 1) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				bnk_id: value.bnk_id,
				bnk_branch: value.bnk_branch,
				bnk_account_no: value.bnk_account_no,
				bnk_ifsc: value.bnk_ifsc,
				bnk_status: value.bnk_status
			});
		}
	}
	updateConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateSchoolBank', this.getBankAll);
					break;
			}
		}
	}
	applyFilter(event) { }
	deleteCancel() { }
	deleteEntry(deletedData, serviceName, next) {
		this.feeService[serviceName](deletedData).subscribe((result: any) => {
			if (result.status === 'ok') {
				next(this);
				this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
			}
		});
	}
	addEntry(data, serviceName, next) {
		this.feeService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				next(this);
				this.commonService.showSuccessErrorMessage('Added Succesfully', 'success');
			}
		});
	}
	updateEntry(data, serviceName, next) {
		this.feeService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				this.updateFlag = false;
				next(this);
				this.commonService.showSuccessErrorMessage('Updated Succesfully', 'success');
			}
		});
	}
	getAllBanks() {
		this.allBanks = [];
		this.feeService.getBanksAll({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.allBanks = result.data;
			}
		});
	}
}
