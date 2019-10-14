import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './setup.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit, AfterViewInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	formGroupArray: any[] = [];
	configValue: any;
	currentUser: any;
	session: any;
	param: any = {};
	systemInfoForm: FormGroup;
	setupUpdateFlag = false;
	searchtoggle = false;
	editFlag = false;
	showConfigForm = '';
	subArray: any[] = [];
	file: any;
	finalXlsTopicArray: any[] = [];
	XlslArray: any[] = [];
	arrayBuffer: any;
	subjectTypeArr: any[] = [];
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['position', 'name', 'status', 'action'];
	firstHeaderArray: any[] = [];
	secondHeaderArray: any[] = [];
	configFlag = false;


	constructor(
		private fbuild: FormBuilder,
		private erpCommonService: ErpCommonService,
		public commonService: CommonAPIService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
	}
	

	
	ngAfterViewInit() {
		this.configDataSource.sort = this.sort;
		this.configDataSource.paginator = this.paginator;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);

	buildForm() {
		this.formGroupArray = [{
			formGroup: this.fbuild.group({
				genre_id: '',
				genre_name: '',
				genre_status: '',
			})
		}];
	}
	

	// get genre list
	getGenre(that) {
		that.genreArray = [];
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.erpCommonService.getGenre().subscribe((result: any) => {
			if (result.status === 'ok') {
				that.genreArray = result.data;
				if (that.configValue === '1') {
					let pos = 1;
					for (const item of result.data) {
						that.CONFIG_ELEMENT_DATA.push({
							position: pos,
							name: item.genre_name,
							status: item.genre_status,
							action: item
						});
						pos++;
					}
					that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
					that.configDataSource.paginator = that.paginator;
					that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
					that.configDataSource.sort = that.sort;
				}
			} else {
				that.genreArray = [];
			}
		});
	}

	resetForm(value) {
		this.formGroupArray[value - 1].formGroup.reset();
		this.setupUpdateFlag = false;
	}


	validateForm() {
		let validateFlag = false;
		if (this.showConfigForm === '1') {
			if (this.systemInfoForm.value.genre_name === '') {
				this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
				validateFlag = false;
			} else {
				validateFlag = true;
			}
		}
		return validateFlag;
	}

	
	getActiveStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.genre_status === '1') {
				return true;
			}
		}
	}

	formEdit(value: any) {
		if (Number(this.configValue) === 1) {
			this.setupUpdateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				genre_id: value.genre_id,
				genre_name: value.genre_name,
				genre_status: value.genre_status
			});
		} 
	}

	loadConfiguration(event) {
		this.searchtoggle = false;
		this.configFlag = false;
		this.setupUpdateFlag = false;
		this.configValue = event.value;
		if (Number(this.configValue) === 1) {
			this.getGenre(this);
			this.displayedColumns = ['position', 'name', 'status', 'action'];
			this.configFlag = true;
		} 
	}

	deleteConfirm({ data, type }) {
		switch (type) {
			case '1':
				data.genre_status = '5';
				this.deleteEntry(data, 'insertGenre', this.getGenre);
				break;
		}
	}

	addConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.formGroupArray[value - 1].formGroup.value.genre_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertGenre', this.getGenre);
					break;
			}
		}
	}

	updateConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'insertGenre', this.getGenre);
					break;
			}
		}
	}

	toggleStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.genre_status === '1') {
				value.genre_status = '0';
			} else {
				value.genre_status = '1';
			}
			this.erpCommonService.insertGenre(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getGenre(this);
				}
			});
		}
	}

	applyFilter(event) {
		this.configDataSource.filter = event.trim().toLowerCase();
	}

	deleteCancel() { }

	deleteEntry(deletedData, serviceName, next) {
		this.erpCommonService[serviceName](deletedData).subscribe((result: any) => {
			if (result.status === 'ok') {
				next(this);
				this.commonService.showSuccessErrorMessage(result.message, result.status);
			}
		});
	}
	addEntry(data, serviceName, next) {
		this.erpCommonService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				next(this);
				this.commonService.showSuccessErrorMessage(result.message, result.status);
			} else {
				this.commonService.showSuccessErrorMessage(result.message, result.status);
			}
		});
	}
	updateEntry(data, serviceName, next) {
		this.erpCommonService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				this.setupUpdateFlag = false;
				next(this);
				this.commonService.showSuccessErrorMessage(result.message, result.status);
			} else {
				this.commonService.showSuccessErrorMessage(result.message, result.status);
			}
		});
	}

}
