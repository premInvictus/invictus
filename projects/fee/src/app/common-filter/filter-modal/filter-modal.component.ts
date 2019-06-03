import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { SisService, CommonAPIService, FeeService } from '../../_services/index';
import { DynamicReport } from './filter-modal.model';
import { MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';

@Component({
	selector: 'app-filter-modal',
	templateUrl: './filter-modal.component.html',
	styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {

	@Output() filterResult = new EventEmitter();

	generateReportForm: FormGroup;
	sortbyform: FormGroup;
	discreteValue: any;
	fromvalue: any;
	tovalue: any;
	equaltoFC = '';
	equalto = '';
	availableArray = [];
	selectedArray = [];
	filterArray = [];
	filterone = true;
	filterdivtwo = false;
	ELEMENT_DATA: any[];
	displayedColumns: string[] = ['srno', 'fieldlabel', 'fromto', 'equalto', 'discrete', 'action'];
	dataSource: any;
	filterdiv = false;
	currentFilterStatus: any = {};
	currentFilter: any = {};
	dropdownArray: any[] = [];
	filtersItemArray: any[] = [];
	processType: any = '';
	fieldApiMapping: any = [
		{ filterId: 'au_class_id', apiName: 'getClass', fieldId: 'class_id', fieldValue: 'class_name' },
		{ filterId: 'au_sec_id', apiName: 'getSectionAll', fieldId: 'sec_id', fieldValue: 'sec_name' },
		{ filterId: 'au_hou_id', apiName: 'getHouse', fieldId: 'hou_id', fieldValue: 'hou_house_name' },
		{ filterId: 'mi_blood_group', apiName: 'getBloodGroup', fieldId: 'bg_id', fieldValue: 'bg_name' },
		{ filterId: 'upd_religion_id', apiName: 'getReligionDetails', fieldId: 'rel_id', fieldValue: 'rel_name' },
		{ filterId: 'upd_mt_id', apiName: 'getMotherTongue', fieldId: 'mt_id', fieldValue: 'mt_name' },
		{ filterId: 'esk_activity_name', apiName: 'getActivity', fieldId: 'act_id', fieldValue: 'act_name' },
		{ filterId: 'era_aut_id', apiName: 'getAuthority', fieldId: 'aut_id', fieldValue: 'aut_name' },
		{ filterId: 'epd_qualification', apiName: 'getQualifications', fieldId: 'qlf_id', fieldValue: 'qlf_name' },
		{ filterId: 'epd_parent_occupation_type', apiName: 'getOccupationType', fieldId: 'ocpt_id', fieldValue: 'ocpt_name' },
		{ filterId: 'au_enrollment_status', apiName: 'getEnrollmentStatus', fieldId: 'enrol_id', fieldValue: 'enrol_name' },
		{ filterId: 'upd_gender', apiName: 'getGender', fieldId: 'gen_id', fieldValue: 'gen_name' },
		{ filterId: 'accd_fo_id', apiName: 'getCategory', fieldId: 'fo_id', fieldValue: 'fo_name' },
		{ filterId: 'accd_fcg_id', apiName: 'getConcessionCategory', fieldId: 'fcc_id', fieldValue: 'fcc_name' },
		{ filterId: 'accd_ts_id', apiName: 'getSlabs', fieldId: 'ts_id', fieldValue: 'ts_name' },
		{ filterId: 'accd_tr_id', apiName: 'getRoutes', fieldId: 'tr_id', fieldValue: 'tr_route_name' }
	];
	filtertype = null;
	constructor(
		public dialogRef: MatDialogRef<FilterModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fbuild: FormBuilder,
		private sisService: SisService,
		private feeService: FeeService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.filtersItemArray = this.data.filterResult;
		this.processType = this.data.process_type;
		this.buildForm();
		this.getFormFieldsForFilter('filter');
	}
	closemodal(): void {
		this.dialogRef.close();
	}
	async buildForm() {
		this.generateReportForm = await this.fbuild.group({
			title: '',
			enrollment_type: '',
			action: '',
			selects: [],
			filters: [],
			orderby: []
		});
		this.sortbyform = await this.fbuild.group({
			sort_param: this.fbuild.array([this.fbuild.group({
				sortname: '',
				sortorder: ''
			})])
		});
		this.generateReportForm.patchValue({
			filters: this.data.filterResult
		});
	}
	get sortParam() {
		return this.sortbyform.get('sort_param') as FormArray;
	}
	addsortParam() {
		this.sortParam.push(this.fbuild.group({
			sortname: '',
			sortorder: ''
		}));
	}
	deletesortParam(index) {
		this.sortParam.removeAt(index);
	}
	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex);
		}
	}

	getFilterFromParent(ff_id) {
		if (this.data.filterResult.length > 0) {
			for (const item of this.data.filterResult) {
				if (item.filter.ff_id === ff_id) {
					return item.filter;
				}
			}
		}
		return null;
	}
	getFormFieldsForFilter(type) {
		const param: any = {};
		if (type === 'field') {
			this.availableArray = [];
			param.ff_select_status = 'Y';
		} else if (type === 'filter') {
			this.filterArray = [];
			param.ff_filter_status = 'Y';
			param.ff_project_id = '3';
		}
		this.sisService.getFormFieldsForFilter(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (type === 'field') {
					this.availableArray = result.data;
				} else if (type === 'filter') {
					this.filterArray = result.data;
					this.ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<DynamicReport>(this.ELEMENT_DATA);
					let pos = 1;
					if (this.filterArray.length > 0) {
						for (const item of this.filterArray) {
							const parentfilter = this.getFilterFromParent(item.ff_id);
							if (parentfilter) {
								this.ELEMENT_DATA.push(parentfilter);
							} else {
								if (Number(this.processType) === 1 && (item.ff_field_name !== 'em_provisional_admission_no' &&
									item.ff_field_name !== 'em_alumini_no' && item.ff_field_name !== 'em_admission_no' &&
									item.ff_field_name !== 'em_regd_no')) {
									this.ELEMENT_DATA.push({
										sr_no: pos,
										ff_id: item.ff_id,
										ff_field_name: item.ff_field_name,
										ff_field_type: item.ff_field_type,
										fieldlabel: item.ff_label,
										fromto: '',
										fromtovalue: '',
										from: '',
										to: '',
										equalto: '',
										discrete: '',
										discretevalue: '',
										action: item
									});
									pos++;
								} else if (Number(this.processType) === 2 && (item.ff_field_name !== 'em_provisional_admission_no' &&
									item.ff_field_name !== 'em_alumini_no' && item.ff_field_name !== 'em_admission_no' &&
									item.ff_field_name !== 'em_enq_no')) {
									this.ELEMENT_DATA.push({
										sr_no: pos,
										ff_id: item.ff_id,
										ff_field_name: item.ff_field_name,
										ff_field_type: item.ff_field_type,
										fieldlabel: item.ff_label,
										fromto: '',
										fromtovalue: '',
										from: '',
										to: '',
										equalto: '',
										discrete: '',
										discretevalue: '',
										action: item
									});
									pos++;
								} else if (Number(this.processType) === 3 && (item.ff_field_name !== 'em_regd_no' &&
									item.ff_field_name !== 'em_alumini_no' && item.ff_field_name !== 'em_admission_no' &&
									item.ff_field_name !== 'em_enq_no')) {
									this.ELEMENT_DATA.push({
										sr_no: pos,
										ff_id: item.ff_id,
										ff_field_name: item.ff_field_name,
										ff_field_type: item.ff_field_type,
										fieldlabel: item.ff_label,
										fromto: '',
										fromtovalue: '',
										from: '',
										to: '',
										equalto: '',
										discrete: '',
										discretevalue: '',
										action: item
									});
									pos++;
								} else if (Number(this.processType) === 4 && (item.ff_field_name !== 'em_provisional_admission_no' &&
									item.ff_field_name !== 'em_alumini_no' && item.ff_field_name !== 'em_regd_no' &&
									item.ff_field_name !== 'em_enq_no')) {
									this.ELEMENT_DATA.push({
										sr_no: pos,
										ff_id: item.ff_id,
										ff_field_name: item.ff_field_name,
										ff_field_type: item.ff_field_type,
										fieldlabel: item.ff_label,
										fromto: '',
										fromtovalue: '',
										from: '',
										to: '',
										equalto: '',
										discrete: '',
										discretevalue: '',
										action: item
									});
									pos++;
								} else if (Number(this.processType) === 5 && (item.ff_field_name !== 'em_provisional_admission_no' &&
									item.ff_field_name !== 'em_regd_no' && item.ff_field_name !== 'em_admission_no' &&
									item.ff_field_name !== 'em_enq_no')) {
									this.ELEMENT_DATA.push({
										sr_no: pos,
										ff_id: item.ff_id,
										ff_field_name: item.ff_field_name,
										ff_field_type: item.ff_field_type,
										fieldlabel: item.ff_label,
										fromto: '',
										fromtovalue: '',
										from: '',
										to: '',
										equalto: '',
										discrete: '',
										discretevalue: '',
										action: item
									});
									pos++;
								}
							}
						}
						this.dataSource = new MatTableDataSource<DynamicReport>(this.ELEMENT_DATA);
						this.filterdiv = true;
					}
				}
			}
		});
	}

	filterTwo(currentele) {
		this.currentFilter = currentele;
		this.currentFilterStatus.ff_field_type = currentele.ff_field_type;
		this.currentFilterStatus.fieldlabel = currentele.fieldlabel;
		this.getDropdown(currentele.ff_field_name);
		this.discreteValue = '';
		this.fromvalue = '';
		this.tovalue = '';
		if (this.currentFilter.discretevalue) {
			this.discreteValue = this.currentFilter.discretevalue;
		}
		if (this.currentFilter.from) {
			this.fromvalue = this.currentFilter.from;
		}
		if (this.currentFilter.to) {
			this.tovalue = this.currentFilter.to;
		}
		if (this.currentFilter.equalto) {
			this.equalto = this.currentFilter.equalto;
		}
		this.filterdivtwo = true;
		this.filterone = false;
	}

	gobacktofilterOne() {
		this.filterdivtwo = false;
		this.filterone = true;
		this.currentFilter.fromto = '';
		this.currentFilter.fromtovalue = '';
		this.currentFilter.from = '';
		this.currentFilter.to = '';
		this.currentFilter.equalto = '';
		this.currentFilter.discrete = [];
		this.currentFilter.discretevalue = [];
		const ind = this.filtersItemArray.findIndex(element => element.ff_field_name === this.currentFilter.ff_field_name);
		if (ind !== -1) {
			this.filtersItemArray.splice(ind, 1);
		}
	}
	getDropdown(ff_field_name) {
		for (const item of this.fieldApiMapping) {
			if (item.filterId === ff_field_name) {
				this.dropdownArray = [];
				switch (item.apiName) {
					case 'getClass':
						this.sisService.getClass({}).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getSectionAll':
						this.sisService.getSectionAll().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										if (Number(item1.sec_id) !== 0) {
											this.dropdownArray.push({
												field_id: item1[item.fieldId],
												field_name: item1[item.fieldValue]
											});
										}
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getHouse':
						this.sisService.getHouses().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getBloodGroup':
						this.sisService.getBloodGroup().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getReligionDetails':
						this.sisService.getReligionDetails({}).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getMotherTongue':
						this.sisService.getMotherTongue({}).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getActivity':
						this.sisService.getActivity().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getAuthority':
						this.sisService.getAuthority().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getQualifications':
						this.sisService.getQualifications().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getOccupationType':
						this.sisService.getOccupationType().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getEnrollmentStatus':
						this.sisService.getEnrollmentStatus().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getGender':
						this.sisService.getGender().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getCategory':
						this.feeService.getFeeOthers({}).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getConcessionCategory':
						this.feeService.getConcessionCategory({ fcc_is_hostel_fee: '0' }).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getSlabs':
						this.feeService.getSlabs({}).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
					case 'getRoutes':
						this.feeService.getRoutes({}).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							} else {
								this.handleApiError(result);
							}
						});
						break;
				}
			}
		}
	}
	fromTextValue(event, filtertype) {
		this.filtertype = filtertype;
		if (event.target.value) {
			this.currentFilter.from = event.target.value;
		}
	}
	fromDateValue(event, filtertype) {
		this.filtertype = filtertype;
		if (event.target.value) {
			this.currentFilter.from = this.commonAPIService.dateConvertion(event.target.value._d, 'yyyy-MM-dd');
		}
	}
	toTextValue(event, filtertype) {
		this.filtertype = filtertype;
		if (event.target.value) {
			this.currentFilter.to = event.target.value;
		}
	}
	toDateValue(event, filtertype) {
		this.filtertype = filtertype;
		if (event.target.value) {
			this.currentFilter.to = this.commonAPIService.dateConvertion(event.target.value._d, 'yyyy-MM-dd');
		}
	}
	equaltoTextValue(event, filtertype) {
		this.filtertype = filtertype;
		this.currentFilter.equalto = event.target.value;
	}
	discreteTextValue(event, filtertype) {
		this.currentFilter.discrete = '';
		this.filtertype = filtertype;
		let disArray: any = [];
		disArray = event.target.value.replace(/\s/g, '').split(',');
		this.currentFilter.discretevalue = disArray;
		this.currentFilter.discrete = event.target.value;
	}
	discreteSelectValue(event, filtertype) {
		this.currentFilter.discrete = [];
		this.filtertype = filtertype;
		this.currentFilter.discretevalue = event.value;
		this.dropdownArray.forEach(element => {
			this.currentFilter.discretevalue.forEach(selement => {
				if (element.field_id === selement) {
					this.currentFilter.discrete.push(element.field_name);
				}
			});
		});
	}
	filterok() {
		const existi = this.filtersItemArray.findIndex(value => value.ff_field_name === this.currentFilter.ff_field_name);
		if (existi !== -1) {
			this.filtersItemArray.splice(existi, 1);
		}
		if (this.filtertype === 'fromto') {
			if (this.currentFilter.ff_field_type === 'text') {
				this.currentFilter.fromto = this.currentFilter.from + ' - ' + this.currentFilter.to;
				this.filtersItemArray.push({
					filter: this.currentFilter,
					ff_field_name: this.currentFilter.ff_field_name,
					filter_type: 'Fixed',
					filter_from: this.currentFilter.from,
					filter_to: this.currentFilter.to
				});
			}
		} else if (this.filtertype === 'equalto') {
			this.filtersItemArray.push({
				filter: this.currentFilter,
				ff_field_name: this.currentFilter.ff_field_name,
				filter_type: 'Discrete',
				descrete_condition: this.equaltoFC,
				descrete_value: this.currentFilter.equalto
			});
		} else if (this.filtertype === 'discrete') {
			this.filtersItemArray.push({
				filter: this.currentFilter,
				ff_field_name: this.currentFilter.ff_field_name,
				filter_type: 'Discrete',
				descrete_condition: '',
				descrete_value: this.currentFilter.discretevalue
			});
		}
		this.filterdivtwo = false;
		this.filterone = true;
	}
	filterSubmit() {
		if (this.filtersItemArray.length > 0) {
			this.generateReportForm.patchValue({
				filters: this.filtersItemArray
			});
		}
		this.dialogRef.close();
		this.dialogRef.afterClosed().subscribe(() => {
			this.filterResult.emit(this.filtersItemArray);
		});
	}
	filterCancel() {
		this.dialogRef.close();
	}
	finalSubmit() {
		if (this.selectedArray.length > 0) {
			const selectsitemarray = [];
			for (const item of this.selectedArray) {
				selectsitemarray.push({
					ff_label: item.ff_label,
					ff_field_name: item.ff_field_name
				});
			}
			this.generateReportForm.value.selects = selectsitemarray;
		} else {
			this.commonAPIService.showSuccessErrorMessage('Selected Field is empty', 'error');
		}
		if (this.generateReportForm.valid && this.selectedArray.length > 0) {
			this.sisService.generateReport(this.generateReportForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					window.open(result.data, 'Report');
					this.dropdownArray = [];
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Select Required Fields', 'error');
		}
	}
	resetOneFilter(eachFilter: any) {
		eachFilter.fromto = '';
		eachFilter.fromtovalue = '';
		eachFilter.from = '';
		eachFilter.to = '';
		eachFilter.equalto = '';
		eachFilter.discrete = [];
		eachFilter.discretevalue = [];
		const ind = this.filtersItemArray.findIndex(element => element.ff_field_name === eachFilter.ff_field_name);
		this.filtersItemArray.splice(ind, 1);
	}
	ResetForm() {
		this.filtersItemArray = [];
		this.generateReportForm.reset();
		for (let popi = this.sortbyform.value.sort_param.length - 1; popi > 0; popi--) {
			this.deletesortParam(popi);
		}
		this.ELEMENT_DATA.forEach(eachFilter => {
			eachFilter.fromto = '';
			eachFilter.fromtovalue = '';
			eachFilter.from = '';
			eachFilter.to = '';
			eachFilter.equalto = '';
			eachFilter.discrete = [];
			eachFilter.discretevalue = '';
		});
	}
	handleApiError(value) {
		if (value.status === 'error') {
			this.commonAPIService.showSuccessErrorMessage(value.message, 'error');
		}
	}
}
