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
	@ViewChild('cancelModal') cancelModal;
	@ViewChild('approveModal') approveModal;
	@ViewChild('rejectModal') rejectModal;
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
	cancelMessage = 'Are you sure to Cancel ';
	approveMessage = 'Are you sure to Approve ';
	rejectMessage = 'Are you sure to Reject !';
	approvedArray: any[] 	= [];
	finalapprovedArray: any[] = [];
	disabledApiButton = false;
	session_id:any;
	constructor(
		private fbuild: FormBuilder,
		private common: CommonAPIService,
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
		this.common.getEmployeeLeaveData({
			'leave_from': this.currentUser ? this.currentUser.login_id : '',
			'role_id' : this.currentUser.role_id,
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
		this.common.getEmployeeLeaveData({ 'leave_to': this.currentUser ? this.currentUser.login_id : '', 'leave_status': '0' }).subscribe((result: any) => {
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
		console.log('result',result);
		this.disabledApiButton = true;
		const datePipe = new DatePipe('en-in');
		var inputJson = {};
		var startDate = datePipe.transform(result.leave_start_date, 'yyyy-MM-dd');
		var endDate = datePipe.transform(result.leave_end_date, 'yyyy-MM-dd');
		var leaveRequestScheduleData = [];
		var diffDay = this.getDaysDiff(result);
		inputJson['leave_to'] = result.tabIndex == 0 ? (
			this.employeeRecord.emp_supervisor ? this.employeeRecord.emp_supervisor.id : this.principal) :
			(result.leave_to ? result.leave_to : this.principal);
		inputJson['leave_from'] = result.tabIndex == 0 ?
			(this.currentUser && this.currentUser.login_id ? this.currentUser.login_id : '') :
			('');
		inputJson['leave_employee_id'] = result.leave_employee_id ? result.leave_employee_id : '',
			inputJson['leave_start_date'] = startDate;
		inputJson['leave_end_date'] = endDate;
		inputJson['leave_type'] = { "leave_type_id": result.leave_type, "leave_type_name": this.getLeaveTypeName(result.leave_type) };
		inputJson['leave_reason'] = result.leave_reason;
		inputJson['leave_half_day'] = result.leave_half_day;
		inputJson['leave_attachment'] = attachment;
		inputJson['leave_request_schedule_data'] = [];
		inputJson['leave_emp_detail'] =
			result.tabIndex == 0 ?
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
		console.log('inputJson',inputJson);

		this.common.insertEmployeeLeaveData(inputJson).subscribe((result: any) => {
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
		inputJson['leave_to'] = result.tabIndex == 0 ? (
			this.employeeRecord.emp_supervisor ? this.employeeRecord.emp_supervisor.id : this.principal) :
			(result.leave_to ? result.leave_to : this.principal);
		inputJson['leave_from'] = result.tabIndex == 0 ?
			(this.currentUser && this.currentUser.login_id ? this.currentUser.login_id : '') :
			('');
		inputJson['leave_employee_id'] = result.leave_employee_id ? result.leave_employee_id : '',
			inputJson['leave_start_date'] = startDate;
		inputJson['leave_end_date'] = endDate;
		inputJson['leave_type'] = { "leave_type_id": result.leave_type, "leave_type_name": this.getLeaveTypeName(result.leave_type) };
		inputJson['leave_reason'] = result.leave_reason;
		inputJson['leave_half_day'] = result.leave_half_day;
		inputJson['leave_attachment'] = attachment;
		inputJson['leave_request_schedule_data'] = [];
		inputJson['leave_emp_detail'] =
			result.tabIndex == 0 ?
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
		this.common.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
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
	cancelLeave(item) {
		this.cancelModal.openModal(item);
	}
	approveLeave(item) {
		item.text = this.approveMessage;
		this.approveModal.openModal(item);
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
			this.common.getAllEmployee({ emp_id: emp_id }).subscribe((result: any) => {
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
					this.common.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
						if (result) {
							this.common.updateEmployee(approvedjson).subscribe((approved_result: any) => {
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
							"leave_id": item.leave_type.leave_id,
							"leave_name": item.leave_type.leave_name,
							"leave_credit_count": 1
						}
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
				const tempR = finResult[0].emp_month_attendance_data || [];
				console.log('tempR',tempR);
				console.log('this.session_id',this.session_id);
				console.log('tempR',tempR);
				tempR.forEach(element => {
					if(element.ses_id == this.session_id.ses_id){
						console.log('lennngth',element.month_data.length)
						let tempmonthdata:any[]=[];
						element.month_data.forEach(element1 => {
							console.log('element1',element1);
							tempmonthdata.push(element1);
						});

						this.approvedArray.push(tempmonthdata);
					}
				});
				//this.approvedArray.push(finResult[0].emp_month_attendance_data.month_data);
				console.log('this.approvedArray',this.approvedArray);
				console.log('this.employeeArrData',employeeArrData);
				const approvedArraytemp:any[] = this.approvedArray[0] || [];
				console.log('approvedArraytemp',approvedArraytemp);
				console.log('approvedArraytemp.length',approvedArraytemp.length);
				for (const dety of employeeArrData) {
					
					// const findex = approvedArraytemp.findIndex(e => Number(e.month_id) == Number(dety.month_id));
					let findex = -1;
					console.log('dety',dety);
					console.log('approvedArraytemp.length',approvedArraytemp.length);;
					// for (let index = 0; index < approvedArraytemp.length; index++) {
					// 	const e = approvedArraytemp[index];
					// 	console.log('e.month_id',e.month_id);
					// 	console.log('dety.month_id',dety.month_id);
					// 	if(e.month_id == dety.month_id) {
					// 		findex = index;
					// 	}
					// }
					let ind=0;
					approvedArraytemp.forEach(e => {
						console.log('e.month_id',e.month_id);
						console.log('dety.month_id',dety.month_id);
						if(e.month_id == dety.month_id) {
							findex = ind;
						}
						ind++;
					});
					if(item.leave_half_day) {
						dety.attendance_detail.emp_leave_approved.leave_credit_count = 0.5;					
					}
					console.log('findex',findex);
					let leave_availed_ele = {
						leave_id:dety.attendance_detail.emp_leave_approved.leave_id,
						leave_name:dety.attendance_detail.emp_leave_approved.leave_name,
						leave_value:dety.attendance_detail.emp_leave_approved.leave_credit_count
					}
					
					console.log('leave_half_day',leave_availed_ele);
					if (findex !== -1) {
						console.log(' exist',findex);
						// if (approvedArraytemp[findex].attendance_detail.emp_leave_approved) {
						// 	if (Number(approvedArraytemp[findex].attendance_detail.emp_leave_approved.leave_id) === Number(dety.attendance_detail.emp_leave_approved.leave_id)) {
						// 		approvedArraytemp[findex].attendance_detail.emp_leave_approved.leave_credit_count =
						// 			Number(approvedArraytemp[findex].attendance_detail.emp_leave_approved.leave_credit_count) +
						// 			Number(dety.attendance_detail.emp_leave_approved.leave_credit_count);
						// 	} else {
						// 		approvedArraytemp[findex].attendance_detail.emp_leave_approved.push(dety.attendance_detail.emp_leave_approved);
						// 	}

						// } else {
						// 	approvedArraytemp[findex].attendance_detail['emp_leave_approved'] = dety.attendance_detail.emp_leave_approved;
						// }

						if (approvedArraytemp[findex].attendance_detail.emp_leave_availed &&
							approvedArraytemp[findex].attendance_detail.emp_leave_availed.length > 0) {
								let isLeaveTypeExist = 0;;
								approvedArraytemp[findex].attendance_detail.emp_leave_availed.forEach(element => {
									if(element.leave_id == dety.attendance_detail.emp_leave_approved.leave_id){
										element.leave_value += dety.attendance_detail.emp_leave_approved.leave_credit_count;
										isLeaveTypeExist = 1;
									}
								});
								if(isLeaveTypeExist == 0){
									approvedArraytemp[findex].attendance_detail.emp_leave_availed.push(leave_availed_ele);
								}
						} else {
							approvedArraytemp[findex].attendance_detail['emp_leave_availed']=[];
							approvedArraytemp[findex].attendance_detail['emp_leave_availed'].push(leave_availed_ele);
						}

						//emp_leave_granted is not in use ********** further can be used
						approvedArraytemp[findex].attendance_detail['emp_leave_granted']=approvedArraytemp[findex].attendance_detail.emp_leave_availed;
						// if (approvedArraytemp[findex].attendance_detail.emp_leave_granted &&
						// 	approvedArraytemp[findex].attendance_detail.emp_leave_granted.length > 0) {
						// 		let isLeaveTypeExist = 0;;
						// 		approvedArraytemp[findex].attendance_detail.emp_leave_granted.forEach(element => {
						// 			if(element.leave_id == dety.attendance_detail.emp_leave_approved.leave_id){
						// 				element.leave_value += dety.attendance_detail.emp_leave_approved.leave_credit_count;
						// 				isLeaveTypeExist = 1;
						// 			}
						// 		});
						// 		if(isLeaveTypeExist == 0){
						// 			approvedArraytemp[findex].attendance_detail.emp_leave_granted.push(leave_availed_ele);
						// 		}
						// } else {
						// 	approvedArraytemp[findex].attendance_detail['emp_leave_granted'].push(leave_availed_ele);
						// }

						// new code -- calculation for emp_balance_leaves
						if (approvedArraytemp[findex].attendance_detail.emp_leave_credited &&
							approvedArraytemp[findex].attendance_detail.emp_leave_credited.length > 0) {
								let temp_balance_leaves:any[] = JSON.parse(JSON.stringify(approvedArraytemp[findex].attendance_detail.emp_leave_credited));
								temp_balance_leaves.forEach(element => {
									const tempind = approvedArraytemp[findex].attendance_detail.emp_leave_granted.findIndex(e => e.leave_id == element.leave_id);
									if(tempind != -1){
										element.leave_value -= approvedArraytemp[findex].attendance_detail.emp_leave_granted[tempind].leave_value;
									}
									approvedArraytemp[findex].attendance_detail['emp_balance_leaves'] =temp_balance_leaves; 
								})
						}
					} else {
						//dety.attendance_detail.emp_leave_availed = dety.attendance_detail.emp_leave_approved.leave_credit_count;
						dety.attendance_detail['emp_leave_availed'] = [];
						dety.attendance_detail['emp_leave_availed'].push(leave_availed_ele);
						dety.attendance_detail['emp_leave_granted'] = [];
						dety.attendance_detail['emp_leave_granted'].push(leave_availed_ele);
						const lastindex = approvedArraytemp.length-1;
						if (approvedArraytemp[lastindex].attendance_detail.emp_leave_credited &&
							approvedArraytemp[lastindex].attendance_detail.emp_leave_credited.length > 0) {
								let temp_balance_leaves:any[] = JSON.parse(JSON.stringify(approvedArraytemp[lastindex].attendance_detail.emp_leave_credited));
								temp_balance_leaves.forEach(element => {
									const tempind = approvedArraytemp[lastindex].attendance_detail.emp_leave_granted.findIndex(e => e.leave_id == element.leave_id);
									if(tempind != -1){
										element.leave_value -= approvedArraytemp[lastindex].attendance_detail.emp_leave_granted[tempind].leave_value;
									}
									approvedArraytemp[lastindex].attendance_detail['emp_balance_leaves'] =temp_balance_leaves; 
								})
						}
						
						approvedArraytemp.push(dety);
					}
				}
				let isSessionExist = 0;
				tempR.forEach(element => {
					if(element.ses_id == this.session_id.ses_id){
						element.month_data=approvedArraytemp;
						isSessionExist = 1;
					}
				});
				if(isSessionExist == 0){
					tempR.push({
						ses_id:this.session_id.ses_id,
						leave_opening_balance:0,
						month_data:approvedArraytemp
					})
				}
				let approvedjson = {};
				// approvedjson = {
				// 	emp_id: item.leave_emp_detail.emp_id,
				// 	emp_month_attendance_data: {
				// 		month_data: approvedArraytemp
				// 	}
				// }
				approvedjson = {
					emp_id: item.leave_emp_detail.emp_id,
					emp_month_attendance_data: tempR
				}
				console.log(item.leave_emp_detail.emp_id);
				console.log('inputJson',inputJson);
				console.log('approvedjson',approvedjson);
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
		if(this.employeeRecord && this.employeeRecord.emp_id){
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
			this.common.showSuccessErrorMessage('Does not have employee details in HR','error');
		}
	}
	deleteCancel() {

	}

}
