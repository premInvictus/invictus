import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FGModel } from './fee-group.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FeeService, SisService, CommonAPIService } from '../../_services';
import { CapitalizePipe } from '../../_pipes';
import { DecimalPipe } from '@angular/common';

@Component({
	selector: 'app-fee-group',
	templateUrl: './fee-group.component.html',
	styleUrls: ['./fee-group.component.scss']
})
export class FeeGroupComponent implements OnInit, AfterViewInit {

	@ViewChild('deleteModal') deleteModal;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('paginator') paginator: MatPaginator;
	ELEMENT_DATA: FGModel[] = [];
	displayedColumns: string[] = ['srno', 'groupname', 'feehead', 'description', 'status', 'action'];
	dataSource = new MatTableDataSource(this.ELEMENT_DATA);

	// member declaration
	feegroupform: FormGroup;
	feeheadArray: any[] = [];
	feegroupArray: any[] = [];
	updateFlag = false;
	fs_is_hostel_fee = 0;
	btnDisable = false;
	constructor(
		private fb: FormBuilder,
		private feeService: FeeService,
		private sisService: SisService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.buildForm();
		this.getFeeHeads();
		this.getFeeGroup();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	buildForm() {
		this.feegroupform = this.fb.group({
			fs_id: '',
			fs_name: '',
			fs_description: '',
			fs_classification: 'group',
			fs_status: '',
			fs_groups: ''
		});
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	getFeeHeads() {
		this.feeheadArray = [];
		this.feeService.getFeeHeads({ fh_is_hostel_fee: this.fs_is_hostel_fee }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeheadArray = result.data;
			}
		});
	}

	saveForm() {
		if (this.feegroupform.valid) {
			this.btnDisable = true;
			let apiactionname = '';
			if (!this.feegroupform.value.fs_id) {
				apiactionname = 'insertFeeGroup';
			} else {
				apiactionname = 'updateFeeGroup';
				this.updateFlag = false;
			}
			this.feegroupform.value['fs_is_hostel_fee'] = this.fs_is_hostel_fee;
			this.feeService[apiactionname](this.feegroupform.value).subscribe((result: any) => {
				this.btnDisable = false;
				if (result && result.status === 'ok') {
					this.getFeeGroup();
					this.feegroupform.reset();
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else {
			this.btnDisable = false;
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}

	getFeeGroup() {
		this.feegroupArray = [];
		this.feeService.getFeeGroup({ fs_is_hostel_fee: this.fs_is_hostel_fee }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feegroupArray = result.data;
				this.ELEMENT_DATA = [];
				let srno = 0;
				if (this.feegroupArray.length > 0) {
					this.feegroupArray.forEach(item => {
						let feeHead = '';
						const pushitem: any = {};
						if (item.fs_groups && item.fs_groups.length > 0) {
							for (const item1 of item.fs_groups) {
								feeHead = feeHead +  '<b><u>' + new CapitalizePipe().transform(item1.fh_name) + '(' + item1.ft_name + ')'  + '</u></b><br>';
								let classAmt = '';
								if (item1.fh_class_amount_detail &&
									JSON.parse(item1.fh_class_amount_detail).length > 0) {
										for (const titem of JSON.parse(item1.fh_class_amount_detail)) {
											classAmt = classAmt + 'Class ' +
											titem.class_name +  ' :' + new DecimalPipe('en-us').transform(titem.head_amt) + ', ' ;
										}
										classAmt = classAmt.substring(0, classAmt.length - 2);
								}
								feeHead = feeHead + classAmt + '<br>';
							}
						}
						pushitem.srno = ++srno;
						pushitem.groupname = item.fs_name;
						pushitem.feehead = feeHead;
						pushitem.description = item.fs_description;
						pushitem.status = item.fs_status === '1' ? true : false;
						pushitem.action = item;
						this.ELEMENT_DATA.push(pushitem);
					});
					this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.dataSource.sort = this.sort;
				}
			} else {
				this.ELEMENT_DATA = [];
				this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.dataSource.sort = this.sort;
			}
			this.feegroupform.reset();
		});
	}
	editFeeGroup(value) {
		console.log(value);
		this.updateFlag = true;
		this.setFeeGroup(value);
	}
	getFeeheadFromGroup(value) {
		console.log(value);
		const fs_heads = [];
		if (value && value.length > 0) {
			for (const item of value) {
				fs_heads.push(item.fh_id);
			}
		}
		return fs_heads;
	}
	setFeeGroup(value) {
		console.log(this.getFeeheadFromGroup(value.fs_groups));
		this.feegroupform.patchValue({
			fs_id: value.fs_id,
			fs_name: value.fs_name,
			fs_description: value.fs_description,
			fs_classification: value.fs_classification,
			fs_status: value.fs_status,
			fs_groups: this.getFeeheadFromGroup(value.fs_groups)
		});
	}
	deleteConfirm(value, status = '5') {
		// console.log(value,status);
		if (value) {
			value.fs_status = status;
		}
		this.feeService.deleteFeeGroup(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getFeeGroup();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	toggleFeeHeadStatus($event, value: any) {
		if ($event.checked) {
			this.deleteConfirm(value, '1');
		} else {
			this.deleteConfirm(value, '0');
		}
	}
	cancelForm() {
		this.btnDisable = false;
		this.updateFlag = false;
		this.feegroupform.reset();
	}

	changeIsHostelFee(event) {
		this.btnDisable = false;
		if (event.checked) {
			this.fs_is_hostel_fee = 1;
		} else {
			this.fs_is_hostel_fee = 0;
		}
		this.getFeeHeads();
		this.getFeeGroup();
	}
}
