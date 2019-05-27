import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, ErrorStateMatcher, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { ConGroupElement } from './concession-group.model';
import { CommonAPIService, FeeService } from '../../_services/index';
import { ConfirmValidParentMatcher } from '../../_validationclass/confirmValidParentMatcher.class';
import { DecimalPipe } from '@angular/common';
@Component({
	selector: 'app-concession-group',
	templateUrl: './concession-group.component.html',
	styleUrls: ['./concession-group.component.scss']
})

export class ConcessionGroupComponent implements OnInit, AfterViewInit {
	displayedColumns: string[] = ['position', 'groupname', 'category', 'description', 'status', 'action'];
	conccesionCategoryForm: FormGroup;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	constructor(private fbuild: FormBuilder,
		private common: CommonAPIService,
		private feeService: FeeService) { }
	CONCESSION_GROUP_ELEMENT_DATA: ConGroupElement[] = [];
	dataSource = new MatTableDataSource<ConGroupElement>(this.CONCESSION_GROUP_ELEMENT_DATA);
	concessionArray: any[] = [];
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModal') deleteModal;
	editFlag = false;
	ngOnInit() {
		this.buildForm();
		this.getConcessionGroups();
		this.getConcessionCategories();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);

	buildForm() {
		this.conccesionCategoryForm = this.fbuild.group({
			fcg_id: '',
			fcg_name: '',
			fcg_description: '',
			fcgr_fcc_id: [],
			fcg_status: '1'
		});
	}
	submit() {
		if (!this.conccesionCategoryForm.valid) {
			this.conccesionCategoryForm.markAsDirty();
		} else {
			this.conccesionCategoryForm.markAsPristine();
			this.conccesionCategoryForm.updateValueAndValidity();
			this.feeService.insertConcessionGroup(this.conccesionCategoryForm.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Concession Group Inserted Succesfully', 'success');
					this.getConcessionGroups();
					this.conccesionCategoryForm.reset();
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
					this.conccesionCategoryForm.reset();
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
	getConcessionGroups() {
		this.CONCESSION_GROUP_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<ConGroupElement>(this.CONCESSION_GROUP_ELEMENT_DATA);
		this.feeService.getConcessionGroup({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					this.CONCESSION_GROUP_ELEMENT_DATA.push({
						position: pos,
						con_categories: item.fcgr_fcc_id,
						con_des: item.fcg_description,
						gr_name: item.fcg_name,
						totalConcession: '',
						action: item
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<ConGroupElement>(this.CONCESSION_GROUP_ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe((() => this.paginator.pageIndex = 0));
				this.dataSource.sort = this.sort;
			}
			this.conccesionCategoryForm.reset();
		});
	}
	getConcessionCategories() {
		this.feeService.getConcessionCategory({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.concessionArray = result.data;
			}
		});
	}
	deleteConfirm(value: any) {
		this.feeService.deleteConcessionGroup({ fcg_id: value.fcg_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Deleted Successfully', 'success');
				this.getConcessionGroups();
			}
		});
	}
	getGroupName(groupArray) {
		let concessionGroup = '';
		for (const item of groupArray) {
			for (const titem of this.concessionArray) {
				if (item === titem.fcc_id) {
					concessionGroup = concessionGroup + titem.fcc_name + ',';
					break;
				}
			}
		}
		return concessionGroup;
	}
	patchValue(value: any) {
		this.editFlag = true;
		this.conccesionCategoryForm.patchValue({
			fcg_id: value.fcg_id,
			fcg_name: value.fcg_name,
			fcg_description: value.fcg_description,
			fcgr_fcc_id: this.getConcessionId(value.fcgr_fcc_id),
			fcg_status: value.fcg_status
		});
	}
	getConcessionId(array) {
		const conArray: any[] = [];
		for (const item of array) {
			conArray.push(item.fcc_id);
		}
		return conArray;
	}
	changeStatus($event, value: any) {
		let finalJSon = {};
		if ($event.checked) {
			finalJSon = {
				fcg_status: '1',
				fcg_id: value.fcg_id ? value.fcg_id : '',
				fcgr_fcc_id: value.fcgr_fcc_id,
				fcg_name: value.fcg_name,
				fcg_description: value.fcg_description,
			};
		} else {
			finalJSon = {
				fcg_status: '0',
				fcg_id: value.fcg_id ? value.fcg_id : '',
				fcgr_fcc_id: value.fcgr_fcc_id,
				fcg_name: value.fcg_name,
				fcg_description: value.fcg_description,
			};
		}
		this.feeService.updateConcessionGroup(finalJSon).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Updated Successfully', 'success');
				this.getConcessionGroups();
			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	update() {
		if (!this.conccesionCategoryForm.valid) {
			this.conccesionCategoryForm.markAsDirty();
		} else {
			this.conccesionCategoryForm.markAsPristine();
			this.conccesionCategoryForm.updateValueAndValidity();
			this.feeService.updateConcessionGroup(this.conccesionCategoryForm.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage('Concession Group Updated Succesfully', 'success');
					this.editFlag = false;
					this.getConcessionGroups();
					this.conccesionCategoryForm.reset();
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
					this.editFlag = false;
					this.conccesionCategoryForm.reset();
				}
			});
		}
	}
	getTotalConcession(totCon) {
		if (totCon && totCon.length > 0) {
			let className = '';
			for (const item of totCon) {
				className = className + 'Class ' +  item.class_name + ': ' + new DecimalPipe('en-in').transform(item.total_concession) + ' ,';
			}
			className = className.substring(0, className.length - 2);
			return className;
		}
	}
}
