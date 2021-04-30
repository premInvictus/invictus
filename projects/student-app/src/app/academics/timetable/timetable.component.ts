import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';
import { ZoomMtg } from '@zoomus/websdk';
import { DatePipe } from '@angular/common';
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
	selector: 'app-timetable',
	templateUrl: './timetable.component.html',
	styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

	currentUser: any;
	userDetail: any;
	today = new Date();
	ELEMENT_DATA:any= [];
	dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	subCountArray: any[] = [];
	subjectArray: any[] = [];
	finalCountArray: any = [];
	classwisetableArray: any = [];
	classwiseArray: any = [];
	subjectwiseFlag = false;
	finaldivflag = true;
	dayArray:any[] = [];
	noOfDay: any;
	session:any;
	timeTableFlag: boolean;
	noData: boolean;
	week_day: any;
	weekArr: any[];
	week: any;
	displayedColumns = ['snno', 'subject','start', 'end', 'action'];
	pageLength: any;
	paginator: any;
	access_key: any;

	constructor(
		private qelementService: QelementService,
		private erpCommonService: ErpCommonService,
		private commonAPIService: CommonAPIService,
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getSubject();
		this.session = JSON.parse(localStorage.getItem('session'));
		this.qelementService.getUser({ login_id: this.currentUser.login_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					console.log('userDetail', this.userDetail);
					this.getclasswisedetails();
					this.getClassSectionWiseTimeTable();
				}
			});
			this.commonAPIService.getGlobalSetting({ gs_alias: 'onlne_session_key' }).subscribe((res:any) => {
				this.access_key = JSON.parse(res.data[0].gs_value);
			})
	}
	getClassSectionWiseTimeTable() {
		this.dayArray = [];
		this.timeTableFlag = false;
		this.noData = false;
		const param: any = {};
		param.class_id = this.userDetail.au_class_id;
		param.sec_id = this.userDetail.au_sec_id;
		if (this.week_day) {
			param.week_day = this.week_day;
		}
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
		this.erpCommonService.getClassSectionWiseTimeTable(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.weekArr = [];
				this.dayArray = result.data.data;
				if (!(result.data.data)) {
					this.noData = true;
				}
				this.week_day = Number(result.data.day_of_week);
				let itemNO = 1;
				this.dayArray.forEach((element:any) => {
					console.log("i am element", element);
					
					let obj:any = {
						snno: itemNO,
						start:element.tsoc_start_time,
						end: element.tsoc_end_time,
						subject: element.subject_name,
						action: element,
						period: itemNO
					}
					this.ELEMENT_DATA.push(obj);
					itemNO++;
				})
				this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.pageLength = this.ELEMENT_DATA.length;
				this.timeTableFlag = true;
				for (let i = 0; i < result.data.no_of_day; i++) {
					if (Number(result.data.today_day_of_week) - 1 === i) {
						this.weekArr.push('Today');
					} else {
						this.weekArr.push(this.week[i]);
					}
				}
			}
		});
		console.log("i am here", this.dayArray);
		
	}
	openclass(item) {
		const studentParam: any = {};
		studentParam.au_class_id = this.userDetail.au_class_id;
		studentParam.au_sec_id = this.userDetail.au_sec_id;
		studentParam.au_event_id = parseInt(item.no_of_period) + 1;
		studentParam.ma_created_date = new DatePipe('en-us').transform(new Date(), 'yyyy-MM-dd');
		studentParam.au_role_id = '4';
		studentParam.au_status = '1';
		this.erpCommonService.getUserAttendance(studentParam).subscribe((res:any) => {
			console.log("i am res",res.data);
			let check = [];
			res.data.forEach(element => {
				if(element.au_login_id == this.userDetail.au_login_id && element.ma_attendance == '1') {
					check.push(element);
				}
			});
			if(check.length == 0) {
				let sendd = [
					{
						class_id:this.userDetail.au_class_id,
						sec_id:this.userDetail.au_sec_id,
						ma_event:parseInt(item.no_of_period) + 1,
						ma_created_date:new DatePipe('en-us').transform(new Date(), 'yyyy-MM-dd'),
						login_id:this.userDetail.au_login_id,
						roll_no: '',
						attendance:1,
						session_id:this.session.ses_id,
						created_by:this.userDetail.au_login_id
					}
				]
				
				this.erpCommonService.insertAttendance(sendd).subscribe((res:any)=> {
					console.log("i am res", res);
					
				})
			}
			
		})
		if(item.tsoc_type == 'zoom') {
		let spliturl = item.tsoc_url.split('/')[4];
		let mId = spliturl.split('?')[0];
		let pwd = spliturl.split("pwd=")[1];
		let name:any = {};
		this.access_key.forEach(element => {
			if(element.name == 'zoom') {
				name = element;
			}
		});

		
		
		
		let signature = ZoomMtg.generateSignature({
			meetingNumber: mId,
			apiKey: name.apiacess,
			apiSecret:  name.apisecret,
			role: '0'
		  });
		  document.getElementById('zmmtg-root').style.display = 'block'

		  ZoomMtg.init({
			leaveUrl: window.location.href,
			isSupportAV: true,
			success: (success) => {
			  console.log(success, signature);
	  
			  ZoomMtg.join({
				signature: signature,
				meetingNumber: mId,
				userName:this.userDetail.au_full_name,
				apiKey: name.apiacess,
				userEmail: '',
				passWord: pwd,
				success: (success) => {
				  console.log(success)
				},
				error: (error) => {
				  console.log(error)
				}
			  })
	  
			},
			error: (error) => {
			  console.log(error)
			}
		  }) 
		} else {
			
			this.commonAPIService.showSuccessErrorMessage("No class assigned", 'error')
		}
		
	}
	getSubject() {
		this.erpCommonService.getSubject({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				this.subjectArray = result.data;
			}
		});
	}
	getSubjectColor(sub_id) {
		for (let i = 0; i < this.subjectArray.length; i++) {
			if (this.subjectArray[i].sub_id === sub_id) {
				return this.subjectArray[i].sub_color;
			}
		}
		return '#059DFD';
	}
	getclasswisedetails() {
		this.subCountArray = [];
		this.finalCountArray = [];
		this.classwisetableArray = [];
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.userDetail.au_class_id;
		timetableparam.tt_section_id = this.userDetail.au_sec_id;
		this.erpCommonService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.finaldivflag = false;
						this.subjectwiseFlag = true;
						this.noOfDay = result.data[0].no_of_day;
						const param: any = {};
						param.td_tt_id = result.data[0].tt_id;
						if (param.td_tt_id !== '') {
							this.erpCommonService.getClasswiseDetails(param)
								.subscribe(
									(final_result: any) => {
										if (final_result && final_result.status === 'ok') {
											this.classwiseArray = [];
											this.classwiseArray = final_result.data;
											for (let i = 0; i < this.classwiseArray.length; i++) {
												this.classwisetableArray.push({
													'classwise': JSON.parse(this.classwiseArray[i].td_no_of_day)
												});
											}
											console.log(this.noOfDay);
											console.log(this.classwisetableArray);
											for (const item of this.classwisetableArray) {
												for (const titem of item.classwise) {
													const findex = this.subCountArray.findIndex(f => f.subject_name === titem.subject_name);
													if (findex === -1) {
														this.subCountArray.push({
															'subject_name': titem.subject_name,
															'count': 1,
														});
													} else {
														this.subCountArray[findex].count = this.subCountArray[findex].count + 1;

													}
												}
											}
											for (const citem of this.subCountArray) {
												this.finalCountArray[citem.subject_name] = citem.count;
											}
										}
									});
						}
					} else {
						this.commonAPIService.showSuccessErrorMessage('No Record Found', 'error');
						this.finaldivflag = true;
						this.subjectwiseFlag = false;
					}
				});

	}

}
