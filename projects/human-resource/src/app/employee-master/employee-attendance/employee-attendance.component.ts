import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService, SmartService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ErpCommonService } from 'src/app/_services';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Component({
	selector: 'app-employee-attendance',
	templateUrl: './employee-attendance.component.html',
	styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	employeeForm: FormGroup;
	searchForm: FormGroup;
	sessionArray: any[] = [];
	sessionDetails:any;
	formGroupArray: any[] = [];
	availedformGroupArray: any[] = [];
	grantedformGroupArray: any[] = [];
	totalPresentArr: any[] = [];
	//editFlag = false;
	employeeData: any[] = [];
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	COPY_EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id: any = {};
	categoryOneArray: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	//'emp_present',
	displayedEmployeeColumns: string[] = [];
	currentMonthName = '';
	currentStatusName = '';
	currentCategoryName = '';
	editAllStatus = true;
	disabledApiButton = false;
	holidayArray: any[] = [];
	sessionName: any;
	currSess: any;
	tempMonthArr = [{ month_id: 4, month_name: 'April' },
	{ month_id: 5, month_name: 'May' },
	{ month_id: 6, month_name: 'June' },
	{ month_id: 7, month_name: 'July' },
	{ month_id: 8, month_name: 'August' },
	{ month_id: 9, month_name: 'September' },
	{ month_id: 10, month_name: 'October' },
	{ month_id: 11, month_name: 'November' },
	{ month_id: 12, month_name: 'December' },
	{ month_id: 1, month_name: 'January' },
	{ month_id: 2, month_name: 'Feburary' },
	{ month_id: 3, month_name: 'March' }
	];
	monthArr = [];
	leaveTypeArray:any[] = [];
	globalSetting:any = {};
	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService

	) {

		this.session_id = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		this.getGlobalSettings();
		this.getSession();
		this.getLeaveType();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			status_id: '',
			cat_id: '',

		});
		// this.employeeForm = this.fbuild.group({
		// 	search_id: ''

		// });
		this.getCategoryOne();
	}
	getGlobalSettings() {
		this.erpCommonService.getGlobalSetting({ gs_alias: 'attendance_calculation' }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				res.data.forEach(element => {
					this.globalSetting[element.gs_alias] = element.gs_value;
				});
			}
		});

	}
	getLeaveType() {
		this.commonAPIService.getLeaveManagement().subscribe((result: any) => {
			this.leaveTypeArray = result;
			this.displayedEmployeeColumns = ['srno', 'emp_id', 'emp_name', 'emp_designation'];
			this.leaveTypeArray.forEach(ele => {
				this.displayedEmployeeColumns.push('leave_availed'+ele.leave_id);
				this.displayedEmployeeColumns.push('leave_granted'+ele.leave_id);
			});
			this.displayedEmployeeColumns.push('emp_lwp');
			this.displayedEmployeeColumns.push('emp_total_attendance');
			this.displayedEmployeeColumns.push('emp_remarks');
			this.displayedEmployeeColumns.push('emp_status');
			this.displayedEmployeeColumns.push('action');
		});
	}

	getCategoryOne() {
		this.commonAPIService.getCategoryOne({}).subscribe((res: any) => {
			if (res) {
				this.categoryOneArray = [];
				this.categoryOneArray = res;
			}
		});
	}
	getCategoryOneName(cat_id) {
		const findex = this.categoryOneArray.findIndex(e => Number(e.cat_id) === Number(cat_id));
		if (findex !== -1) {
			return this.categoryOneArray[findex].cat_name;
		}
	}

	getDaysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	};
	getSession() {
		this.erpCommonService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						if (this.session_id) {
							this.sessionName = this.sessionArray[this.session_id.ses_id];
						}

						for (const citem of result.data) {
							if (Number(citem.ses_id) == Number(this.session_id.ses_id)) {
								this.sessionDetails = citem;
								if (citem.ses_alias === 'current') {
									let curMonth = new Date().getMonth() + 1;
									for (var i = 0; i < this.tempMonthArr.length; i++) {
										if (this.tempMonthArr[i]['month_id'] <= curMonth && ([1, 2, 3].indexOf(this.tempMonthArr[i]['month_id']) < 0)) {
											this.monthArr.push(this.tempMonthArr[i]);
										}
										if ((curMonth == 1
											|| curMonth == 2 || curMonth == 3)) {
											if ((this.tempMonthArr[i]['month_id'] >= 4 && this.tempMonthArr[i]['month_id'] <= 12) || this.tempMonthArr[i]['month_id'] <= curMonth) {
												this.monthArr.push(this.tempMonthArr[i]);
											}
										}
									}
								} else {
									this.monthArr = this.tempMonthArr;
								}
								//this.monthArr = this.tempMonthArr;
							}

						}


					}
				});
	}

	getEmployeeDetail() {
		if (this.searchForm.value.month_id) {
			this.totalPresentArr = [];
			let inputJson = {
				month_id: this.searchForm.value.month_id,
				emp_status: this.searchForm.value.status_id,
				emp_cat_id: this.searchForm.value.cat_id,
				session_id: this.session_id.ses_id,
				from_attendance: true,
				year: this.currSess,
				fnf_status:false
			};
			var no_of_days2 = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
			const inputJson2: any = {};
			inputJson2.datefrom = new Date().getFullYear() + '-' + this.searchForm.value.month_id + '-1';
			inputJson2.dateto = new Date().getFullYear() + '-' + this.searchForm.value.month_id + '-' + no_of_days2;
			inputJson2.sunday = 0;
			this.smartService.getHolidayOnly(inputJson2).subscribe((res: any) => {
				if (res) {
					this.holidayArray = res.data ? res.data : [];
					const dateArray: any[] = [];
					var date;
					var dateFormate;
					for (let i = 0; i <= no_of_days2; i++) {
						date = new Date().getFullYear() + '-' + this.searchForm.value.month_id + '-' + i;
						dateFormate = this.commonAPIService.dateConvertion(date, 'y-MM-dd');
						if (i !== 0) {
							const findex = this.holidayArray.indexOf(dateFormate);
							if (findex !== -1) {
								dateArray.push({
									date: date,
									attendance: 'h',
									dateFormate:dateFormate
								});
							} else {
								dateArray.push({
									date: date,
									attendance: '',
									dateFormate:dateFormate
								});
							}
	
						}
					}
					let no_of_days = Number(this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear()));
					this.commonAPIService.getAllEmployee(inputJson).subscribe((result: any) => {
						let element: any = {};
						let recordArray = [];
						this.employeeData = [];
						this.EMPLOYEE_ELEMENT = [];
						this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
						if (result && result.length > 0) {
							let pos = 1;
							let recordArray = result;
							this.formGroupArray = [];
							let j = 0;
							console.log('getAllEmployee', result);
							let missingDOJ:any[] = [];
							for (const item of result) {
								let tempdateArray = JSON.parse(JSON.stringify(dateArray));
								tempdateArray.forEach(e => {
									const tdate = new Date(e.date);
									const dow = tdate.getDay();
									if(item.weekly_off && item.weekly_off.length > 0) {
										if(item.weekly_off.includes(dow))  {
										e.attendance = 'h';                    
										}
									} else {
										if(dow == 0){
										e.attendance = 'h';
										}
									}
								})
								if(item.emp_code_no == 169) {
								console.log('tempdateArray------',JSON.parse(JSON.stringify(tempdateArray)));
								}

								if(item.emp_salary_detail &&
								item.emp_salary_detail.emp_organisation_relation_detail &&
								item.emp_salary_detail.emp_organisation_relation_detail.doj) {
									var emp_month;
									var emp_leave_approved;
									var emp_attendance_detail;
									var total_leave_closing_balance = 0;
									var curr_total_leave_closing_balance = 0;
									var leave_credited_count = 0;
									let emp_month_attendance_data:any;
									let lwpDays = 0;
									item.emp_month_attendance_data.forEach(element => {
										if(element.ses_id == this.session_id.ses_id){
											emp_month_attendance_data = element;
										}
									});
									console.log('emp_month_attendance_data',emp_month_attendance_data);
									if (emp_month_attendance_data) {
										if (emp_month_attendance_data.month_data) {
											let month_data = emp_month_attendance_data.month_data.find(e => Number(e.month_id) == Number(this.searchForm.value.month_id));
											if(month_data && month_data.attendance_detail.emp_balance_leaves && month_data.attendance_detail.emp_balance_leaves.length > 0){
												month_data.attendance_detail.emp_balance_leaves.forEach(e => {
													total_leave_closing_balance += e.leave_value
												});
											}
										}	
									}	
		
									element = {
										srno: pos,
										emp_id: item.emp_id,
										emp_code_no: item.emp_code_no ? item.emp_code_no : '-',
										emp_name: item.emp_name,
										emp_designation: item.emp_designation_detail ? item.emp_designation_detail.name : '',
										emp_bol: total_leave_closing_balance,
										emp_present: no_of_days,
										emp_total_attendance:no_of_days,
										emp_status: item.emp_status ? item.emp_status : 'live',
										viewFlag: true,
										absentDays:0,
										action: item,
		
									};
									let templeaveform:any[] = [];
									this.leaveTypeArray.forEach(e => {
										templeaveform.push({
											emp_leave_form:this.fbuild.group({
												leave_id:e.leave_id,
												leave_availed:'',
												leave_granted:''
											})
										})
									})
									this.formGroupArray[j] = {
										formGroup: this.fbuild.group({
											emp_id: item.emp_id,
											emp_total_attendance:'',
											emp_remarks: '',
											emp_leave_form:this.fbuild.array(templeaveform)
										})
									}
									if (emp_month_attendance_data && emp_month_attendance_data.month_data && emp_month_attendance_data.month_data.length > 0) {
										
										const index2 = emp_month_attendance_data.month_data.findIndex(f => Number(f.month_id)
										== Number(this.searchForm.value.month_id));
										console.log('record come from db',index2);
										let la = 0;
										let lg = 0;
										if (index2 !== -1) {
											console.log('this.formGroupArray 0',this.formGroupArray);
											emp_month = emp_month_attendance_data.month_data[index2].month_id;
											emp_attendance_detail = emp_month_attendance_data.month_data[index2];
											if (emp_attendance_detail.attendance_detail.emp_leave_availed && emp_attendance_detail.attendance_detail.emp_leave_availed.length > 0) {
												la = emp_attendance_detail.attendance_detail.emp_leave_availed.reduce((a,b) => a + Number(b.leave_value),0);
												lg = emp_attendance_detail.attendance_detail.emp_leave_granted.reduce((a,b) => a + Number(b.leave_value),0);
												
												console.log('la',la);
												this.formGroupArray[j].formGroup.value.emp_leave_form.forEach(e => {
													const tempdataa = emp_attendance_detail.attendance_detail.emp_leave_availed.find(f => f.leave_id == e.emp_leave_form.value.leave_id);
													const tempdatag = emp_attendance_detail.attendance_detail.emp_leave_granted.find(f => f.leave_id == e.emp_leave_form.value.leave_id);
													console.log('tempdata',tempdataa);
													if(tempdataa){
														e.emp_leave_form.patchValue({
															leave_availed:tempdataa.leave_value
														})
													}
													if(tempdatag){
														e.emp_leave_form.patchValue({
															leave_granted:tempdatag.leave_value
														})
													}
													

												});
											}
											this.formGroupArray[j].formGroup.patchValue({
												emp_remarks: emp_attendance_detail.attendance_detail.emp_remarks ? emp_attendance_detail.attendance_detail.emp_remarks : ''
											});
											if(emp_attendance_detail && emp_attendance_detail.attendance_detail &&
												emp_attendance_detail.attendance_detail.emp_lwp > -1) {
													console.log('calling db lwpDays',emp_attendance_detail.attendance_detail.emp_lwp);
													lwpDays = emp_attendance_detail.attendance_detail.emp_lwp;
													element.absentDays = lwpDays;
											} else {
												if (item.attendanceRecords && item.attendanceRecords.length > 0) {
													const arrFilter: any[] = item.attendanceRecords;
													let absentDays = arrFilter.map(f => Number(f.attendanceStatus)).reduce((acc, val) => acc + (val == 0 ? 1 : 0), 0);
													console.log('absentDays',absentDays);
													element.absentDays = absentDays;
													lwpDays = absentDays > lg ? absentDays - lg : 0
												} else if(item.shiftAttendanceDetails){
													if(item.shiftAttendanceDetails.length > 0) {
														let tempholyday = tempdateArray.filter(e => e.attendance == 'h');
														for (let index = 0; index < item.shiftAttendanceDetails.length; index++) {
															const element = item.shiftAttendanceDetails[index];
															const findex = tempholyday.findIndex(e => e.dateFormate == element.entrydate);
															if(findex != -1){
																item.shiftAttendanceDetails.splice(index,1);
															}
															
														}
														let absentDays = no_of_days - item.shiftAttendanceDetails.length - tempholyday.length;
														
														console.log('absentDays',absentDays);
														element.absentDays = absentDays;
														lwpDays = absentDays > lg ? absentDays - lg : 0;
													} else {
														let absentDays = no_of_days;
														element.absentDays = absentDays;
														lwpDays = absentDays > lg ? absentDays - lg : 0;
													}
													
												}
												if(this.globalSetting.attendance_calculation == 'manual'){
													let absentDays = la-lg;
													element.absentDays = absentDays;
													lwpDays = absentDays;
												}
											}
											element.emp_lwp = lwpDays;
											var presentDays = no_of_days;
											if(emp_attendance_detail && emp_attendance_detail.attendance_detail &&
												emp_attendance_detail.attendance_detail.emp_total_attendance > -1) {
													console.log('calling db emp_total_attendance',emp_attendance_detail.attendance_detail.emp_total_attendance);
													presentDays = emp_attendance_detail.attendance_detail.emp_total_attendance;
											} else {
												console.log('calling else emp_total_attendance',emp_attendance_detail.attendance_detail.emp_total_attendance);

												presentDays = Number(presentDays) - Number(lwpDays);
												console.log('presentDays----',presentDays);

												if(item.emp_salary_detail.emp_organisation_relation_detail.doj){
													let pDays = this.getPresentDayDOJ(item,inputJson.month_id,no_of_days);
													if(pDays) {
														presentDays = pDays;
													}	
												}

												if (item.emp_status === 'left') {
													presentDays = this.getPresentDayDOL(item,inputJson.month_id,no_of_days);
												}

											}
											console.log('presentDays----',presentDays);
											if (item.emp_status === 'live') {
												// element.emp_total_attendance = presentDays && presentDays !== 0 ?
												// 	presentDays : no_of_days;
											}
											
											element.emp_total_attendance = presentDays;
											this.formGroupArray[j].formGroup.patchValue({
												emp_total_attendance: element.emp_total_attendance
											});
											element.emp_present = emp_attendance_detail.attendance_detail.emp_present ? emp_attendance_detail.attendance_detail.emp_present : no_of_days,
											element.viewFlag = emp_attendance_detail.attendance_detail.emp_total_attendance ? false : true
											
										} else {
											let totP: any = no_of_days;

											if (item && item.attendanceRecords && item.attendanceRecords.length > 0) {
												const arrFilter: any[] = item.attendanceRecords;
												let absentDays = arrFilter.map(f => Number(f.attendanceStatus)).reduce((acc, val) => acc + (val == 0 ? 1 : 0), 0);
												element.absentDays = absentDays;
												lwpDays = absentDays > 0 ? absentDays : 0;
												totP = totP- lwpDays;
											} else if(item.shiftAttendanceDetails){
												if(item.shiftAttendanceDetails.length > 0) {
													let tempholyday = tempdateArray.filter(e => e.attendance == 'h');
													for (let index = 0; index < item.shiftAttendanceDetails.length; index++) {
														const element = item.shiftAttendanceDetails[index];
														const findex = tempholyday.findIndex(e => e.dateFormate == element.entrydate);
														if(findex != -1){
															item.shiftAttendanceDetails.splice(index,1);
														}
														
													}
													let absentDays = no_of_days - item.shiftAttendanceDetails.length - tempholyday.length;
													console.log('absentDays',absentDays);
													element.absentDays = absentDays;
													lwpDays = absentDays > 0 ? absentDays : 0;
													totP = totP- lwpDays;
												} else {
													let absentDays = no_of_days;
													element.absentDays = absentDays;
													lwpDays = absentDays > 0 ? absentDays : 0;
													totP = totP- lwpDays;
												}
												
											}
											if(this.globalSetting.attendance_calculation == 'manual'){
												totP = no_of_days;
												element.absentDays = 0;
												lwpDays = 0;
											}
											if(item.emp_salary_detail.emp_organisation_relation_detail.doj){
												let pDays = this.getPresentDayDOJ(item,inputJson.month_id,no_of_days);
												if(pDays) {
													totP = pDays;
												}	
											}

											if (item.emp_status === 'left') {
												totP = this.getPresentDayDOL(item,inputJson.month_id,no_of_days);
											}
											
											

											element.emp_total_attendance = totP;
											element.emp_lwp = lwpDays;
											emp_attendance_detail = {};
											this.formGroupArray[j].formGroup.patchValue({
												emp_total_attendance: element.emp_total_attendance
											});
										}
									} else {
										//emp_month_attendance_data does not exist for requested ses
										console.log('emp_month_attendance_data does not exist for requested ses ');
										let totP: any = no_of_days;

										if (item && item.attendanceRecords && item.attendanceRecords.length > 0) {
											const arrFilter: any[] = item.attendanceRecords;
											let absentDays = arrFilter.map(f => Number(f.attendanceStatus)).reduce((acc, val) => acc + (val == 0 ? 1 : 0), 0);
											element.absentDays = absentDays;
											lwpDays = absentDays > 0 ? absentDays : 0;
											totP = totP- lwpDays;
										} else if(item.shiftAttendanceDetails){
											if(item.shiftAttendanceDetails.length > 0) {
												let tempholyday = tempdateArray.filter(e => e.attendance == 'h');
												for (let index = 0; index < item.shiftAttendanceDetails.length; index++) {
													const element = item.shiftAttendanceDetails[index];
													const findex = tempholyday.findIndex(e => e.dateFormate == element.entrydate);
													if(findex != -1){
														item.shiftAttendanceDetails.splice(index,1);
													}
													
												}
												let absentDays = no_of_days - item.shiftAttendanceDetails.length - tempholyday.length;
												console.log('absentDays',absentDays);
												element.absentDays = absentDays;
												lwpDays = absentDays > 0 ? absentDays : 0;
												totP = totP- lwpDays;
											} else {
												let absentDays = no_of_days;
												element.absentDays = absentDays;
												lwpDays = absentDays > 0 ? absentDays : 0;
												totP = totP- lwpDays;
											}
											
										}
										if(this.globalSetting.attendance_calculation == 'manual'){
											totP = no_of_days;
											element.absentDays = 0;
											lwpDays = 0;
										}

										if(item.emp_salary_detail.emp_organisation_relation_detail.doj){
											let pDays = this.getPresentDayDOJ(item,inputJson.month_id,no_of_days);	
											if(pDays){
												totP = pDays;
											}
										}
										if (item.emp_status === 'left') {
											totP = this.getPresentDayDOL(item,inputJson.month_id,no_of_days);
										}

										element.emp_total_attendance = totP;
										element.emp_lwp = lwpDays;
										emp_attendance_detail = {};
										this.formGroupArray[j].formGroup.patchValue({
											emp_total_attendance: element.emp_total_attendance
										});
									}
		
									// if (Number(element.emp_total_attendance)) {
									// 	element.emp_total_attendance = element.emp_total_attendance &&
									// 		element.emp_lwp ? (Number(element.emp_total_attendance)
									// 			- Number(element.emp_lwp)) : Number(element.emp_total_attendance);
									// 	this.totalPresentArr.push(element.emp_total_attendance);
									// } else {
									// 	//this.holidayArray.length -
									// 	element.emp_total_attendance = Number(no_of_days) - 
									// 		(element.emp_lwp ?
									// 			Number(element.emp_lwp) : 0);
									// 	this.totalPresentArr.push(element.emp_total_attendance);
									// }
									console.log('before push element',element);
									this.EMPLOYEE_ELEMENT.push(element);
									this.employeeData.push(item);
									pos++;
									j++;
								} else {
									console.log('DOJ does not exist for employee no '+item.emp_code_no);
									this.commonAPIService.showSuccessErrorMessage('DOJ does not exist for employee no '+item.emp_code_no,'error');
									// missingDOJ.push(item.emp_code_no);
								}
							}
							this.COPY_EMPLOYEE_ELEMENT = JSON.parse(JSON.stringify(this.EMPLOYEE_ELEMENT));
							this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
							this.employeedataSource.paginator = this.paginator;
							if (this.sort) {
								this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
								this.employeedataSource.sort = this.sort;
							}
							// if(missingDOJ.length > 0) {
							// 	this.commonAPIService.showSuccessErrorMessage('DOJ does not exist for employee no '+missingDOJ,'error');
							// }

						}
						console.log('this.employeeData',this.employeeData);
					});
				}				
			});
			
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Choose Atlease one month', 'error');
		}
	
	}
	updateAttendance(element) {
		let inputJson = {};
		let employeeArrData = [];
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (Number(this.EMPLOYEE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
				var flag = false;
				let emp_month_attendance_data:any
				this.employeeData[i]['emp_month_attendance_data'].forEach(ema => {
					if(ema.ses_id == this.session_id.ses_id){
						emp_month_attendance_data = ema;
					}
				});
	
				let emp_leave_credited:any[]=[];
				let emp_leave_availed:any[]=[];
				let emp_leave_granted:any[]=[];
				let emp_balance_leaves:any[]=[];
				this.formGroupArray[i].formGroup.value.emp_leave_form.forEach(e => {
					const tempdataa = this.leaveTypeArray.find(f => f.leave_id == e.emp_leave_form.value.leave_id);
					console.log('tempdata',tempdataa);
					let tempavailed:any={};
					let tempgranted:any={};
					tempavailed.leave_id = tempdataa.leave_id;
					tempavailed.leave_name = tempdataa.leave_name;
					tempavailed.leave_value = e.emp_leave_form.value.leave_availed;
	
					tempgranted.leave_id = tempdataa.leave_id;
					tempgranted.leave_name = tempdataa.leave_name;
					tempgranted.leave_value = e.emp_leave_form.value.leave_granted;
					emp_leave_availed.push(tempavailed);
					emp_leave_granted.push(tempgranted);				
	
				});
				if (emp_month_attendance_data && emp_month_attendance_data['month_data'] && emp_month_attendance_data['month_data'].length > 0) {
					let tempmonthdata = emp_month_attendance_data['month_data'].find(f => f.month_id == this.searchForm.value.month_id);
					
					if (tempmonthdata && tempmonthdata.attendance_detail.emp_leave_credited &&
						tempmonthdata.attendance_detail.emp_leave_credited.length > 0) {
							emp_leave_credited = tempmonthdata.attendance_detail.emp_leave_credited;
							emp_balance_leaves = JSON.parse(JSON.stringify(tempmonthdata.attendance_detail.emp_leave_credited));
							emp_balance_leaves.forEach(element => {
								const tempind = emp_leave_granted.findIndex(e => e.leave_id == element.leave_id);
								if(tempind != -1){
									element.leave_value -= emp_leave_granted[tempind].leave_value;
								} 
							})
					}
				}
				inputJson["month_data"] = [];
				var monthJson = {
					"month_id": this.searchForm.value.month_id,
					"month_name": this.currentMonthName,
					"attendance_detail": {
						"emp_present": this.EMPLOYEE_ELEMENT[i]['emp_present'],
						"emp_leave_granted": emp_leave_granted,
						"emp_remarks": this.formGroupArray[i].formGroup.value.emp_remarks,
						"emp_leave_availed": emp_leave_availed,
						"emp_lwp": this.EMPLOYEE_ELEMENT[i]['emp_lwp'],
						"emp_total_attendance": this.formGroupArray[i].formGroup.value.emp_total_attendance,
						"emp_balance_leaves": emp_balance_leaves,
						"emp_leave_credited":emp_leave_credited
					}
				};
	
				if (Number(this.EMPLOYEE_ELEMENT[i]['emp_id']) === Number(this.formGroupArray[i].formGroup.value.emp_id)) {
					if (emp_month_attendance_data && emp_month_attendance_data['month_data']) {
						for (var j = 0; j < emp_month_attendance_data['month_data'].length; j++) {
							if (parseInt(emp_month_attendance_data['month_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
								flag = true;
							}
						}
						if (emp_month_attendance_data['month_data'].length > 0 && flag) {
							for (var j = 0; j < emp_month_attendance_data['month_data'].length; j++) {
								if (parseInt(emp_month_attendance_data['month_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
									emp_month_attendance_data['month_data'][j] = monthJson;
								}
							}
						} else {
							//inputJson["session_id"]["month_data"].push(monthJson);
							emp_month_attendance_data['month_data'].push(monthJson);
						}
					} else {
						inputJson["month_data"].push(monthJson);
						let isSessionExist = 0;
						this.employeeData[i]['emp_month_attendance_data'].forEach(ema => {
							if(ema.ses_id == this.session_id.ses_id){
								emp_month_attendance_data = inputJson;
								isSessionExist=1;
							}
						});
						if(isSessionExist == 0){
							if(!this.employeeData[i]['emp_month_attendance_data']){
								this.employeeData[i]['emp_month_attendance_data']=[];
							}
							inputJson['ses_id'] =  this.session_id.ses_id;
							this.employeeData[i]['emp_month_attendance_data'].push(inputJson)
						}
						//this.employeeData[i]['emp_month_attendance_data'] = inputJson;
					}
			}
			const filterArr:any[] = [];
			filterArr.push({
				emp_id: this.employeeData[i].emp_id,
				emp_month_attendance_data: this.employeeData[i].emp_month_attendance_data
			});
			console.log('filterArr',filterArr);
			this.commonAPIService.updateEmployeeDatainBulk(filterArr).subscribe((result: any) => {
				if (result) {
					this.getEmployeeDetail();
					this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
				} else {
					this.getEmployeeDetail();
					//this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
					this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Attendance', 'success');
				}
			},
			(errorResponse:any) => {
				this.commonAPIService.showSuccessErrorMessage('Error to update database, Structure is not valid', 'error');
			});

			}
		}
		
	}

	saveEmployeeAttendance() {
		
		this.disabledApiButton = true;
		let inputJson = {};
		let employeeArrData = [];
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			const employeeDataIndex = this.employeeData.findIndex(e => e.emp_id == this.EMPLOYEE_ELEMENT[i]['emp_id'])
			if(this.EMPLOYEE_ELEMENT[i]['emp_id'] == '63'){
				// console.log('this.EMPLOYEE_ELEMENT[i] --------------------63',this.EMPLOYEE_ELEMENT[i]);
				// console.log('this.formGroupArray[i] --------',this.formGroupArray[i]);
				// console.log('this.employeeData[i] --------',this.employeeData[i]);
			}
			var flag = false;
			let emp_month_attendance_data:any
			let employeeData = this.employeeData.find(e => e.emp_id == this.EMPLOYEE_ELEMENT[i]['emp_id'])
			employeeData['emp_month_attendance_data'].forEach(ema => {
				if(ema.ses_id == this.session_id.ses_id){
					emp_month_attendance_data = ema;
				}
			});

			let emp_leave_credited:any[]=[];
			let emp_leave_availed:any[]=[];
			let emp_leave_granted:any[]=[];
			let emp_balance_leaves:any[]=[];
			this.formGroupArray[i].formGroup.value.emp_leave_form.forEach(e => {
				const tempdataa = this.leaveTypeArray.find(f => f.leave_id == e.emp_leave_form.value.leave_id);
				// console.log('tempdata',tempdataa);
				let tempavailed:any={};
				let tempgranted:any={};
				tempavailed.leave_id = tempdataa.leave_id;
				tempavailed.leave_name = tempdataa.leave_name;
				tempavailed.leave_value = e.emp_leave_form.value.leave_availed;

				tempgranted.leave_id = tempdataa.leave_id;
				tempgranted.leave_name = tempdataa.leave_name;
				tempgranted.leave_value = e.emp_leave_form.value.leave_granted;
				emp_leave_availed.push(tempavailed);
				emp_leave_granted.push(tempgranted);				

			});
			if (emp_month_attendance_data && emp_month_attendance_data['month_data'] && emp_month_attendance_data['month_data'].length > 0) {
				let tempmonthdata = emp_month_attendance_data['month_data'].find(f => f.month_id == this.searchForm.value.month_id);
				if(this.EMPLOYEE_ELEMENT[i]['emp_id'] == '63'){
					console.log('tempmonthdata',JSON.parse(JSON.stringify(tempmonthdata)));
				}
				if (tempmonthdata && tempmonthdata.attendance_detail.emp_leave_credited &&
					tempmonthdata.attendance_detail.emp_leave_credited.length > 0) {
						emp_leave_credited = tempmonthdata.attendance_detail.emp_leave_credited;
						emp_balance_leaves = JSON.parse(JSON.stringify(tempmonthdata.attendance_detail.emp_leave_credited));
						emp_balance_leaves.forEach(element => {
							const tempind = emp_leave_granted.findIndex(e => e.leave_id == element.leave_id);
							if(tempind != -1){
								element.leave_value -= emp_leave_granted[tempind].leave_value;
							} 
						})
				}
			}
			inputJson["month_data"] = [];
			var monthJson = {
				"month_id": this.searchForm.value.month_id,
				"month_name": this.currentMonthName,
				"attendance_detail": {
					"emp_present": this.EMPLOYEE_ELEMENT[i]['emp_present'],
					"emp_leave_granted": emp_leave_granted,
					"emp_remarks": this.formGroupArray[i].formGroup.value.emp_remarks,
					"emp_leave_availed": emp_leave_availed,
					"emp_lwp": this.EMPLOYEE_ELEMENT[i]['emp_lwp'],
					"emp_total_attendance": this.formGroupArray[i].formGroup.value.emp_total_attendance,
					"emp_balance_leaves": emp_balance_leaves,
					"emp_leave_credited":emp_leave_credited
				}
			};

			if (Number(this.EMPLOYEE_ELEMENT[i]['emp_id']) === Number(this.formGroupArray[i].formGroup.value.emp_id)) {
				if (emp_month_attendance_data && emp_month_attendance_data['month_data']) {
					for (var j = 0; j < emp_month_attendance_data['month_data'].length; j++) {
						if (parseInt(emp_month_attendance_data['month_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
							flag = true;
						}
					}
					if (emp_month_attendance_data['month_data'].length > 0 && flag) {
						for (var j = 0; j < emp_month_attendance_data['month_data'].length; j++) {
							if (parseInt(emp_month_attendance_data['month_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
								emp_month_attendance_data['month_data'][j] = monthJson;
							}
						}
					} else {
						//inputJson["session_id"]["month_data"].push(monthJson);
						emp_month_attendance_data['month_data'].push(monthJson);
					}
					if(this.EMPLOYEE_ELEMENT[i]['emp_id'] == '63'){
						console.log('emp_month_attendance_data if--63 ',emp_month_attendance_data);
					}
				} else {
					inputJson["month_data"].push(monthJson);
					let isSessionExist = 0;
					employeeData['emp_month_attendance_data'].forEach(ema => {
						if(ema.ses_id == this.session_id.ses_id){
							emp_month_attendance_data = inputJson;
							isSessionExist=1;
						}
					});
					if(isSessionExist == 0){
						if(!employeeData['emp_month_attendance_data']){
							employeeData['emp_month_attendance_data']=[];
						}
						inputJson['ses_id'] =  this.session_id.ses_id;
						employeeData['emp_month_attendance_data'].push(inputJson)
					}
					//employeeData['emp_month_attendance_data'] = inputJson;
					if(this.EMPLOYEE_ELEMENT[i]['emp_id'] == '63'){
						console.log('emp_month_attendance_data else--63',employeeData['emp_month_attendance_data']);
					}
				}

			}
		}
		const filterArr: any[] = [];
		for (const item of this.employeeData) {
			// item.emp_month_attendance_data.forEach(element => {
			// 	if(element.ses_id == this.session_id.ses_id){
			// 		element.month_data=element.month_data
			// 	}
			// });
			filterArr.push({
				emp_id: item.emp_id,
				emp_month_attendance_data: item.emp_month_attendance_data
			});
		}
		console.log('filterArr',filterArr);
		this.commonAPIService.updateEmployeeDatainBulk(filterArr).subscribe((result: any) => {
			if (result) {
				this.disabledApiButton = false;
				this.getEmployeeDetail();
				this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
			} else {
				this.disabledApiButton = false;
				this.getEmployeeDetail();
				//this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
				this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Attendance', 'success');
			}
		},
		(errorResponse:any) => {
			this.commonAPIService.showSuccessErrorMessage(errorResponse.error, 'error');
		});
	}

	resetEmployeeAttendance() {
		this.getEmployeeDetail();
	}

	editAttendance(element) {
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (this.EMPLOYEE_ELEMENT[i]['emp_id'] === element.emp_id) {
				element.viewFlag = true;
				element.updateFlag = true;
			}
		}
	}

	editAll() {
		this.editAllStatus = false;
		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (!this.EMPLOYEE_ELEMENT[i]['viewFlag']) {
				this.EMPLOYEE_ELEMENT[i]['viewFlag'] = true;
				this.EMPLOYEE_ELEMENT[i]['updateFlag'] = true;
			}

		}
		//this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	}

	resetAll() {
		this.editAllStatus = true;
		this.getEmployeeDetail();
	}
	getLWP(element, index,i) {
		console.log('getLWP',element,index,i);
		if (Number(this.formGroupArray[index].formGroup.value.emp_leave_form[i].emp_leave_form.value.leave_granted) > Number(this.formGroupArray[index].formGroup.value.emp_leave_form[i].emp_leave_form.value.leave_availed)) {
			// this.EMPLOYEE_ELEMENT[index]['emp_lwp'] = "0";
			// this.formGroupArray[index].formGroup.patchValue({
			// 	emp_leave_granted: 0,
			// 	emp_leave_availed: 0
			// });
			this.commonAPIService.showSuccessErrorMessage('You cannot grant more leave than availed', 'error');
		} else {
			let la=0;
			let lg=0;
			this.formGroupArray[index].formGroup.value.emp_leave_form.forEach(e => {
				la+=Number(e.emp_leave_form.value.leave_availed);
				lg+=Number(e.emp_leave_form.value.leave_granted);
			});
			if(element.absentDays && element.absentDays > 0){
				this.EMPLOYEE_ELEMENT[index]['emp_lwp'] = element.absentDays-lg;
			} else {
				this.EMPLOYEE_ELEMENT[index]['emp_lwp'] =la-lg;
			}
			//this.EMPLOYEE_ELEMENT[index]['emp_lwp'] =la-lg;
			this.EMPLOYEE_ELEMENT[index]['emp_total_attendance'] = element.emp_present - this.EMPLOYEE_ELEMENT[index]['emp_lwp'];
			this.formGroupArray[index].formGroup.patchValue({
				emp_total_attendance:this.EMPLOYEE_ELEMENT[index]['emp_total_attendance']
			});
		}

	}
	getLWP1(element, index,i) {
		console.log('getLWP',element,index,i);
		this.EMPLOYEE_ELEMENT[index]['emp_lwp'] = element.emp_present - this.formGroupArray[index].formGroup.value.emp_total_attendance;

	}

	getPresentDayDOJ(item:any,month_id,no_of_days){
		let presentDays = no_of_days;
		if(item.emp_salary_detail.emp_organisation_relation_detail.doj){
			this.sessionDetails
			const month = new Date(item.emp_salary_detail.emp_organisation_relation_detail.doj).getMonth() + 1;
			if (Number(month_id) == month) {
				var yaer='';
				if ((month == 1	|| month == 2 || month == 3)) {
					 yaer = this.sessionDetails.ses_name.split('-')[1];
				} else {
					 yaer = this.sessionDetails.ses_name.split('-')[0];
				}
				let joinyear = new Date(item.emp_salary_detail.emp_organisation_relation_detail.doj).getFullYear();
				if(Number(yaer) == joinyear){
					let absentDays = new Date(item.emp_salary_detail.emp_organisation_relation_detail.doj).getDate() - 1;
					presentDays = Number(no_of_days) - Number(absentDays);
					return presentDays;
				}													
			}	
		}
		return null;
	}
	getPresentDayDOL(item:any,month_id,no_of_days){
		let presentDays = no_of_days;
		if (item.emp_status === 'left') {
			const month: any = item.emp_salary_detail
				&& item.emp_salary_detail.emp_organisation_relation_detail
				&& item.emp_salary_detail.emp_organisation_relation_detail.dol ?
				new Date(item.emp_salary_detail.emp_organisation_relation_detail.dol).getMonth() : ''
			if (Number(month_id) === Number(month) + 1) {
				presentDays = new Date(item.emp_salary_detail.emp_organisation_relation_detail.dol).getDate();
			}
		}
		return presentDays;
	}

	getMonthName(ev) {
		this.currentMonthName = ev.source.selected.viewValue;
		if (Number(ev.value) === 1 || Number(ev.value) === 2 || Number(ev.value) === 3) {
			this.currSess = this.sessionName.split('-')[1];
		} else {
			this.currSess = this.sessionName.split('-')[0];
		}

	}
	getStatusName(ev) {
		this.currentStatusName = ev.source.selected.viewValue;
	}

	getCategoryName(ev) {
		this.currentCategoryName = ev.source.selected.viewValue;
	}

	cancelUpdate(element) {
		// this.getEmployeeDetail();

		for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
			if (Number(this.EMPLOYEE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
				this.EMPLOYEE_ELEMENT[i] = this.COPY_EMPLOYEE_ELEMENT[i];
			}
		}

		element.updateFlag = false;
		element.viewFlag = false;
	}

	// updateAttendance(element) {
	// 	let inputJson = {};
	// 	let employeeArrData = [];
	// 	for (var i = 0; i < this.EMPLOYEE_ELEMENT.length; i++) {
	// 		if (Number(this.EMPLOYEE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {

	// 			let emp_month_attendance_data:any
	// 			this.employeeData[i]['emp_month_attendance_data'].forEach(ema => {
	// 				if(ema.ses_id == this.session_id.ses_id){
	// 					emp_month_attendance_data = ema;
	// 				}
	// 			});

	// 			let emp_leave_credited:any[]=[];
	// 			let emp_leave_availed:any[]=[];
	// 			let emp_leave_granted:any[]=[];
	// 			let emp_balance_leaves:any[]=[];
	// 			this.formGroupArray[i].formGroup.value.emp_leave_form.forEach(e => {
	// 				const tempdataa = this.leaveTypeArray.find(f => f.leave_id == e.emp_leave_form.value.leave_id);
	// 				console.log('tempdata',tempdataa);
	// 				let tempavailed:any={};
	// 				let tempgranted:any={};
	// 				tempavailed.leave_id = tempdataa.leave_id;
	// 				tempavailed.leave_name = tempdataa.leave_name;
	// 				tempavailed.leave_value = e.emp_leave_form.value.leave_availed;

	// 				tempgranted.leave_id = tempdataa.leave_id;
	// 				tempgranted.leave_name = tempdataa.leave_name;
	// 				tempgranted.leave_value = e.emp_leave_form.value.leave_granted;
	// 				emp_leave_availed.push(tempavailed);
	// 				emp_leave_granted.push(tempgranted);				

	// 			});
	// 			if (emp_month_attendance_data && emp_month_attendance_data['month_data'] && emp_month_attendance_data['month_data'].length > 0) {
	// 				let tempmonthdata = emp_month_attendance_data['month_data'].find(f => f.month_id == this.searchForm.value.month_id);
					
	// 				if (tempmonthdata.attendance_detail.emp_leave_credited &&
	// 					tempmonthdata.attendance_detail.emp_leave_credited.length > 0) {
	// 						emp_leave_credited = tempmonthdata.attendance_detail.emp_leave_credited;
	// 						emp_balance_leaves = JSON.parse(JSON.stringify(tempmonthdata.attendance_detail.emp_leave_credited));
	// 						emp_balance_leaves.forEach(element => {
	// 							const tempind = emp_leave_granted.findIndex(e => e.leave_id == element.leave_id);
	// 							if(tempind != -1){
	// 								element.leave_value -= emp_leave_granted[tempind].leave_value;
	// 							} 
	// 						})
	// 				}
	// 			}
	// 			inputJson["month_data"] = [];
	// 			var monthJson = {
	// 				"month_id": this.searchForm.value.month_id,
	// 				"month_name": this.currentMonthName,
	// 				"attendance_detail": {
	// 					"emp_present": this.EMPLOYEE_ELEMENT[i]['emp_present'],
	// 					"emp_leave_granted": emp_leave_granted,
	// 					"emp_remarks": this.formGroupArray[i].formGroup.value.emp_remarks,
	// 					"emp_leave_availed": emp_leave_availed,
	// 					"emp_lwp": this.EMPLOYEE_ELEMENT[i]['emp_lwp'],
	// 					"emp_total_attendance": this.EMPLOYEE_ELEMENT[i]['emp_total_attendance'],
	// 					"emp_balance_leaves": emp_balance_leaves,
	// 					"emp_leave_credited":emp_leave_credited
	// 				}
	// 			};
	// 			if (this.EMPLOYEE_ELEMENT[i]['action'] && this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data'] && this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data']['month_data']) {
	// 				for (var j = 0; j < this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data']['month_data'].length; j++) {
	// 					if (parseInt(this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data']['month_data'][j].month_id, 10) === parseInt(this.searchForm.value.month_id, 10)) {
	// 						this.EMPLOYEE_ELEMENT[i]['action']['emp_month_attendance_data']['month_data'][j] = inputJson;
	// 						employeeArrData.push(this.EMPLOYEE_ELEMENT[i]['action']);
	// 					}
	// 				}
	// 			}

	// 		}
	// 	}
	// 	if (employeeArrData.length > 0) {
	// 		const filterArr: any[] = [];
	// 		for (const item of this.employeeData) {
	// 			filterArr.push({
	// 				emp_id: item.emp_id,
	// 				emp_month_attendance_data: item.emp_month_attendance_data
	// 			});
	// 		}
	// 		this.commonAPIService.updateEmployeeDatainBulk(filterArr).subscribe((result: any) => {
	// 			if (result && result.status === 'ok') {
	// 				this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
	// 				this.getEmployeeDetail();
	// 			} else {
	// 				this.commonAPIService.showSuccessErrorMessage('Employee Attendance Updated Successfully', 'success');
	// 				//this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Attendance', 'success');
	// 			}

	// 		});
	// 	} else {
	// 		this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Attendance', 'success');
	// 	}

	// }

	applyFilter(filterValue: String) {
		console.log('filterValue', filterValue);
		this.employeedataSource.filter = filterValue.trim().toLowerCase();
	}

}

export interface EmployeeElement {
	srno: number;
	emp_id: string;
	emp_name: string;
	emp_designation: string;
	//emp_present: any;
	emp_leave_availed: any;
	emp_leave_granted: any;
	emp_lwp: any;
	emp_total_attendance: any;
	emp_balance_leaves: any;
	emp_remarks: any;
	emp_status: string;
	action: any;
}
