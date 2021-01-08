import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { ReviewClassworkComponent } from './review-classwork/review-classwork.component';
// tslint:disable-next-line: max-line-length
import { AssignmentAttachmentDialogComponent } from '../../smart-shared/assignment-attachment-dialog/assignment-attachment-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-classwise-update',
  templateUrl: './classwise-update.component.html',
  styleUrls: ['./classwise-update.component.css']
})
export class ClasswiseUpdateComponent implements OnInit {

  classworkForm: FormGroup;
	classworkforForm: FormGroup;
	noOfPeriods = 2;
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	reviewClasswork: any[] = [];
	subjectArray: any[] = [];
	categoryArray: any[] = [];
  classArray: any[] = [];
  sectionArray:any[] = [];
	sectiontArray: any[] = [];
	classSectionArray: any[] = [];
	topicArray: any[] = [];
	subtopicArray: any[] = [];
	teacherId = '';
	teacherArray: any[] = [];
	currentUser: any;
	session: any;
	entry_date = new Date();
	noDataFlag = true;
	isTeacher = false;
	disableSubtopicArray: any[] = [];
	disabletopicArray: any[] = [];
	disableClassArray: any[] = [];
	disableSubjectArray: any[] = [];
	timetabledata: any[] = [];
  disabledApiButton = false;
  classwisetableArray:any[]=[];
  noOfDay;
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		private dialog: MatDialog,
		public router: Router,
		public route: ActivatedRoute
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.teacherId = this.currentUser.login_id;
		this.buildForm();
		if (this.currentUser.role_id === '3') {
			this.isTeacher = true;
			this.noDataFlag = false;
		}
		this.getSubjectByTeacherId();
    this.ctrList();
    this.getClass();
	}
	changeDate(){
		this.classworkforForm.patchValue({
			cw_teacher_id: '',
			teacher_name: ''
		});
		this.resetClasswork();
		this.noDataFlag = true;
	}
	buildForm() {
		this.classworkForm = this.fbuild.group({
			periods: this.fbuild.array([])
		});
		this.classworkforForm = this.fbuild.group({
			// cw_teacher_id: '',
			// teacher_name: '',
      cw_entry_date: this.entry_date,
      cw_sec_id:'',
      cw_class_id:''
		});
		this.smartService.getMaxPeriod().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.noOfPeriods = result.data.no_of_period;
				for (let i = 0; i < this.noOfPeriods; i++) {
          // this.addPeriods(i + 1, this.teacherId);
          this.addPeriods(i + 1, '');
					this.disableSubtopicArray[i] = false;
					this.disabletopicArray[i] = false;
					this.disableClassArray[i] = false;
					this.disableSubjectArray[i] = false;
				}
				this.generateReviewArray();
			}
		});

  }
  getClass() {
		this.classArray = [];
		this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSectionsByClass() {
		this.sectionArray = [];
		this.smartService.getSectionsByClass({ class_id: this.classworkforForm.value.cw_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
  }
  getSubjectsByClass() {
		const subjectParam: any = {};
		subjectParam.class_id = this.classworkforForm.value.cw_class_id ;
		subjectParam.sub_timetable=1;
		this.smartService.getSubjectsByClass(subjectParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
            console.log(this.subjectArray);
            this.noDataFlag = false;
					} else {
						this.subjectArray = [];
					}
				}
			);
  }
  getclasswisedetails() {
		this.classwisetableArray = [];
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.classworkforForm.value.cw_class_id;
		timetableparam.tt_section_id = this.classworkforForm.value.cw_sec_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.noOfDay = result.data[0].no_of_day;
						const param: any = {};
						param.td_tt_id = result.data[0].tt_id;
						if (param.td_tt_id !== '') {
							this.smartService.getClasswiseDetails(param)
								.subscribe(
									(final_result: any) => {
										if (final_result && final_result.status === 'ok') {
											this.classwisetableArray = [];
										let classwiseArray = [];
											classwiseArray = final_result.data;
											for (let i = 0; i < classwiseArray.length; i++) {
												this.classwisetableArray.push({
													'classwise': JSON.parse(classwiseArray[i].td_no_of_day)
												});
											}
											console.log(this.classwisetableArray);
										}
									});
						}
					} else {
						this.commonAPIService.showSuccessErrorMessage('No Record Found', 'error');
					}
				});
	}
	generateReviewArray() {
		this.reviewClasswork = [];
		for (let i = 0; i < this.noOfPeriods; i++) {
			this.reviewClasswork.push({
				period: i + 1,
				subjectName: '',
				categoryName: '',
				className: '',
				sectionName: '',
				topicName: '',
				subtopicName: '',
				assignment: '',
				attachments: 0
			});
		}
	}

	get Periods() {
		return this.classworkForm.get('periods') as FormArray;
	}

	addPeriods(period, teacherId) {
		this.Periods.push(this.fbuild.group({
			cw_teacher_id: teacherId,
			cw_period_id: period,
			cw_ctr_id: ['', Validators.required],
			cw_sub_id: ['', Validators.required],
			cw_class_id: ['', Validators.required],
			cw_sec_id: '',
			cw_topic_id: ['', Validators.required],
			cw_st_id: ['', Validators.required],
			cw_assignment_desc: '',
			cw_entry_date: '',
			cw_attachment: []
		}));
	}
	disableSt(index, event) {
		const eachPeriodFG: any = this.Periods.controls[index];
		if (event.value === '2' || event.value === '3' || event.value === '5' || event.value === '6') {
			eachPeriodFG.controls['cw_st_id'].clearValidators(Validators.required);
			this.disableSubtopicArray[index] = true;
			eachPeriodFG.patchValue({
				cw_st_id: '0'
			});
			this.getClassSectionByTeacherIdSubjectId(index, false);
		} else if (event.value === '8') {
			eachPeriodFG.controls['cw_sub_id'].clearValidators(Validators.required);
			eachPeriodFG.controls['cw_class_id'].clearValidators(Validators.required);
			eachPeriodFG.controls['cw_topic_id'].clearValidators(Validators.required);
			eachPeriodFG.controls['cw_st_id'].clearValidators(Validators.required);
			this.disableSubjectArray[index] = true;
			this.disableClassArray[index] = true;
			this.disabletopicArray[index] = true;
			this.disableSubtopicArray[index] = true;
			// console.log(eachPeriodFG.controls);
			eachPeriodFG.patchValue({
				cw_sub_id: '0',
				cw_class_id: '0',
				cw_sec_id: '0',
				cw_topic_id: '0',
				cw_st_id: '0'
			});
		} else if (event.value === '7') {
			eachPeriodFG.controls['cw_sub_id'].clearValidators(Validators.required);
			eachPeriodFG.controls['cw_topic_id'].clearValidators(Validators.required);
			eachPeriodFG.controls['cw_st_id'].clearValidators(Validators.required);
			this.disableSubjectArray[index] = true;
			this.disabletopicArray[index] = true;
			this.disableSubtopicArray[index] = true;
			eachPeriodFG.patchValue({
				cw_sub_id: '0',
				cw_topic_id: '0',
				cw_st_id: '0'
			});
			this.getAllClassSection(index);
		} else {
			eachPeriodFG.controls['cw_sub_id'].setValidators(Validators.required);
			eachPeriodFG.controls['cw_st_id'].setValidators(Validators.required);
			eachPeriodFG.controls['cw_topic_id'].setValidators(Validators.required);
			eachPeriodFG.controls['cw_class_id'].setValidators(Validators.required);
			this.disableSubjectArray[index] = false;
			this.disableSubtopicArray[index] = false;
			this.disabletopicArray[index] = false;
			this.disableClassArray[index] = false;
			this.getClassSectionByTeacherIdSubjectId(index, false);
		}
	}

	reviewElementSubject(index, event) {
		if (event.value) {
			this.reviewClasswork[index].subjectName = this.subjectArray.find(item => item.sub_id === event.value).sub_name;
		}
		// console.log(this.reviewClasswork[index]);
	}
	reviewElementCategory(index, event) {
		if (event.value) {
			this.reviewClasswork[index].categoryName = this.categoryArray.find(item => item.ctr_id === event.value).ctr_name;
		}
		// console.log(this.reviewClasswork[index]);
	}
	reviewElementClass(index, event) {
		if (event.value) {
			this.reviewClasswork[index].className = this.classSectionArray[index].find(item => item.cs_id === event.value).cs_name;
		}
		// console.log(this.reviewClasswork[index]);
	}
	reviewElementSection(index, event) {
		if (event.value) {
			this.reviewClasswork[index].sectionName = this.sectiontArray[index].find(item => item.sec_id === event.value).sec_name;
		}
		// console.log(this.reviewClasswork[index]);
	}
	reviewElementTopic(index, event) {
		if (event.value) {
			this.reviewClasswork[index].topicName = this.topicArray[index].find(item => item.topic_id === event.value).topic_name;
		}
		// console.log(this.reviewClasswork[index]);
	}
	reviewElementSubtopic(index, event) {
		if (event.value) {
			this.reviewClasswork[index].subtopicName = this.subtopicArray[index].find(item => item.st_id === event.value).st_name;
		}
		// console.log(this.reviewClasswork[index]);
	}
	reviewElementAssignment(index, value) {
		this.reviewClasswork[index].assignment = value;
		// console.log(this.reviewClasswork[index]);
	}
	getSubjectByTeacherId() {
		this.subjectArray = [];
		this.smartService.getSubjectByTeacherId({ teacher_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getAllClassSection(i) {
		const eachPeriodFG = this.Periods.controls[i];
		this.classSectionArray[i] = [];
		this.smartService.getAllClassSection().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				const csArray = result.data;
					if (csArray.length > 0) {
						csArray.forEach(element => {
							this.classSectionArray[i].push({
								cs_id: element.class_id + '-' + element.sec_id,
								cs_name: element.class_name + ' - ' + element.sec_name
							});
						});
					}

			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getClassByTeacherIdSubjectId(i) {
		// console.log(this.Periods);
		const eachPeriodFG = this.Periods.controls[i];
		// console.log(eachPeriodFG);
		this.classArray[i] = [];
		this.resetClassworkFormForSubjectChange(i);
		this.smartService.getClassByTeacherIdSubjectId({ teacher_id: this.teacherId, sub_id: eachPeriodFG.value.cw_sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray[i] = result.data;
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	getClassSectionByTeacherIdSubjectId(i, resetflag = true) {
		// console.log(this.Periods);
		const eachPeriodFG = this.Periods.controls[i];
		// console.log(eachPeriodFG);
		this.classSectionArray[i] = [];
		if (resetflag) {
			this.resetClassworkFormForSubjectChange(i);
		}
		this.smartService.getClassSectionByTeacherIdSubjectId({ teacher_id: this.teacherId, sub_id: eachPeriodFG.value.cw_sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					const csArray = result.data;
					if (csArray.length > 0) {
						csArray.forEach(element => {
							this.classSectionArray[i].push({
								cs_id: element.class_id + '-' + element.sec_id,
								cs_name: element.class_name + ' - ' + element.sec_name
							});
						});
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	getSectionByTeacherIdSubjectIdClassId(i) {
		this.sectiontArray[i] = [];
		const eachPeriodFG = this.Periods.controls[i];
		this.smartService.getSectionByTeacherIdSubjectIdClassId({
			teacher_id: this.teacherId, sub_id: eachPeriodFG.value.cw_sub_id,
			class_id: eachPeriodFG.value.cw_class_id
		}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectiontArray[i] = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	ctrList() {
		this.categoryArray = [];
		this.smartService.cwCtrList().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.categoryArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getTopicByClassSubject(i) {
		this.topicArray[i] = [];
		const eachPeriodFG = this.Periods.controls[i];
		eachPeriodFG.patchValue({
			cw_st_id: ''
		});
		const csArray = eachPeriodFG.value.cw_class_id.split('-');
		const param: any = { class_id: this.classworkforForm.value.cw_class_id, sub_id: eachPeriodFG.value.cw_sub_id };
		this.smartService.getTopicByClassIdSubjectId(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.topicArray[i] = result.data;
				param.sec_id = csArray[1];
				param.tw_ctr_id = '1';
				this.smartService.getTopicwiseCTR(param).subscribe((result1: any) => {
					if(result1 && result1.status === 'ok') {
						const temptopic: any = result1.data;
						temptopic.forEach(element => {
							if(element.tw_status === '1') {
								const index = this.topicArray[i].findIndex(e => e.topic_id === element.topic_id);
								console.log(index);
								this.topicArray[i].splice(index,1);
							}
						});
					}
				})
			} else {
				//this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubtopicByTopic(i) {
		this.subtopicArray[i] = [];
		const eachPeriodFG = this.Periods.controls[i];
		this.smartService.getSubtopicByTopicId({ topic_id: eachPeriodFG.value.cw_topic_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subtopicArray[i] = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	cancelForm() {
		// console.log(this.classworkForm);
		// console.log(this.classworkForm.value);
	}
	classworkInsert() {

	}
	openReviewClasswork() {
		if (this.classworkForm.valid) {
			const dialogRef = this.dialog.open(ReviewClassworkComponent, {
				width: '1000px',
				height: '50%',
				data: this.reviewClasswork
			});
			dialogRef.afterClosed().subscribe(dresult => {
				this.disabledApiButton = true;
				if (dresult && dresult.data) {
					if (this.classworkForm.valid) {
						this.Periods.controls.forEach((eachFormGroup: FormGroup) => {
							Object.keys(eachFormGroup.controls).forEach(key => {
								if (key === 'cw_class_id') {
									if (eachFormGroup.value.cw_class_id !== '') {
										const csArray = eachFormGroup.value.cw_class_id.split('-');
										eachFormGroup.patchValue({
											cw_class_id: csArray[0],
											cw_sec_id: csArray[1]
										});
									} else {
										eachFormGroup.patchValue({
											cw_class_id: '',
											cw_sec_id: ''
										});
									}
								}
								if (!this.isTeacher) {
									if (key === 'cw_teacher_id') {
										eachFormGroup.patchValue({
											cw_teacher_id: this.classworkforForm.value.cw_teacher_id
										});
									}
									if (key === 'cw_entry_date') {
										eachFormGroup.patchValue({
											cw_entry_date: this.commonAPIService.dateConvertion(this.classworkforForm.value.cw_entry_date)
										});
									}
								} else {
									if (key === 'cw_teacher_id') {
										eachFormGroup.patchValue({
											cw_teacher_id: this.teacherId
										});
									}
									if (key === 'cw_entry_date') {
										eachFormGroup.patchValue({
											cw_entry_date: ''
										});
									}
								}
							});
						});
						this.smartService.classworkInsert(this.classworkForm.value).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								this.disabledApiButton = false;
								this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
								// this.resetClasswork();
								this.router.navigate(['../view-classwork'], { relativeTo: this.route });
							} else {
								this.disabledApiButton = false;
								this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
							}
						});
					}
				}
			});
		} else {
			this.classworkForm.markAsDirty();
			this.commonAPIService.showSuccessErrorMessage('Please Fill all required field','error');
		}

	}
	resetClasswork() {
		this.resetClassworkForm();
		this.generateReviewArray();
	}

	attachmentDialog(currentAttachmentIndex) {
		const eachPeriodFG = this.Periods.controls[currentAttachmentIndex];
		if (eachPeriodFG.valid) {
			const csArray = eachPeriodFG.value.cw_class_id.split('-');
			const dialogRef = this.dialog.open(AssignmentAttachmentDialogComponent, {
				width: '1000px',
				height: '50%',
				data: {
					page: 'classwork',
					title: 'Add Assignment',
					edit: false,
					currentAttachmentIndex: currentAttachmentIndex,
					attachments: eachPeriodFG.value.cw_attachment ? eachPeriodFG.value.cw_attachment : [],
					class_id: csArray[0],
					sec_id: csArray[1],
					sub_id: eachPeriodFG.value.cw_sub_id,
					topic_id: eachPeriodFG.value.cw_topic_id,
					st_id: eachPeriodFG.value.cw_st_id,
					assignment_desc: eachPeriodFG.value.cw_assignment_desc
				}
			});
			dialogRef.afterClosed().subscribe(dresult => {
				// console.log('clossing dialog');
				// console.log(dresult);
				if (dresult && dresult.assignment_desc) {
					eachPeriodFG.patchValue({
						cw_assignment_desc: dresult.assignment_desc,
						cw_attachment: dresult.attachments
					});
					this.reviewElementAssignment(currentAttachmentIndex, dresult.assignment_desc);
					this.reviewClasswork[currentAttachmentIndex].attachments = dresult.attachments.length;
				}
				// console.log('eachPeriodFG', eachPeriodFG);
			});

		}
	}
	getTeacherInfo(event) {
		// console.log(event.target.value);
		this.teacherArray = [];
		if (event.target.value) {
			this.generateReviewArray();
			this.axiomService.getAllTeacher({ full_name: event.target.value, role_id: '3', status: '1' }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArray = result.data;
					// console.log(result.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					this.noDataFlag = true;
					this.classworkforForm.patchValue({
						cw_teacher_id: '',
						teacher_name: ''
					});					
				}
				this.resetClassworkForm();
			});
		}
	}
	setTeacherId(teacherDetails) {
		this.resetClasswork();
		this.noDataFlag = false;
		this.classworkforForm.patchValue({
			teacher_name: teacherDetails.au_full_name,
			cw_teacher_id: teacherDetails.au_login_id
		});
		this.teacherId = teacherDetails.au_login_id;
		this.getSubjectByTeacherId();
		this.getTeacherwiseTableDetails(teacherDetails.au_login_id);

	}
	getClassSectionByTeacherIdSubjectIdAndPatch(i, resetflag = true,value) {
		// console.log(this.Periods);
		const eachPeriodFG = this.Periods.controls[i];
		// console.log(eachPeriodFG);
		this.classSectionArray[i] = [];
		if (resetflag) {
			this.resetClassworkFormForSubjectChange(i);
		}
		this.smartService.getClassSectionByTeacherIdSubjectId({ teacher_id: this.teacherId, sub_id: eachPeriodFG.value.cw_sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					const csArray = result.data;
					if (csArray.length > 0) {
						csArray.forEach(element => {
							this.classSectionArray[i].push({
								cs_id: element.class_id + '-' + element.sec_id,
								cs_name: element.class_name + ' - ' + element.sec_name
							});
						});
						eachPeriodFG.patchValue({
							cw_class_id: value,
							cw_ctr_id: '1'
						});
						if(eachPeriodFG.value.cw_class_id && eachPeriodFG.value.cw_sub_id) {
							this.getTopicByClassSubject(i);
							this.reviewElementClass(i,{value: eachPeriodFG.value.cw_class_id});
						}
						this.reviewElementCategory(i,{value: eachPeriodFG.value.cw_ctr_id});
						this.disableSt(i,{value: eachPeriodFG.value.cw_ctr_id})
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	patchTeacherPeriod(dayofweek, ttd) {
		dayofweek = dayofweek - 1 >= 0 ? dayofweek -1 : 6;
		for(let i=0; i<ttd.length;i++) {
			const control = this.Periods.controls[i];
			console.log(control);
			if (control instanceof FormGroup) {
				if(ttd[i][dayofweek].subject_id !== '' && ttd[i][dayofweek].subject_id !== '-') {
					control.patchValue({
						cw_sub_id: ttd[i][dayofweek].subject_id
					});
					this.getClassSectionByTeacherIdSubjectId(i);
					this.reviewElementSubject(i,{value: control.value.cw_sub_id});
					this.getClassSectionByTeacherIdSubjectIdAndPatch(i,false,ttd[i][dayofweek].class_id + '-' + ttd[i][dayofweek].sec_id);
				} else {
					control.patchValue({
						cw_ctr_id: '8'
					});
					this.reviewElementCategory(i,{value: control.value.cw_ctr_id});
					this.disableSt(i,{value: control.value.cw_ctr_id})
				}
			}
		}
		console.log(this.Periods);
	}
	getTeacherwiseTableDetails(teacherId){
		const param: any = {};
		param.uc_login_id = teacherId;
		this.smartService.getTeacherwiseTableDetails(param).subscribe((result: any) => {
			if(result && result.status === 'ok') {
				this.timetabledata = result.data.tabledata;
				let dayofweek = 0;
				if(this.classworkforForm.value.cw_entry_date instanceof moment) {
					dayofweek = this.classworkforForm.value.cw_entry_date.day();
				} else {
					dayofweek = this.classworkforForm.value.cw_entry_date.getDay();
				}
				if(this.timetabledata.length > 0) {
				this.patchTeacherPeriod(dayofweek, this.timetabledata);
				}
			}
		})
	}

	/* getTeacherInfo(event) {
		// console.log(event.target.value);
		this.teacherId = event.target.value;
		this.axiomService.getAllTeacher({login_id: event.target.value, role_id: '3', status: '1'}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				// console.log(result.data);
				this.classworkforForm.patchValue({
					teacher_name : result.data[0].au_full_name
				});
				// console.log(this.classworkForm.value);
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				this.classworkforForm.patchValue({
					cw_teacher_id: '',
					teacher_name : ''
				});
				this.resetClassworkForm();
			}
		});
	} */
	resetClassworkForm() {
		this.Periods.controls.forEach((eachFormGroup: FormGroup) => {
			Object.keys(eachFormGroup.controls).forEach(key => {
				if (key === 'cw_period_id' || key === 'cw_teacher_id') {
				} else {
					eachFormGroup.controls[key].reset();
				}
			});
		});
		// console.log(this.classworkForm.value);
	}
	resetClassworkFormForSubjectChange(i) {
		const eachPeriodFG = <FormGroup>this.Periods.controls[i];
		Object.keys(eachPeriodFG.controls).forEach(key => {
			if (key === 'cw_period_id' || key === 'cw_teacher_id' || key === 'cw_sub_id') {
			} else {
				eachPeriodFG.controls[key].reset();
			}
		});
		this.sectiontArray[i] = [];
		this.topicArray[i] = [];
		this.subtopicArray[i] = [];
		// console.log(this.classworkForm.value);
	}

}