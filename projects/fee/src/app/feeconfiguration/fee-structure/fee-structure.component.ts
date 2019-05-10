import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FSModel } from './fee-structure.model';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { FeeService, SisService, CommonAPIService } from '../../_services';
@Component({
	selector: 'app-fee-structure',
	templateUrl: './fee-structure.component.html',
	styleUrls: ['./fee-structure.component.scss']
})
export class FeeStructureComponent implements OnInit, AfterViewInit {

	@ViewChild('deleteModal') deleteModal;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('paginator') paginator: MatPaginator;
	ELEMENT_DATA: FSModel[] = [];
	displayedColumns: string[] = ['srno', 'feestructurename', 'feehead', 'description', 'status', 'action'];
	dataSource = new MatTableDataSource(this.ELEMENT_DATA);
	feestructureform: FormGroup;
	feeheadArray: any[] = [];
	feegroupArray: any[] = [];
	headgroupArray: any[] = [];
	feestructureArray: any[] = [];
	updateFlag = false;
	fs_is_hostel_fee = 0;
	constructor(
		private fb: FormBuilder,
		private feeService: FeeService,
		private sisService: SisService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.buildForm();
		this.getFeeHeads();
		this.getFeeStructure();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	buildForm() {
		this.feestructureform = this.fb.group({
			fs_id: '',
			fs_name: '',
			fs_description: '',
			fs_classification: 'structure',
			fs_status: '',
			fs_groups: ''
		});
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	getFeeHeads() {
		this.feeheadArray = [];
		this.headgroupArray = [];
		this.feeService.getFeeHeads({fh_is_hostel_fee: this.fs_is_hostel_fee}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeheadArray = result.data;
				for (const item of this.feeheadArray) {
					const pushitem: any = {};
					pushitem.id = 'H-' + item.fh_id;
					pushitem.name = item.fh_name;
					this.headgroupArray.push(pushitem);
				}
				this.getFeeGroup();
			}
		});
	}
	getFeeGroup() {
		this.feegroupArray = [];
		this.feeService.getFeeGroup({fs_is_hostel_fee: this.fs_is_hostel_fee}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feegroupArray = result.data;
				for (const item of this.feegroupArray) {
					const pushitem: any = {};
					pushitem.id = 'G-' + item.fs_id;
					pushitem.name = item.fs_name;
					this.headgroupArray.push(pushitem);
				}
			}
		});
	}
	saveForm() {
		if (this.feestructureform.valid) {
			let apiactionname = '';
			if (!this.feestructureform.value.fs_id) {
				apiactionname = 'insertFeeStructure';
			} else {
				apiactionname = 'updateFeeStructure';
				this.updateFlag = false;
			}
			this.feestructureform.value['fs_is_hostel_fee'] = this.fs_is_hostel_fee;
			this.feeService[apiactionname](this.feestructureform.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.getFeeStructure();
					this.feestructureform.reset();
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	getFeeStructure() {
		this.feestructureArray = [];
		this.ELEMENT_DATA = [];
		this.feeService.getFeeStructure({fs_is_hostel_fee: this.fs_is_hostel_fee}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feestructureArray = result.data;
				console.log(this.feestructureArray);
				let srno = 0;
				if (this.feestructureArray.length > 0) {
					this.feestructureArray.forEach(item => {
						const pushitem: any = {};
						pushitem.feehead = [];
						const itemhead: any[] = [];
						if (item.fs_structure && item.fs_structure.length > 0) {
							let atotal = 0;
							for (const item1 of item.fs_structure) {
								const pushitemhead: any = {};
								if (item1.fc_classfication === 'head') {
									pushitemhead.name = item1.fh_name;
									pushitemhead.amount = item1.fh_amount;
									pushitemhead.total = item1.fh_amount * item1.fh_fm_id.length;
									pushitemhead.ft_name = item1.ft_name;

								} else if (item1.fc_classfication === 'group') {
									pushitemhead.name = item1.fs_name;
									pushitemhead.amount = '';
									if (item1.fee_groups && item1.fee_groups.length > 0) {
										let total = 0;
										for (const item2 of item1.fee_groups) {
											total += (item2.fh_amount * item2.fh_fm_id.length);
										}
										pushitemhead.ft_name = item1.fee_groups[0].ft_name;
										pushitemhead.total = total;
									}
								}
								atotal += pushitemhead.total;
								itemhead.push(pushitemhead);
							}
							pushitem.feehead = itemhead;
							item.total = atotal;
						}

						pushitem.srno = ++srno;
						pushitem.feestructurename = item.fs_name;
						pushitem.description = item.fs_description;
						pushitem.status = item.fs_status === '1' ? true : false;
						pushitem.action = item;
						this.ELEMENT_DATA.push(pushitem);
					});
					console.log(this.ELEMENT_DATA);
					this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.dataSource.sort = this.sort;
				}
			} else {
				this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.dataSource.sort = this.sort;
			}
			this.feestructureform.reset();
		});
	}
	toggleFeeStructureStatus($event, value: any) {
		if ($event.checked) {
			this.deleteConfirm(value, '1');
		} else {
			this.deleteConfirm(value, '0');
		}
	}
	editFeeStructure(value) {
		console.log(value);
		this.updateFlag = true;
		this.setFeeStructure(value);
	}
	setFeeStructure(value) {
		console.log(this.getFeeheadFromGroup(value.fs_groups));
		this.feestructureform.patchValue({
			fs_id: value.fs_id,
			fs_name: value.fs_name,
			fs_description: value.fs_description,
			fs_classification: value.fs_classification,
			fs_status: value.fs_status,
			fs_groups: this.getFeeheadFromGroup(value.fs_structure)
		});
	}
	getFeeheadFromGroup(value) {
		console.log(value);
		const fs_heads = [];
		if (value && value.length > 0) {
			for (const item of value) {
				if (item.fc_classfication === 'head') {
					fs_heads.push('H-' + item.fc_fh_fs_id);
				} else if (item.fc_classfication === 'group') {
				fs_heads.push('G-' + item.fc_fh_fs_id);
								}
			}
		}
		return fs_heads;
	}
	deleteConfirm(value,  status= '5') {
		// console.log(value,status);
		if (value) {
			value.fs_status = status;
		}
		this.feeService.deleteFeeStructure(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getFeeStructure();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	cancelForm() {
		this.updateFlag = false;
		this.feestructureform.reset();
	}

	changeIsHostelFee(event) {
		if (event.checked) {
			this.fs_is_hostel_fee = 1;
		} else {
			this.fs_is_hostel_fee = 0;
		}
		this.getFeeHeads();
		this.getFeeStructure();
	}
}
