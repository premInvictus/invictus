import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { SisService, CommonAPIService,SmartService } from '../../_services/index';
import { DynamicReport } from './dynamic-report.model';
import { MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';

@Component({
	selector: 'app-dynamic-report',
	templateUrl: './dynamic-report.component.html',
	styleUrls: ['./dynamic-report.component.scss']
})
export class DynamicReportComponent implements OnInit {
	generateReportForm: FormGroup;
	sortbyform: FormGroup;
	discreteValue: any;
	fromvalue: any;
	tovalue: any;
	equaltoFC = '';
	availableArray = [];
	selectedArray = [];
	filterArray = [];
	dynamicreport = true;
	filterone = false;
	filterdivtwo = false;
	sortdiv = false;
	ELEMENT_DATA: any[];
	displayedColumns: string[] = ['fieldlabel', 'fromto', 'equalto', 'discrete', 'action'];
	dataSource: any;
	filterdiv = false;
	currentFilterStatus: any = {};
	currentFilter: any = {};
	dropdownArray: any[] = [];
	filtersItemArray: any[] = [];
	sortByItemArray: any[] = [];
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
		{ filterId: 'upd_gender', apiName: 'getGender', fieldId: 'gender_id', fieldValue: 'gender_name' },
		{ filterId: 'upd_category', apiName: 'getCategory', fieldId: 'cat_id', fieldValue: 'cat_name' }
	];
	filtertype = null;

	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private SmartService: SmartService,
		private commonAPIService: CommonAPIService
	) { }
	ngOnInit() {
		this.buildForm();
		this.getFormFieldsForFilter('field');
		this.getFormFieldsForFilter('filter');
	}

	buildForm() {
		this.generateReportForm = this.fbuild.group({
			title: '',
			enrollment_type: '',
			action: '',
			selects: [],
			filters: [],
			orderby: []
		});
		this.sortbyform = this.fbuild.group({
			sort_param: this.fbuild.array([this.fbuild.group({
				sortname: '',
				sortorder: ''
			})])
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

	getFormFieldsForFilter(type) {
		const param: any = {};
		if (type === 'field') {
			this.availableArray = [];
			param.ff_select_status = 'Y';
		} else if (type === 'filter') {
			this.filterArray = [];
			param.ff_filter_status = 'Y';
		}
		this.sisService.getFormFieldsForFilter(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (type === 'field') {
					this.availableArray = result.data;
				} else if (type === 'filter') {
					this.filterArray = result.data;
					this.ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<DynamicReport>(this.ELEMENT_DATA);
					if (this.filterArray.length > 0) {
						for (const item of this.filterArray) {
							this.ELEMENT_DATA.push({
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
						}
						this.dataSource = new MatTableDataSource<DynamicReport>(this.ELEMENT_DATA);
						this.filterdiv = true;
					}
				}
			}
		});
	}

	filter() {
		this.dynamicreport = false;
		this.filterdivtwo = false;
		this.sortdiv = false;
		this.filterone = true;
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
		this.dynamicreport = false;
		this.filterdivtwo = true;
		this.sortdiv = false;
		this.filterone = false;
	}

	sort() {
		this.dynamicreport = false;
		this.filterdivtwo = false;
		this.sortdiv = true;
		this.filterone = false;
	}

	gobacktodynamicreport() {
		this.dynamicreport = true;
		this.filterdivtwo = false;
		this.sortdiv = false;
		this.filterone = false;
	}

	gobacktofilterOne() {
		this.dynamicreport = false;
		this.filterdivtwo = false;
		this.sortdiv = false;
		this.filterone = true;
	}
	getDropdown(ff_field_name) {
		for (const item of this.fieldApiMapping) {
			if (item.filterId === ff_field_name) {
				this.dropdownArray = [];
				switch (item.apiName) {
					case 'getClass':
						this.SmartService.getClassData({}).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
							}
						});
						break;
					case 'getSectionAll':
						this.sisService.getSectionAll().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
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
							}
						});
						break;
					case 'getCategory':
						this.sisService.getCategory().subscribe((result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const item1 of result.data) {
										this.dropdownArray.push({
											field_id: item1[item.fieldId],
											field_name: item1[item.fieldValue]
										});
									}
								}
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
	/*  fromSelectValue(event) {
     if (event.value) {
       this.currentFilter.from = event.value;
     }
   } */
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
		this.currentFilter.discretevalue = event.target.value;
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
	/* toSelectValue(event) {
    if (event.value) {
      this.currentFilter.to = event.value;
    }
  } */
	filterok() {
		const existi = this.filtersItemArray.findIndex(value => value.ff_field_name === this.currentFilter.ff_field_name);
		if (existi !== -1) {
			this.filtersItemArray.splice(existi, 1);
		}
		if (this.filtertype === 'fromto') {
			this.currentFilter.fromto = this.commonAPIService.dateConvertion(this.currentFilter.from, 'd-MMM-y') + ' - ' +
				this.commonAPIService.dateConvertion(this.currentFilter.to, 'd-MMM-y');
			this.filtersItemArray.push({
				ff_field_name: this.currentFilter.ff_field_name,
				filter_type: 'Fixed',
				filter_from: this.currentFilter.from,
				filter_to: this.currentFilter.to
			});
		} else if (this.filtertype === 'equalto') {
			this.filtersItemArray.push({
				ff_field_name: this.currentFilter.ff_field_name,
				filter_type: 'Discrete',
				descrete_condition: this.equaltoFC,
				descrete_value: this.currentFilter.equalto
			});
		} else if (this.filtertype === 'discrete') {
			this.filtersItemArray.push({
				ff_field_name: this.currentFilter.ff_field_name,
				filter_type: 'Discrete',
				descrete_condition: '',
				descrete_value: this.currentFilter.discretevalue
			});
		}
		this.dynamicreport = false;
		this.filterdivtwo = false;
		this.sortdiv = false;
		this.filterone = true;
	}
	filterSubmit() {
		if (this.filtersItemArray.length > 0) {
			this.generateReportForm.patchValue({
				filters: this.filtersItemArray
			});
		}
		this.dynamicreport = true;
		this.filterdivtwo = false;
		this.sortdiv = false;
		this.filterone = false;
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
		this.sortbyform.reset();
		for (let popi = this.sortbyform.value.sort_param.length - 1; popi > 0; popi--) {
			this.deletesortParam(popi);
		}
		this.sortByItemArray = [];
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
	addSortBy() {
		this.sortByItemArray.push({
			ff_label: this.sortbyform.value.sortname.ff_label,
			ff_field_name: this.sortbyform.value.sortname.ff_field_name,
			Sorted: this.sortbyform.value.sortorder
		});
	}
	sortbyOk() {
		this.sortByItemArray = [];
		for (const item of this.sortbyform.value.sort_param) {
			if (item.sortname && item.sortorder) {
				this.sortByItemArray.push({
					ff_field_name: item.sortname.ff_field_name,
					Sorted: item.sortorder
				});
			}
		}
		this.generateReportForm.patchValue({
			orderby: this.sortByItemArray
		});
		this.dynamicreport = true;
		this.filterdivtwo = false;
		this.sortdiv = false;
		this.filterone = false;
	}
}
