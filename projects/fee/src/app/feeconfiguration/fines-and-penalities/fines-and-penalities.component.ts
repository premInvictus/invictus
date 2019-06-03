import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, ErrorStateMatcher } from '@angular/material';
import { FinePenaltiesElement } from './finepenalties.model';
import { SisService, CommonAPIService, FeeService } from '../../_services/index';
import { FormControl, NgForm, FormGroupDirective, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmValidParentMatcher } from '../../_validationclass/confirmValidParentMatcher.class';
@Component({
	selector: 'app-fines-and-penalities',
	templateUrl: './fines-and-penalities.component.html',
	styleUrls: ['./fines-and-penalities.component.scss']
})

export class FinesAndPenalitiesComponent implements OnInit, AfterViewInit {
	classArray: any[] = [];
	sectionArray: any[] = [];
	fineTypeArray: any[] = [];
	@ViewChild('deleteModal') deleteModal;
	fineEventTypeArray: any[] = [];
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	editFlag = false;
	finepenaltiesForm: FormGroup;
	constructor(private fbuild: FormBuilder, private sisService: SisService,
		private common: CommonAPIService,
		private feeService: FeeService) { }
	FINEPENALTIES_ELEMENT_DATA: FinePenaltiesElement[] = [];
	displayedColumns: string[] = ['srno', 'finename', 'finetype', 'fineamount', 'event', 'upperlimit', 'description', 'status', 'action'];
	dataSource = new MatTableDataSource<FinePenaltiesElement>(this.FINEPENALTIES_ELEMENT_DATA);
	fin_is_hostel_fee = 0;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSection();
		this.getFineTypes();
		this.getFineEvents();
		this.getFinePenalties();
	}
	buildForm() {
		this.finepenaltiesForm = this.fbuild.group({
			fin_id: '',
			fin_name: '',
			fin_type_id: '',
			fin_amt: '',
			fin_desc: '',
			fin_class_id: '',
			fin_sec_id: '',
			fin_event_id: '',
			fin_status: '1',
			fin_upper_limit: ''
		});
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	getClass() {
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	getSection() {
		this.sisService.getSectionAll().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	deleteConfirm(value) {
		const deleteJson = {
			fin_id: value.fin_id,
			fin_status: '5'
		};
		this.feeService.insertFineandPenalties(deleteJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Deleted Succesfully', 'success');
				this.getFinePenalties();
			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	getFineTypes() {
		this.feeService.getFinType().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.fineTypeArray = result.data;
			}
		});
	}
	getFineEvents() {
		this.feeService.getFineEvent().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.fineEventTypeArray = result.data;
			}
		});
	}
	getFinePenalties() {
		this.FINEPENALTIES_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<FinePenaltiesElement>(this.FINEPENALTIES_ELEMENT_DATA);
		this.feeService.getFineandPenalties({fin_is_hostel_fee : this.fin_is_hostel_fee}).subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					this.FINEPENALTIES_ELEMENT_DATA.push({
						srno: pos,
						finename: item.fin_name,
						finetype: item.ft_type_name,
						fineamount: item.fin_amt,
						classsection: item.class_name + '-' + item.sec_name,
						description: item.fin_desc,
						event: item.fe_event_name,
						upperLimit: item.fin_upper_limit ? item.fin_upper_limit : 'NA',
						status: item.fin_status === '1' ? true : false,
						action: item
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<FinePenaltiesElement>(this.FINEPENALTIES_ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe(() => this.paginator.pageSize = 0);
				this.dataSource.sort = this.sort;
			}
			this.finepenaltiesForm.reset();
		});
	}
	submit() {
		if (!this.finepenaltiesForm.valid) {
			this.finepenaltiesForm.markAsDirty();
		} else {
			this.finepenaltiesForm.markAsPristine();
			this.finepenaltiesForm.updateValueAndValidity();
			this.finepenaltiesForm.value['fin_status'] = '1';
			this.finepenaltiesForm.value['fin_is_hostel_fee'] = this.fin_is_hostel_fee;
			this.feeService.insertFineandPenalties(this.finepenaltiesForm.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Fines and Penalties Added Succesfully', 'success');
					this.getFinePenalties();
					this.finepenaltiesForm.reset();
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
					this.finepenaltiesForm.reset();
				}
			});
		}
	}
	changeStatus($event, value: any) {
		let toggleJSON: any = {};
		if ($event.checked) {
			toggleJSON = {
				statusUpdate: true,
				fin_status: '1',
				fin_id: value.fin_id
			};
		} else {
			toggleJSON = {
				statusUpdate: true,
				fin_status: '0',
				fin_id: value.fin_id
			};
		}
		toggleJSON['fin_is_hostel_fee'] = this.fin_is_hostel_fee;
		this.feeService.insertFineandPenalties(toggleJSON).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Status Changed Succesfully', 'success');
				this.getFinePenalties();
			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	patchValue(value: any) {
		this.editFlag = true;
		this.finepenaltiesForm.patchValue({
			fin_id: value.fin_id,
			fin_name: value.fin_name,
			fin_type_id: value.fin_type_id,
			fin_amt: value.fin_amt,
			fin_desc: value.fin_desc,
			fin_class_id: value.fin_class_id,
			fin_sec_id: value.fin_sec_id,
			fin_event_id: value.fin_event_id,
			fin_status: value.fin_status,
			fin_upper_limit: value.fin_upper_limit,
		});
	}
	update() {
		if (!this.finepenaltiesForm.valid) {
			this.finepenaltiesForm.markAsDirty();
		} else {
			this.finepenaltiesForm.markAsPristine();
			this.finepenaltiesForm.updateValueAndValidity();
			this.finepenaltiesForm.value['fin_is_hostel_fee'] = this.fin_is_hostel_fee;
			this.feeService.insertFineandPenalties(this.finepenaltiesForm.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Fines and Penalties Updated Succesfully', 'success');
					this.getFinePenalties();
					this.finepenaltiesForm.reset();
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
					this.finepenaltiesForm.reset();
				}
			});
		}
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	changeIsHostelFee(event) {
		if (event.checked) {
			this.fin_is_hostel_fee = 1;
		} else {
			this.fin_is_hostel_fee = 0;
		}
		this.getFinePenalties();
	}
}

