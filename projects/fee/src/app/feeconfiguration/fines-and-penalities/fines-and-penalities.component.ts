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
	monthWiseForm:any = FormGroup;
	constructor(private fbuild: FormBuilder, private sisService: SisService,
		private common: CommonAPIService,
		private feeService: FeeService) { }
	FINEPENALTIES_ELEMENT_DATA: FinePenaltiesElement[] = [];
	displayedColumns: string[] = ['srno', 'finename', 'finetype', 'fineamount', 'event', 'upperlimit', 'description', 'status', 'action'];
	dataSource = new MatTableDataSource<FinePenaltiesElement>(this.FINEPENALTIES_ELEMENT_DATA);
	fin_is_hostel_fee = 0;
	chooseMonthLength = 0;
	editMonthWiseData = [];
	monthArr:any[] = [	{mon_id:1,mon_value:1},
						{mon_id:2,mon_value:2},
						{mon_id:3,mon_value:3},
						{mon_id:4,mon_value:4},
						{mon_id:5,mon_value:5},
						{mon_id:6,mon_value:6},
						{mon_id:7,mon_value:7},
						{mon_id:8,mon_value:8},
						{mon_id:9,mon_value:9},
						{mon_id:10,mon_value:10},
						{mon_id:11,mon_value:11},
						{mon_id:12,mon_value:12}

					 ]
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	btnDisable = false;
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
			fin_amt: 0,
			fin_desc: '',
			fin_max_month: '',
			fin_class_id: '',
			fin_sec_id: '',
			fin_event_id: '',
			fin_status: '1',
			fin_upper_limit: '',
			fin_no_of_month_selected:''
			
		});
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
																									
	renderMonthWiseFineControl(value) {
		this.chooseMonthLength = value;
		var temp_arr = [];

		var diffLength = 0;
		if (this.editMonthWiseData && this.editMonthWiseData.length) {
			diffLength = value - this.editMonthWiseData.length;
		} else {
			diffLength = value;
		}

		if (this.editMonthWiseData && this.editMonthWiseData.length > 0) { 
			for (let i=0; i<this.editMonthWiseData.length;i++) {
				temp_arr.push(this.fbuild.group({
					fin_month_fin_amt : this.editMonthWiseData[i]['month_data']['fine_amt'],
					fin_month_days: this.editMonthWiseData[i]['month_data']['fine_days']
	
				}));
			}
		} 
		for (let i=0; i<diffLength;i++) {
			temp_arr.push(this.fbuild.group({
				fin_month_fin_amt : '',
				fin_month_days: ''

			}));
		}
		this.monthWiseForm = this.fbuild.array(temp_arr);
		console.log('chooseMonthLength--',this.chooseMonthLength, value, this.monthWiseForm );
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
		let monthWiseData = [];
		if (!this.finepenaltiesForm.valid) {
			this.btnDisable = false;
			this.finepenaltiesForm.markAsDirty();
		} else {
			this.btnDisable = true;
			this.finepenaltiesForm.markAsPristine();
			this.finepenaltiesForm.updateValueAndValidity();
			this.finepenaltiesForm.value['fin_status'] = '1';
			this.finepenaltiesForm.value['fin_is_hostel_fee'] = this.fin_is_hostel_fee;
			if (this.monthWiseForm && this.monthWiseForm.value) {				
				for (var i=0; i<this.monthWiseForm.value.length; i++) {
					var monthJson =  {
						"month_id" : i+1,
						"month_data" : {"fine_amt" : this.monthWiseForm.value[i].fin_month_fin_amt , "fine_days" : this.monthWiseForm.value[i].fin_month_days}
					};
					monthWiseData.push(monthJson);
				}
			}
			this.finepenaltiesForm.value['fin_month_wise_data'] = JSON.stringify(monthWiseData);
			this.feeService.insertFineandPenalties(this.finepenaltiesForm.value).subscribe((result: any) => {
				this.btnDisable = false;
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
			fin_max_month: value.fin_max_month,
			fin_desc: value.fin_desc,
			fin_class_id: value.fin_class_id,
			fin_sec_id: value.fin_sec_id,
			fin_event_id: value.fin_event_id,
			fin_status: value.fin_status,
			fin_upper_limit: value.fin_upper_limit,			
		});

		if (value && value.fin_month_wise_data) {
			var monthWiseData = JSON.parse(value.fin_month_wise_data);
			this.editMonthWiseData = JSON.parse(value.fin_month_wise_data);
			this.finepenaltiesForm.patchValue({
				fin_no_of_month_selected : monthWiseData.length
			});			
			this.renderMonthWiseFineControl(monthWiseData.length);
			// var temp_arr = [];
			// for (let i=0; i<monthWiseData.length;i++) {
			// 	temp_arr.push(this.fbuild.group({
			// 		fin_month_fin_amt : monthWiseData[i]['fine_amt'],
			// 		fin_month_days: monthWiseData[i]['fine_days']
	
			// 	}));
			// }
			// this.monthWiseForm = this.fbuild.array(temp_arr);
			// console.log('monthWiseForm--', this.monthWiseForm);
		}
	}
	update() {
		let monthWiseData = [];
		if (!this.finepenaltiesForm.valid) {
			this.btnDisable = false;
			this.finepenaltiesForm.markAsDirty();
		} else {
			this.btnDisable = true;
			this.finepenaltiesForm.markAsPristine();
			this.finepenaltiesForm.updateValueAndValidity();
			this.finepenaltiesForm.value['fin_is_hostel_fee'] = this.fin_is_hostel_fee;
			if (this.monthWiseForm && this.monthWiseForm.value) {				
				for (var i=0; i<this.monthWiseForm.value.length; i++) {
					var monthJson =  {
						"month_id" : i+1,
						"month_data" : {"fine_amt" : this.monthWiseForm.value[i].fin_month_fin_amt , "fine_days" : this.monthWiseForm.value[i].fin_month_days}
					};
					monthWiseData.push(monthJson);
				}
			}

			this.finepenaltiesForm.value['fin_month_wise_data'] = JSON.stringify(monthWiseData);
			this.feeService.insertFineandPenalties(this.finepenaltiesForm.value).subscribe((result: any) => {
				this.btnDisable = false;
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
		this.btnDisable = false;
		if (event.checked) {
			this.fin_is_hostel_fee = 1;
		} else {
			this.fin_is_hostel_fee = 0;
		}
		this.getFinePenalties();
	}
	checkFineType(fine_id) {
		this.chooseMonthLength = 0;
		this.finepenaltiesForm.patchValue({
			fin_no_of_month_selected : ''
		})
	}
}

