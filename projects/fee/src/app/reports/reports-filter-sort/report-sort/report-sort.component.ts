import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SisService, CommonAPIService, FeeService } from '../../../_services/index';

@Component({
	selector: 'app-report-sort',
	templateUrl: './report-sort.component.html',
	styleUrls: ['./report-sort.component.scss']
})
export class ReportSortComponent implements OnInit {
	filterArray = [];
	sortbyform: FormGroup;
	availableArray: any;
	sortByItemArray: any[];
	constructor(public dialogRef: MatDialogRef<ReportSortComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fbuild: FormBuilder,
		private sisService: SisService,
		private feeService: FeeService,
		private commonAPIService: CommonAPIService) { }

	ngOnInit() {
		this.buildForm();
		this.getFormFieldsForFilter('filter');
	}
	buildForm() {
		this.sortbyform = this.fbuild.group({
			sort_param: this.fbuild.array([this.fbuild.group({
				sortname: '',
				sortorder: ''
			})])
		});
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
				}
			}
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
	}
	addSortBy() {
		this.sortByItemArray.push({
			ff_label: this.sortbyform.value.sortname.ff_label,
			ff_field_name: this.sortbyform.value.sortname.ff_field_name,
			Sorted: this.sortbyform.value.sortorder
		});
	}
	gobacktodynamicreport() {
		this.dialogRef.close();
	}
}
