import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
//import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../shared-module/preview-document/preview-document.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MyLeaveElement, SubordinateLeaveElement } from './my-leave.model';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { Key } from 'protractor';
import { SisService, AxiomService, SmartService } from '../../_services';

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
	@ViewChild('cancelModal') cancelModal;
	@ViewChild(MatSort) sort: MatSort;
	myLeaveDisplayedColumns: string[] = ['srno', 'leave_date', 'leave_type', 'leave_no_of_days', 'leave_reason','status', 'action'];
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
	deleteMessage = 'Are you sure to Delete !';
	cancelMessage = 'Are you sure to Cancel !';
	approvedArray: any[] 	= [];
	finalapprovedArray: any[] = [];
	disabledApiButton = false;
	session_id:any;
	constructor(
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		private erpCommonService:ErpCommonService,
		private sisService: SisService,
		public dialog: MatDialog) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}


	ngOnInit() {
		this.session_id = JSON.parse(localStorage.getItem('session'));
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
		this.erpCommonService.getFilterData(filterJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.principal = result.data[0].emp_login_id;
			}
		});
	}

	getEmployeeDetail() {
		var emp_login_id = this.currentUser ? this.currentUser.login_id : '';
		this.erpCommonService.getAllEmployee({ emp_login_id: emp_login_id }).subscribe((result: any) => {
			var finResult = result ? result : []
			this.employeeRecord = finResult[0];
		});
	}

	getLeaveType() {
		this.erpCommonService.getLeaveManagement().subscribe((result: any) => {
			this.leaveTypeArray = result;
		});
	}

	getMyLeave() {
		const datePipe = new DatePipe('en-in');
		this.MY_LEAVE_ELEMENT_DATA = [];
		this.myLeaveDataSource = new MatTableDataSource<MyLeaveElement>(this.MY_LEAVE_ELEMENT_DATA);
		this.erpCommonService.getEmployeeLeaveData({
			'leave_from': this.currentUser ? this.currentUser.login_id : '',
			'leave_role' : this.currentUser.role_id,
			'leave_status': ''
		}).subscribe((result: any) => {
			if (result) {
				let pos = 1;
				for (const item of result) {
					var leave_request_schedule_data = item.leave_request_schedule_data;
					var dataJson = {
						srno: pos,
						leave_date: datePipe.transform(item.leave_start_date, 'MMMM d, y') + ' - ' + datePipe.transform(item.leave_end_date, 'MMMM d, y'),
						leave_type: item.leave_type.leave_name,
						leave_no_of_days: leave_request_schedule_data.length,
						status: this.getLeaveStatusStr(item.leave_status),
						leave_reason: item.leave_reason,
						action: item,
						futuredateflag:this.getFutureDateFlag(item.leave_start_date)
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

	getFutureDateFlag(UserDate){
		let ToDate = new Date();
		if (new Date(UserDate).getTime() >= ToDate.getTime()) {
			return true;
		}else {
			return false;
		}
	}
	getLeaveStatusStr(status){
		let statusstr ='';
		if(status == 0){
			statusstr='Pending'
		} else if(status == 1){
			statusstr='Approved'
		} else if(status == 2){
			statusstr='Cancel'
		}
		return statusstr;
	}
	getLeaveStatusColor(status){
		let statusstr ='';
		if(status == 0){
			statusstr='pending'
		} else if(status == 1){
			statusstr='approved'
		} else if(status == 2){
			statusstr='cancel'
		}
		return statusstr;
	}

	getSubordinateLeave() {
		const datePipe = new DatePipe('en-in');
		this.SUBORDINATE_LEAVE_ELEMENT_DATA = [];
		this.subordinateLeaveDataSource = new MatTableDataSource<SubordinateLeaveElement>(this.SUBORDINATE_LEAVE_ELEMENT_DATA);
		this.erpCommonService.getEmployeeLeaveData({ 'leave_to': this.currentUser ? this.currentUser.login_id : '', 'leave_status': '0' }).subscribe((result: any) => {
			if (result) {
				let pos = 1;
				for (const item of result) {
					var leave_request_schedule_data = item.leave_request_schedule_data;
					// for (var j = 0; j < leave_request_schedule_data.length; j++) {
					var dataJson = {
						srno: pos,
						emp_id: item.leave_emp_detail && item.leave_emp_detail.emp_id ? item.leave_emp_detail.emp_id : '',
						emp_name: item.leave_emp_detail && item.leave_emp_detail.emp_name ?
							item.leave_emp_detail.emp_name : '',
						leave_date: datePipe.transform(item.leave_start_date, 'MMMM d, y') + ' - ' + datePipe.transform(item.leave_end_date, 'MMMM d, y'),
						leave_type: item.leave_type.leave_name,
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

		this.disabledApiButton = true;
		const datePipe = new DatePipe('en-in');
		var inputJson = {};
		var startDate = datePipe.transform(result.leave_start_date, 'yyyy-MM-dd');
		var endDate = datePipe.transform(result.leave_end_date, 'yyyy-MM-dd');
		var leaveRequestScheduleData = [];
		var diffDay = this.getDaysDiff(result);
		inputJson['leave_to'] = result.tabIndex && result.tabIndex !== 1 ? (
			this.employeeRecord.emp_supervisor ? this.employeeRecord.emp_supervisor.id : this.principal) :
			(result.leave_to ? result.leave_to : this.principal);
		inputJson['leave_from'] = this.currentUser.login_id;
		inputJson['leave_employee_id'] = result.leave_employee_id ? result.leave_employee_id : '',
			inputJson['leave_start_date'] = startDate;
		inputJson['leave_end_date'] = endDate;
		inputJson['leave_type'] = { "leave_type_id": result.leave_type, "leave_type_name": this.getLeaveTypeName(result.leave_type) };
		inputJson['leave_reason'] = result.leave_reason;
		inputJson['leave_half_day'] = result.leave_half_day;
		inputJson['leave_attachment'] = attachment;
		inputJson['leave_request_schedule_data'] = [];
		inputJson['leave_emp_detail'] =
			result.tabIndex === 0 ?
				(this.employeeRecord ? { 'emp_id': this.employeeRecord['emp_id'], 'emp_name': this.employeeRecord['emp_name'] } : {})
				: result.leave_emp_detail;
		inputJson['leave_status'] = 0;
		inputJson['leave_role'] = this.currentUser.role_id;
		var newStartDate = new Date(startDate);
		for (let i = 0; i <= diffDay; i++) {
			leaveRequestScheduleData.push({ "date": datePipe.transform(newStartDate, 'yyyy-MM-dd'), "type": "full", "time_from": "", "time_to": "", "status": { "status_name": "pending", "created_by": this.currentUser ? this.currentUser.login_id : '' } })
			newStartDate.setDate(newStartDate.getDate() + 1);
		}
		inputJson['leave_request_schedule_data'] = leaveRequestScheduleData;

		this.erpCommonService.insertEmployeeLeaveData(inputJson).subscribe((result: any) => {
			if (result && result.status === "ok") {
				this.disabledApiButton = false;
				this.common.showSuccessErrorMessage('Leave Request Submitted Successfully', 'success');
				this.showFormFlag = false;
				this.getMyLeave();
			} else {
				this.disabledApiButton = false;
				this.common.showSuccessErrorMessage('Leave Request of Selected date aleady exist', 'error');
			}
		});

	}

	update(result, attachment) { 
		this.disabledApiButton = true;
		const datePipe = new DatePipe('en-in');
		var inputJson = {};
		var startDate = datePipe.transform(result.leave_start_date, 'yyyy-MM-dd');
		var endDate = datePipe.transform(result.leave_end_date, 'yyyy-MM-dd');
		var leaveRequestScheduleData = [];
		var diffDay = this.getDaysDiff(result);
		inputJson['leave_id'] = result.leave_id;
		inputJson['leave_to'] = result.tabIndex && result.tabIndex !== 1 ? (
			this.employeeRecord.emp_supervisor ? this.employeeRecord.emp_supervisor.id : this.principal) :
			(result.leave_to ? result.leave_to : this.principal);
		inputJson['leave_from'] = this.currentUser.login_id;
		inputJson['leave_employee_id'] = result.leave_employee_id ? result.leave_employee_id : '',
			inputJson['leave_start_date'] = startDate;
		inputJson['leave_end_date'] = endDate;
		inputJson['leave_type'] = { "leave_type_id": result.leave_type, "leave_type_name": this.getLeaveTypeName(result.leave_type) };
		inputJson['leave_reason'] = result.leave_reason;
		inputJson['leave_half_day'] = result.leave_half_day;
		inputJson['leave_attachment'] = attachment;
		inputJson['leave_request_schedule_data'] = [];
		inputJson['leave_emp_detail'] =
			result.tabIndex === 0 ?
				(this.employeeRecord ? { 'emp_id': this.employeeRecord['emp_id'], 'emp_name': this.employeeRecord['emp_name'] } : {})
				: result.leave_emp_detail;
		inputJson['leave_status'] = result.leave_status;
		inputJson['leave_role'] = this.currentUser.role_id;
		var newStartDate = new Date(startDate);
		for (let i = 0; i <= diffDay; i++) {
			leaveRequestScheduleData.push({ "date": datePipe.transform(newStartDate, 'yyyy-MM-dd'), "type": "full", "time_from": "", "time_to": "", "status": { "status_name": "pending", "created_by": this.currentUser ? this.currentUser.login_id : '' } })
			newStartDate.setDate(newStartDate.getDate() + 1);
		}
		inputJson['leave_request_schedule_data'] = leaveRequestScheduleData;
		this.erpCommonService.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
			if (result && result.status === "ok") {
				this.disabledApiButton = false;
				this.common.showSuccessErrorMessage('Leave Request Submitted Successfully', 'success');
				this.showFormFlag = false;
				this.getMyLeave();
			} else {
				this.disabledApiButton = false;
				this.common.showSuccessErrorMessage('Leave Request of Selected date aleady exist', 'error');
			}
		});
	}

	deleteConfirm(item) {
		let inputJson = {};
		inputJson['leave_id'] = item.leave_id;
		inputJson['leave_status'] = '5';
		this.erpCommonService.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
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

	cancelLeave(item) {
		this.cancelModal.openModal(item);
	}

	cancelConfirm(item){
		
		console.log('cancelConfirm',item);
		if(item.leave_emp_detail.emp_id && item.leave_status == 1){
			let inputJson = {};
			inputJson['leave_id'] = item.leave_id;
			inputJson['leave_status'] = '2';
			let emp_id = item.leave_emp_detail.emp_id;
			let leave_month = new Date(item.leave_start_date).getMonth() + 1;
			let leave_session = item.leave_session;
			this.erpCommonService.getAllEmployee({ emp_id: emp_id }).subscribe((result: any) => {
				var finResult = result ? result : []
				const tempR = finResult[0].emp_month_attendance_data || [];
				let emp_month_attendance_data = tempR.find(f => f.ses_id == leave_session);
				let attendance_detail = emp_month_attendance_data.month_data.find(f => f.month_id == leave_month);
				if(attendance_detail) {
					console.log('attendance_detail',attendance_detail);
					attendance_detail.attendance_detail.emp_leave_availed.forEach(e => {
						if(e.leave_id == item.leave_type.leave_id) {
							e.leave_value -= item.leave_request_schedule_data.length;
							e.leave_value= e.leave_value <= 0 ? '' : e.leave_value;
						}
					});
					attendance_detail.attendance_detail.emp_leave_granted.forEach(e => {
						if(e.leave_id == item.leave_type.leave_id) {
							e.leave_value -= item.leave_request_schedule_data.length;
							e.leave_value= e.leave_value <= 0 ? '' : e.leave_value;
						}
					});
					attendance_detail.attendance_detail.emp_balance_leaves.forEach(e => {
						if(e.leave_id == item.leave_type.leave_id) {
							e.leave_value += item.leave_request_schedule_data.length;
							e.leave_value= e.leave_value <= 0 ? '' : e.leave_value;

							//when balance is more than credited value, handle this error
							if(attendance_detail.attendance_detail.emp_leave_credited) {
								attendance_detail.attendance_detail.emp_leave_credited.forEach(e1 => {
									if(e1.leave_id == item.leave_type.leave_id) {
										e.leave_value = e.leave_value > e1.leave_value ? e1.leave_value : e.leave_value;
										e.leave_value= e.leave_value <= 0 ? '' : e.leave_value;
									}
								});
							}	
						}
					});
					let approvedjson = {};
					approvedjson = {
						emp_id: item.leave_emp_detail.emp_id,
						emp_month_attendance_data: tempR
					}
					console.log(item.leave_emp_detail.emp_id);
					console.log('inputJson',inputJson);
					console.log('approvedjson',approvedjson);
					this.erpCommonService.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
						if (result) {
							this.erpCommonService.updateEmployee(approvedjson).subscribe((approved_result: any) => {
								if (approved_result) {
									this.common.showSuccessErrorMessage('Leave Request Canceled Successfully', 'success');
									
									this.getMyLeave();
								}
							});
						} else {
							this.common.showSuccessErrorMessage('Error While Cancel Leave Request', 'error');
						}
					});
				} else {
					this.common.showSuccessErrorMessage('Error While Cancel Leave Request', 'error');
				}
			});
		}
			
	}

	approveConfirm(item) {		
		console.log('item',item)
	}

	rejectConfirm(item) {
	}

	editLeave(item) {
		if(this.employeeRecord.emp_id){
			item.emp_id = this.employeeRecord.emp_id;
		}
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
		if(this.employeeRecord.emp_id){
			localStorage.setItem('eRecord', JSON.stringify(this.employeeRecord));
			const dialogRef = this.dialog.open(LeaveApplicationComponent, {
				width: '500px',
				height: '500px',
				data: {emp_id:this.employeeRecord.emp_id}
			});
			dialogRef.afterClosed().subscribe(dresult => {
				if (dresult && dresult.data) {
					this.submit(dresult.data, dresult.attachment);
				}
			});
		} else {
			this.common.showSuccessErrorMessage('Does not have employee id','error');
		}
	}
	deleteCancel() {

	}

}
