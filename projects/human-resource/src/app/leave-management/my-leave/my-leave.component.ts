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
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { Key } from 'protractor';

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
	myLeaveDisplayedColumns: string[] = ['srno', 'leave_date', 'leave_type', 'leave_no_of_days', 'leave_reason', 'action'];
	MY_LEAVE_ELEMENT_DATA: MyLeaveElement[] = [];
	myLeaveDataSource = new MatTableDataSource<MyLeaveElement>(this.MY_LEAVE_ELEMENT_DATA);

	subordinateDisplayedColumns: string[] = ['srno', 'emp_id', 'emp_name', 'leave_date', 'leave_type', 'leave_no_of_days', 'leave_reason', 'action'];
	SUBORDINATE_LEAVE_ELEMENT_DATA: SubordinateLeaveElement[] = [];
	subordinateLeaveDataSource = new MatTableDataSource<SubordinateLeaveElement>(this.SUBORDINATE_LEAVE_ELEMENT_DATA);
	currentTab = 0;
	showFormFlag = false;
	currentUser: any;
	employeeRecord: any;
	editFlag = false;
	principal: any;
	approveMessage = 'Are you sure to Approve !';
	rejectMessage = 'Are you sure to Reject !';
	approvedArray: any[] = [];
	finalapprovedArray: any[] = [];
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
		this.getMyLeave();
		this.getLeaveType();
		this.getPrincipal();
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

	}
	getPrincipal() {
		const filterJSON = {
			"generalFilters": {
				"emp_designation_detail.des_id": [1]
			}
		};
		this.common.getFilterData(filterJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.principal = result.data[0].emp_login_id;
			}
		});
	}

	getEmployeeDetail() {
		var emp_login_id = this.currentUser ? this.currentUser.login_id : '';
		this.common.getAllEmployee({ emp_login_id: emp_login_id }).subscribe((result: any) => {
			var finResult = result ? result : []
			this.employeeRecord = finResult[0];
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
				let pos = 1;
				for (const item of result) {
					var leave_request_schedule_data = item.leave_request_schedule_data;
					var dataJson = {
						srno: pos,
						leave_date: datePipe.transform(item.leave_start_date, 'MMMM d, y') + ' - ' + datePipe.transform(item.leave_end_date, 'MMMM d, y'),
						leave_type: item.leave_type.leave_type_name,
						leave_no_of_days: leave_request_schedule_data.length,
						status: 'Pending',
						leave_reason: item.leave_reason,
						action: item
					};
					this.MY_LEAVE_ELEMENT_DATA.push(dataJson);
					pos++;
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
		this.common.getEmployeeLeaveData({ 'leave_to': this.currentUser ? this.currentUser.login_id : '', 'leave_status': '0' }).subscribe((result: any) => {
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
	reset() {
		this.leaveForm.reset();
	}

	submit(result, attachment) {
		const datePipe = new DatePipe('en-in');
		var inputJson = {};
		var startDate = datePipe.transform(result.leave_start_date, 'yyyy-MM-dd');
		var endDate = datePipe.transform(result.leave_end_date, 'yyyy-MM-dd');
		var leaveRequestScheduleData = [];
		var diffDay = this.getDaysDiff(result);
		inputJson['leave_to'] = this.employeeRecord.emp_supervisor ? this.employeeRecord.emp_supervisor.id : this.principal;
		inputJson['leave_from'] = this.currentUser && this.currentUser.login_id ? this.currentUser.login_id : '';
		inputJson['leave_start_date'] = startDate;
		inputJson['leave_end_date'] = endDate;
		inputJson['leave_type'] = { "leave_type_id": result.leave_type, "leave_type_name": this.getLeaveTypeName(result.leave_type) };
		inputJson['leave_reason'] = result.leave_reason;
		inputJson['leave_attachment'] = attachment;
		inputJson['leave_request_schedule_data'] = [];
		inputJson['leave_emp_detail'] = { 'emp_id': this.employeeRecord['emp_id'], 'emp_name': this.employeeRecord['emp_name'] };
		inputJson['leave_status'] = 0;
		inputJson['leave_role'] = this.currentUser.role_id;
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

	}

	update(result, attachment) {
		const datePipe = new DatePipe('en-in');
		var inputJson = {};
		var startDate = datePipe.transform(result.leave_start_date, 'yyyy-MM-dd');
		var endDate = datePipe.transform(result.leave_end_date, 'yyyy-MM-dd');
		var leaveRequestScheduleData = [];
		var diffDay = this.getDaysDiff(result);
		inputJson['leave_id'] = result.leave_id;
		inputJson['leave_to'] = this.employeeRecord.emp_supervisor ? this.employeeRecord.emp_supervisor.id : this.principal;;
		inputJson['leave_from'] = this.currentUser && this.currentUser.login_id ? this.currentUser.login_id : '';
		inputJson['leave_start_date'] = startDate;
		inputJson['leave_end_date'] = endDate;
		inputJson['leave_type'] = { "leave_type_id": result.leave_type, "leave_type_name": this.getLeaveTypeName(result.leave_type) };
		inputJson['leave_reason'] = result.leave_reason;
		inputJson['leave_attachment'] = attachment;
		inputJson['leave_request_schedule_data'] = [];
		inputJson['leave_emp_detail'] = { 'emp_id': this.employeeRecord['emp_id'], 'emp_name': this.employeeRecord['emp_name'] };
		inputJson['leave_status'] = result.leave_status;
		inputJson['leave_role'] = this.currentUser.role_id;
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
		this.finalapprovedArray = [];
		this.approvedArray = [];
		var months = [
			'', 'January', 'February', 'March', 'April', 'May',
			'June', 'July', 'August', 'September',
			'October', 'November', 'December'
		];
		let monthJson = {};
		let employeeArrData = [];
		let inputJson = {};
		inputJson['leave_id'] = item.leave_id;
		inputJson['leave_status'] = '1';
		var current, previous;
		for (const det of item.leave_request_schedule_data) {
			current = new Date(det.date).getMonth() + 1;
			if (current === previous) {
				Object.keys(monthJson).forEach((key: any) => {
					if (key === 'month_id' && Number(monthJson[key]) === Number(current)) {
						monthJson['attendance_detail'].emp_leave_approved.leave_credit_count = Number(monthJson['attendance_detail'].emp_leave_approved.leave_credit_count) + 1;
						monthJson['attendance_detail'].emp_leave_granted = Number(monthJson['attendance_detail'].emp_leave_granted) + 1;
					}
				});

			} else {
				monthJson = {
					"month_id": current,
					"month_name": months[Number(current)],
					"attendance_detail": {
						"emp_leave_approved": {
							"leave_id": item.leave_type.leave_type_id,
							"leave_name": item.leave_type.leave_type_name,
							"leave_credit_count": 1
						},
						"emp_leave_granted": 1
					}

				}
				employeeArrData.push(monthJson);
				previous = current;
			}
		}
		if (employeeArrData.length > 0) {
			var emp_login_id = item.leave_from ? item.leave_from : '';
			this.common.getAllEmployee({ emp_login_id: emp_login_id }).subscribe((result: any) => {
				var finResult = result ? result : []
				this.approvedArray.push(finResult[0].emp_month_attendance_data.month_data);
				for (const dety of employeeArrData) {
					const findex = this.approvedArray[0].findIndex(e => Number(e.month_id) === Number(dety.month_id));
					if (findex !== -1) {
						if (this.approvedArray[0][findex].attendance_detail.emp_leave_approved) {
							if (Number(this.approvedArray[0][findex].attendance_detail.emp_leave_approved.leave_id) === Number(dety.attendance_detail.emp_leave_approved.leave_id)) {
								this.approvedArray[0][findex].attendance_detail.emp_leave_approved.leave_credit_count =
									Number(this.approvedArray[0][findex].attendance_detail.emp_leave_approved.leave_credit_count) +
									Number(dety.attendance_detail.emp_leave_approved.leave_credit_count);
							} else {
								this.approvedArray[0][findex].attendance_detail.emp_leave_approved.push(dety.attendance_detail.emp_leave_approved);
							}

						} else {
							this.approvedArray[0][findex].attendance_detail['emp_leave_approved'] = dety.attendance_detail.emp_leave_approved;
						}
						if (this.approvedArray[0][findex].attendance_detail.emp_leave_granted) {
							this.approvedArray[0][findex].attendance_detail.emp_leave_granted =
								Number(this.approvedArray[0][findex].attendance_detail.emp_leave_granted) + Number(dety.attendance_detail.emp_leave_approved.leave_credit_count);
						} else {
							this.approvedArray[0][findex].attendance_detail['emp_leave_granted'] = dety.attendance_detail.emp_leave_approved.leave_credit_count;
						}
					} else {
						this.approvedArray[0].push(dety);
					}
				}
				let approvedjson = {};
				approvedjson = {
					emp_id: item.leave_emp_detail.emp_id,
					emp_month_attendance_data: {
						month_data: this.approvedArray[0]
					}
				}
				console.log(item.leave_emp_detail.emp_id);
				this.common.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
					if (result) {
						this.common.updateEmployee(approvedjson).subscribe((approved_result: any) => {
							if (approved_result) {
								this.common.showSuccessErrorMessage('Leave Request Approved Successfully', 'success');
								this.showFormFlag = false;
								this.getSubordinateLeave();
							}
						});
					} else {
						this.common.showSuccessErrorMessage('Error While Approve Leave Request', 'error');
					}
				});
			});
		}

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
		const dialogRef = this.dialog.open(LeaveApplicationComponent, {
			width: '30%',
			height: '55%',
			data: item
		});
		dialogRef.afterClosed().subscribe(dresult => {
			this.update(dresult.data, dresult.attachment);
		});
	}

	parseDate(str) {
		var mdy = str.split('-');
		return new Date(mdy[0], mdy[1] - 1, mdy[2]);
	}

	getDaysDiff(result) {
		const datePipe = new DatePipe('en-in');
		var date1 = datePipe.transform(result.leave_start_date, 'yyyy-MM-dd');
		var date2 = datePipe.transform(result.leave_end_date, 'yyyy-MM-dd');
		var parsedDate2: any = this.parseDate(date2);
		var parsedDate1: any = this.parseDate(date1);
		return Math.round((parsedDate2 - parsedDate1) / (1000 * 60 * 60 * 24));
	}

	getLeaveTypeName(leave_id) {
		const findex = this.leaveTypeArray.findIndex(e => Number(e.leave_id) === Number(leave_id));
		if (findex !== -1) {
			return this.leaveTypeArray[findex].leave_name;
		}
		//return this.leaveTypeArray.map((f) => (Number(f['leave_id']) == Number(leave_id)) ? f['leave_name'] : '');
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
	openLeaveApplicationForm() {
		const dialogRef = this.dialog.open(LeaveApplicationComponent, {
			width: '30%',
			height: '55%',
			data: ''
		});
		dialogRef.afterClosed().subscribe(dresult => {
			if (dresult.data) {
				this.submit(dresult.data, dresult.attachment);
			}
		});
	}


}
