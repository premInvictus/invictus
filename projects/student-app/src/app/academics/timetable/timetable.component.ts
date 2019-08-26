import { Component, OnInit } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';

@Component({
	selector: 'app-timetable',
	templateUrl: './timetable.component.html',
	styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

	currentUser: any;
  userDetail: any;
  today = new Date();

	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	subCountArray: any[] = [];
	subjectArray: any[] = [];
	finalCountArray: any = [];
	classwisetableArray: any = [];
	classwiseArray: any = [];
	subjectwiseFlag = false;
	finaldivflag = true;
	noOfDay: any;
	constructor(
		private qelementService: QelementService,
		private erpCommonService: ErpCommonService,
		private commonAPIService: CommonAPIService,
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getSubject();
		this.qelementService.getUser({ login_id: this.currentUser.login_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					console.log('userDetail', this.userDetail);
					this.getclasswisedetails();
				}
			});
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
