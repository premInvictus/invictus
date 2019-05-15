import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { EditRequestElement } from './edit-request.model';
import { SisService, CommonAPIService } from '../../_services/index';
import { DatePipe } from '@angular/common';
import { InvoiceDetailsModalComponent } from '../../feemaster/invoice-details-modal/invoice-details-modal.component';
@Component({
	selector: 'app-edit-requests',
	templateUrl: './edit-requests.component.html',
	styleUrls: ['./edit-requests.component.scss']
})
export class EditRequestsComponent implements OnInit {
	displayedColumns: string[] = [
		'no',
		'request',
		'priority',
		'date',
		'requestedby',
		'tabName',
		'status',
		'action'
	];
	EDIT_REQUEST_ELEMENT_DATA: EditRequestElement[] = [];
	editRequestDataSource = new MatTableDataSource<EditRequestElement>(this.EDIT_REQUEST_ELEMENT_DATA);
	tabsArray: any[] = [];
	viewRequestFlag = false;
	changedFormArray: any[] = [];
	finalChangedFormArray: any[] = [];
	formFields: any[] = [];
	requestFields: any[] = [];
	editArray: any[] = [];
	counter = 0;
	getValuePosition: any = '';
	req_remarks: any = '';
	showTable = false;
	datePipe = new DatePipe('en-in');
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModal') deleteModal;
	reqPriority: any;
	reqReason: any;
	reqRemarks: any;
	confirmMessage: any = 'Are you sure you want to approve?';
	constructor(
		private commonService: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
	) { }

	ngOnInit() {
		this.editRequestDataSource.sort = this.sort;
		this.getTabs();
	}

	openDeleteDialog = (data) => {
		this.deleteModal.openModal(data);
	}
	applyFilter(filterValue: string) {
		this.editRequestDataSource.filter = filterValue.trim().toLowerCase();
	}
	getTabs() {
		this.sisService.getTabBifurcation().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.tabsArray = result.data;
				this.EDIT_REQUEST_ELEMENT_DATA = [];
				this.editRequestDataSource = new MatTableDataSource<EditRequestElement>(this.EDIT_REQUEST_ELEMENT_DATA);
				this.sisService.getEditRequest({}).subscribe((result2: any) => {
					if (result2.status === 'ok') {
						this.editArray = [];
						this.editArray = result2.data;
						let pos = 1;
						for (const item of this.editArray) {
							this.EDIT_REQUEST_ELEMENT_DATA.push({
								no: pos,
								request: item.req_id,
								priority: item.req_priority,
								date: this.datePipe.transform(item.req_date, 'd-MMM-y'),
								requestedby: item.req_by,
								processType: item.req_process_type,
								tabName: this.getTabName(item.req_tab_id, this.tabsArray),
								action: item,
								req_custom_data: item.req_custom_data ? JSON.parse(item.req_custom_data) : null,
								status: item.req_status
							});
							pos++;
						}
						this.editRequestDataSource = new MatTableDataSource<EditRequestElement>(this.EDIT_REQUEST_ELEMENT_DATA);
						this.showTable = true;
						if (this.getValuePosition !== '') {
							this.viewRequest(this.EDIT_REQUEST_ELEMENT_DATA[Number(this.getValuePosition) - 1].action, this.getValuePosition);
						}
					} else {
						this.showTable = false;
						this.commonService.showSuccessErrorMessage('No request found', 'error');
					}
				});
			}
		});
	}
	getTabName(tab_id: any, array: any[]) {
		const findex = array.findIndex(f => f.tb_id === tab_id);
		if (findex !== -1) {
			return array[findex]['tb_name'];
		}
	}
	viewRequest(value: any, index) {
		console.log('value', value);
		this.getValuePosition = index;
		this.sisService.getFormFields({
			ff_tb_id: value.req_tab_id
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formFields = [];
				this.formFields = result.data;
				this.reqPriority = value.req_priority;
				this.reqReason = value.req_reason;
				this.reqRemarks = value.req_remarks;
				this.counter = 0;
				this.req_remarks = '';
				this.changedFormArray = [];
				this.requestFields = [];
				this.finalChangedFormArray = [];
				this.viewRequestFlag = false;
				this.changedFormArray = value.reqField;
				if (this.changedFormArray.length > 0) {
					for (const item of this.changedFormArray) {
						if (item.rff_field_name.charAt(0) === '[') {
							if (Number(item.rff_status) === 1) {
								this.counter++;
								this.requestFields.push({
									rff_id: item.rff_id,
									rff_req_id: item.rff_req_id,
									rff_status: item.rff_status
								});
							}
							this.finalChangedFormArray.push({
								ff_custom_status: item.ff_custom_status,
								ff_field_name: item.ff_field_name,
								rff_custom_data: item.rff_custom_data ? item.rff_custom_data : null,
								ff_field_type: item.ff_field_type,
								ff_field_type_value: item.ff_field_type_value,
								ff_id: item.ff_id,
								ff_label: item.ff_label,
								ff_tb_id: item.ff_tb_id,
								rff_field_name: JSON.parse(item.rff_field_name),
								rff_id: item.rff_id,
								rff_new_field_value: JSON.parse(item.rff_new_field_value),
								rff_old_field_value: JSON.parse(item.rff_old_field_value),
								rff_new_value: item.rff_new_value,
								rff_old_value: item.rff_old_value,
								rff_req_id: item.rff_req_id,
								rff_status: item.rff_status,
								rff_where_id: item.rff_where_id,
								rff_where_value: item.rff_where_value
							});
						} else {
							if (Number(item.rff_status) === 1) {
								this.counter++;
								this.requestFields.push({
									rff_id: item.rff_id,
									rff_req_id: item.rff_req_id,
									rff_status: item.rff_status
								});
							}
							this.finalChangedFormArray.push({
								ff_custom_status: item.ff_custom_status,
								ff_field_name: item.ff_field_name,
								rff_custom_data: item.rff_custom_data ? item.rff_custom_data : null,
								ff_field_type: item.ff_field_type,
								ff_field_type_value: item.ff_field_type_value,
								ff_id: item.ff_id,
								ff_label: item.ff_label,
								ff_tb_id: item.ff_tb_id,
								rff_field_name: item.rff_field_name,
								rff_id: item.rff_id,
								rff_new_field_value: item.rff_new_field_value,
								rff_old_field_value: item.rff_old_field_value,
								rff_new_value: item.rff_new_value,
								rff_old_value: item.rff_old_value,
								rff_req_id: item.rff_req_id,
								rff_status: item.rff_status,
								rff_where_id: item.rff_where_id,
								rff_where_value: item.rff_where_value
							});
						}
					}
					this.viewRequestFlag = true;
				} else {
					this.commonService.showSuccessErrorMessage('Sorry no request found', 'error');
					this.viewRequestFlag = false;
				}
			}
		});
	}
	getFieldName(field_name) {
		const findex = this.formFields.findIndex(f => f.ff_field_name === field_name);
		if (findex !== -1) {
			return this.formFields[findex]['ff_label'];
		}
	}
	isArray(obj) {
		return Array.isArray(obj);
	}
	getRequestedId($event, req_id) {
		console.log('getRequestedId', req_id, $event.source.value);
		console.log('requestFields', this.requestFields);
		const findex = this.requestFields.findIndex(f => f.rff_id === $event.source.value);
		if (findex === -1) {
			this.requestFields.push({ rff_id: $event.source.value, rff_req_id: req_id });
			this.counter++;
		} else {
			this.requestFields.splice(findex, 1);
			this.counter--;
		}
	}
	approveRequest(event) {
		const rff_id: any[] = [];
		for (const item of event.data) {
			if (!item.rff_status) {
				rff_id.push(item.rff_id);
			}
		}
		if (event.data.length > 0) {
			const param: any = {};
			if (this.counter === this.finalChangedFormArray.length) {
				param.rff_req_id = event.data[0].rff_req_id;
				param.rff_id = rff_id;
				param.req_id = event.data[0].rff_req_id;
			} else {
				param.rff_req_id = event.data[0].rff_req_id;
				param.rff_id = rff_id;
				param.req_id = '';
			}
			if (event.status === 'decline') {
				param.status = '5';
			}
			this.sisService.updateEditRequest(param).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage(result.data, 'success');
					this.getTabs();
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please check a form field value ', 'error');
		}
	}
	returnParseValue(value: any) {
		return JSON.parse(value);
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonService.isExistUserAccessMenu(mod_id);
	}
	deleteCancel() { }
	openDialog(req_custom_data): void {
		if (req_custom_data.belongsTo === 'invoice') {
			const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
				width: '80%',
				height: '75%',
				data: {
					invoiceNo: req_custom_data.belongsToFieldValue,
					edit: false
				}
			});
		}
	}
}
