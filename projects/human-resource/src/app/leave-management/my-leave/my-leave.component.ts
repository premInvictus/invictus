import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { CommonAPIService, SisService } from '../../_services/index';
import { DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from './../../hr-shared/preview-document/preview-document.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MyLeaveElement, SubordinateLeaveElement } from './my-leave.model';

@Component({
	selector: 'app-my-leave',
	templateUrl: './my-leave.component.html',
	styleUrls: ['./my-leave.component.css']
})
export class MyLeaveComponent implements OnInit {
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	leaveForm: FormGroup;
	leaveTypeArray: any[] = [];
	attachmentArray: any[] = [];
	@ViewChild('inputFile') myInputVariable: ElementRef;
	@ViewChild('myLeavePaginator') myLeavePaginator: MatPaginator;
	@ViewChild('subordinateLeavePaginator') subordinateLeavePaginator: MatPaginator;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('approveModal') approveModal;
	@ViewChild('rejectModal') rejectModal;
	@ViewChild(MatSort) sort: MatSort;
	myLeaveDisplayedColumns: string[] = ['srno', 'leave_date', 'leave_type', 'leave_balance', 'leave_no_of_days', 'leave_reason', 'action'];
	MY_LEAVE_ELEMENT_DATA: MyLeaveElement[] = [];
	myLeaveDataSource = new MatTableDataSource<MyLeaveElement>(this.MY_LEAVE_ELEMENT_DATA);

	subordinateDisplayedColumns: string[] = ['srno', 'emp_id', 'emp_name', 'leave_date', 'leave_type', 'leave_balance', 'leave_no_of_days', 'leave_reason', 'action'];
	SUBORDINATE_LEAVE_ELEMENT_DATA: SubordinateLeaveElement[] = [];
	subordinateLeaveDataSource = new MatTableDataSource<SubordinateLeaveElement>(this.SUBORDINATE_LEAVE_ELEMENT_DATA);
	currentTab = 0;
	showFormFlag = false;
	currentUser: any;
	employeeRecord: any;
	editFlag = false;
	approveMessage = 'Are you sure to Approve !';
	rejectMessage = 'Are you sure to Reject !';
	constructor(
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}


	ngOnInit() {
		this.getEmployeeDetail();
		this.buildForm();
		this.getLeaveType();
		this.getMyLeave();
	}

	ngAfterViewInit() {
		this.myLeaveDataSource.paginator = this.myLeavePaginator;
		this.subordinateLeaveDataSource.paginator = this.subordinateLeavePaginator;
	}

	myLeaveFilter(value: any) {
		this.myLeaveDataSource.filter = value.trim().toLowerCase();
	}

	subordinateLeaveFilter(value: any) {
		this.subordinateLeaveDataSource.filter = value.trim().toLowerCase();
	}

	buildForm() {
		this.leaveForm = this.fbuild.group({
			'leave_id':'',
			'leave_type': '',
			'leave_start_date': '',
			'leave_end_date': '',
			'leave_reason': '',
			'leave_attachment': '',
			'leave_status' : ''
		});
	}

	getEmployeeDetail() {
		var emp_login_id = this.currentUser ? this.currentUser.login_id : '';
		this.common.getAllEmployee({ emp_login_id: emp_login_id }).subscribe((result: any) => {
			var finResult = result ? result : []
			this.employeeRecord = finResult[0];
			console.log('employeeRecord', this.employeeRecord);
		});
	}

	getLeaveType() {
		this.common.getLeaveManagement().subscribe((result: any) => {
			this.leaveTypeArray = result;
		});
	}

	getMyLeave() {
		const datePipe = new DatePipe('en-in');
		this.MY_LEAVE_ELEMENT_DATA = [];
		this.myLeaveDataSource = new MatTableDataSource<MyLeaveElement>(this.MY_LEAVE_ELEMENT_DATA);
		this.common.getEmployeeLeaveData({ 'leave_from': this.currentUser ? this.currentUser.login_id : '' }).subscribe((result: any) => {
			if (result) {
				for (const item of result) {
					let pos = 1;
					var leave_request_schedule_data = item.leave_request_schedule_data;
					// for (var j = 0; j < leave_request_schedule_data.length; j++) {
					var dataJson = {
						srno: pos,
						leave_date: datePipe.transform(item.leave_start_date, 'MMMM d, y') + ' - ' + datePipe.transform(item.leave_end_date, 'MMMM d, y'),
						leave_type: item.leave_type.leave_type_name,
						leave_balance: '',
						leave_no_of_days: leave_request_schedule_data.length,
						status: 'Pending',
						leave_reason: item.leave_reason,
						action: item
					};
					this.MY_LEAVE_ELEMENT_DATA.push(dataJson);
					pos++;
					// }
				}
				this.myLeaveDataSource = new MatTableDataSource<MyLeaveElement>(this.MY_LEAVE_ELEMENT_DATA);
				this.myLeaveDataSource.paginator = this.myLeavePaginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.myLeavePaginator.pageIndex = 0);
					this.myLeaveDataSource.sort = this.sort;
				}
			}
		});
	}

	getSubordinateLeave() {
		const datePipe = new DatePipe('en-in');
		this.SUBORDINATE_LEAVE_ELEMENT_DATA = [];
		this.subordinateLeaveDataSource = new MatTableDataSource<SubordinateLeaveElement>(this.SUBORDINATE_LEAVE_ELEMENT_DATA);
		this.common.getEmployeeLeaveData({ 'leave_to': this.currentUser ? this.currentUser.login_id : '', 'leave_status' : '0' }).subscribe((result: any) => {
			if (result) {
				let pos = 1;
				for (const item of result) {
					var leave_request_schedule_data = item.leave_request_schedule_data;
					// for (var j = 0; j < leave_request_schedule_data.length; j++) {
					var dataJson = {
						srno: pos,
						emp_id: item.leave_emp_detail.emp_id,
						emp_name: item.leave_emp_detail.emp_name,
						leave_date: datePipe.transform(item.leave_start_date, 'MMMM d, y') + ' - ' + datePipe.transform(item.leave_end_date, 'MMMM d, y'),
						leave_type: item.leave_type.leave_type_name,
						leave_balance: '',
						leave_no_of_days: leave_request_schedule_data.length,
						status: 'Pending',
						leave_reason: item.leave_reason,
						action: item
					};
					this.SUBORDINATE_LEAVE_ELEMENT_DATA.push(dataJson);
					pos++;
					// }
				}

				this.subordinateLeaveDataSource = new MatTableDataSource<SubordinateLeaveElement>(this.SUBORDINATE_LEAVE_ELEMENT_DATA);
				this.subordinateLeaveDataSource.paginator = this.subordinateLeavePaginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.subordinateLeavePaginator.pageIndex = 0);
					this.subordinateLeaveDataSource.sort = this.sort;
				}
			}
		});
	}

	uploadAttachment(event) {
		var file = event.target.files[0];
		const fileReader: FileReader = new FileReader();
		fileReader.onload = (e) => {
			this.uploadImage(file.name, fileReader.result);
		};
		fileReader.readAsDataURL(file);		
	}

	uploadImage(fileName, au_profileimage) {
		this.sisService.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profileimage, module: 'employee-leave' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.attachmentArray = result.data;
				}
			});
	}

	changeTab(event) {
		this.currentTab = event.index;
		if (this.currentTab) {
			this.getSubordinateLeave();
		} else {
			this.getEmployeeDetail();
			this.getMyLeave();
		}
	}

	applyForLeave() {		
		this.showFormFlag = !this.showFormFlag;
		this.attachmentArray = [];
		this.reset();
	}

	reset() {
		this.leaveForm.reset();
	}

	submit() {
		if (this.leaveForm.valid) {
			const datePipe = new DatePipe('en-in');
			var inputJson = {};
			var startDate = datePipe.transform(this.leaveForm.value.leave_start_date, 'yyyy-MM-dd');
			var endDate = datePipe.transform(this.leaveForm.value.leave_end_date, 'yyyy-MM-dd');
			var leaveRequestScheduleData = [];
			var diffDay = this.getDaysDiff();
			inputJson['leave_to'] = this.employeeRecord['emp_supervisor_id'] ? this.employeeRecord['emp_supervisor_id'] : 5971;
			inputJson['leave_from'] = this.currentUser && this.currentUser.login_id ? this.currentUser.login_id : '';
			inputJson['leave_start_date'] = startDate;
			inputJson['leave_end_date'] = endDate;
			inputJson['leave_type'] = { "leave_type_id": this.leaveForm.value.leave_type, "leave_type_name": this.getLeaveTypeName(this.leaveForm.value.leave_type) && this.getLeaveTypeName(this.leaveForm.value.leave_type)[0] ? this.getLeaveTypeName(this.leaveForm.value.leave_type)[0] : '' };
			inputJson['leave_reason'] = this.leaveForm.value.leave_reason;
			inputJson['leave_attachment'] = this.attachmentArray;
			inputJson['leave_request_schedule_data'] = [];
			inputJson['leave_emp_detail'] = { 'emp_id': this.employeeRecord['emp_id'], 'emp_name': this.employeeRecord['emp_name'] };
			inputJson['leave_status'] = 0;
			var newStartDate = new Date(startDate);
			for (let i = 0; i <= diffDay; i++) {
				leaveRequestScheduleData.push({ "date": datePipe.transform(newStartDate, 'yyyy-MM-dd'), "type": "full", "time_from": "", "time_to": "", "status": { "status_name": "pending", "created_by": this.currentUser ? this.currentUser.login_id : '' } })
				newStartDate.setDate(newStartDate.getDate() + 1);
			}
			inputJson['leave_request_schedule_data'] = leaveRequestScheduleData;
			this.common.insertEmployeeLeaveData(inputJson).subscribe((result: any) => {
				if (result) {
					this.common.showSuccessErrorMessage('Leave Request Submitted Successfully', 'success');
					this.showFormFlag = false;
					this.getMyLeave();
				} else {
					this.common.showSuccessErrorMessage('Error While Submit Leave Request', 'error');
				}
			});
		} else {
			this.common.showSuccessErrorMessage('Please Fill Required Fields', 'error');
		}

	}

	update() {
		if (this.leaveForm.valid) {
			const datePipe = new DatePipe('en-in');
			var inputJson = {};
			var startDate = datePipe.transform(this.leaveForm.value.leave_start_date, 'yyyy-MM-dd');
			var endDate = datePipe.transform(this.leaveForm.value.leave_end_date, 'yyyy-MM-dd');
			var leaveRequestScheduleData = [];
			var diffDay = this.getDaysDiff();
			inputJson['leave_id'] = this.leaveForm.value.leave_id;
			inputJson['leave_to'] = this.employeeRecord['emp_supervisor_id'] ? this.employeeRecord['emp_supervisor_id'] : 5971;
			inputJson['leave_from'] = this.currentUser && this.currentUser.login_id ? this.currentUser.login_id : '';
			inputJson['leave_start_date'] = startDate;
			inputJson['leave_end_date'] = endDate;
			inputJson['leave_type'] = { "leave_type_id": this.leaveForm.value.leave_type, "leave_type_name": this.getLeaveTypeName(this.leaveForm.value.leave_type) && this.getLeaveTypeName(this.leaveForm.value.leave_type)[0] ? this.getLeaveTypeName(this.leaveForm.value.leave_type)[0] : '' };
			inputJson['leave_reason'] = this.leaveForm.value.leave_reason;
			inputJson['leave_attachment'] = this.attachmentArray;
			inputJson['leave_request_schedule_data'] = [];
			inputJson['leave_emp_detail'] = { 'emp_id': this.employeeRecord['emp_id'], 'emp_name': this.employeeRecord['emp_name'] };
			inputJson['leave_status'] = this.leaveForm.value.leave_status;
			var newStartDate = new Date(startDate);
			for (let i = 0; i <= diffDay; i++) {
				leaveRequestScheduleData.push({ "date": datePipe.transform(newStartDate, 'yyyy-MM-dd'), "type": "full", "time_from": "", "time_to": "", "status": { "status_name": "pending", "created_by": this.currentUser ? this.currentUser.login_id : '' } })
				newStartDate.setDate(newStartDate.getDate() + 1);
			}
			inputJson['leave_request_schedule_data'] = leaveRequestScheduleData;
			this.common.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
				if (result) {
					this.common.showSuccessErrorMessage('Leave Request Submitted Successfully', 'success');
					this.showFormFlag = false;
					this.getMyLeave();
				} else {
					this.common.showSuccessErrorMessage('Error While Submit Leave Request', 'error');
				}
			});
		} else {
			this.common.showSuccessErrorMessage('Please Fill Required Fields', 'error');
		}
	}



	deleteConfirm(item) {
			let inputJson = {};			
			inputJson['leave_id'] = item.leave_id;
			inputJson['leave_status'] = '5';
			this.common.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
				if (result) {
					this.common.showSuccessErrorMessage('Leave Request Delete Successfully', 'success');
					this.showFormFlag = false;
					this.getMyLeave();
				} else {
					this.common.showSuccessErrorMessage('Error While Delete Leave Request', 'error');
				}
			});
	} 

	

	deleteLeave(item) {
		this.deleteModal.openModal(item);
	}
	
	approveLeave(item) {
		item.text = this.approveMessage;
		this.approveModal.openModal(item);
	}

	approveConfirm(item) {
		let inputJson = {};			
		inputJson['leave_id'] = item.leave_id;
		inputJson['leave_status'] = '1';
		this.common.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
			if (result) {
				this.common.showSuccessErrorMessage('Leave Request Approved Successfully', 'success');
				this.showFormFlag = false;
				this.getSubordinateLeave();
			} else {
				this.common.showSuccessErrorMessage('Error While Approve Leave Request', 'error');
			}
		});
	} 

	rejectLeave(item) {
		item.text = this.rejectMessage;
		this.rejectModal.openModal(item);
		
	}

	rejectConfirm(item) {
		let inputJson = {};			
		inputJson['leave_id'] = item.leave_id;
		inputJson['leave_status'] = '2';
		this.common.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
			if (result) {
				this.common.showSuccessErrorMessage('Leave Request Reject Successfully', 'success');
				this.showFormFlag = false;
				this.getSubordinateLeave();
			} else {
				this.common.showSuccessErrorMessage('Error While Reject Leave Request', 'error');
			}
		});
	} 
	

	editLeave(item) {
		this.editFlag = true;
		console.log('item', item);
		this.showFormFlag = true;

		this.leaveForm.patchValue({
			'leave_id' :  item.leave_id,
			'leave_start_date' : 	item.leave_start_date ? this.common.dateConvertion(item.leave_start_date, 'yyyy-MM-dd') : '',
			'leave_end_date' : item.leave_end_date ? this.common.dateConvertion(item.leave_end_date, 'yyyy-MM-dd') : '',
			'leave_type' : item.leave_type.leave_type_id,
			'leave_reason' : item.leave_reason,
			'leave_attachment' : item.leave_attachment,
			'leave_status' : item.leave_status
		});
	}

	parseDate(str) {
		var mdy = str.split('-');
		return new Date(mdy[0], mdy[1] - 1, mdy[2]);
	}

	getDaysDiff() {
		const datePipe = new DatePipe('en-in');
		var date1 = datePipe.transform(this.leaveForm.value.leave_start_date, 'yyyy-MM-dd');
		var date2 = datePipe.transform(this.leaveForm.value.leave_end_date, 'yyyy-MM-dd');
		var parsedDate2: any = this.parseDate(date2);
		var parsedDate1: any = this.parseDate(date1);
		return Math.round((parsedDate2 - parsedDate1) / (1000 * 60 * 60 * 24));
	}

	getLeaveTypeName(leave_id) {
		return this.leaveTypeArray.map((f) => (Number(f['leave_id']) == Number(leave_id)) ? f['leave_name'] : '');
	}

	viewAttachment(item) {
		this.previewImage(item.leave_attachment, 0)
	}

	previewImage(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: imgArray,
				index: index
			},
			height: '100vh',
			width: '100vh'
		});
	}




}
