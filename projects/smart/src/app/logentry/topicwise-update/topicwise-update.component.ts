import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { UpdateConfirmationComponent } from './update-confirmation/update-confirmation.component';
import { element } from '@angular/core/src/render3/instructions';

@Component({
	selector: 'app-topicwise-update',
	templateUrl: './topicwise-update.component.html',
	styleUrls: ['./topicwise-update.component.css']
})
export class TopicwiseUpdateComponent implements OnInit {

	topicwiseforForm: FormGroup;
	teacherArray: any[] = [];
	subjectArray: any[] = [];
	categoryArray: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	classSectionArray: any[] = [];
	teacherId = '';
	topicsubtopicArray: any[] = [];
	topicCTRArray: any[] = [];
	topicsubtopicDetailsArray: any[] = [];
	currentUser: any;
	noDataFlag = true;
	isTeacher = false;
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) { }

	openUpdateConfirmation(param) {
		const dialogRef = this.dialog.open(UpdateConfirmationComponent, {
			height: '400px',
			width: '550px',
			data: {
				tw_status: param.tw_status
			}
		});

		dialogRef.afterClosed().subscribe(dresult => {
			console.log(dresult);
			if (dresult) {
				if  (dresult.tw_entry_date) {
					param.tw_entry_date = this.commonAPIService.dateConvertion(dresult.tw_entry_date);
				}
				if  (dresult.mod_review_remark) {
					param.mod_review_remark = dresult.mod_review_remark;
				}
				if (dresult.update) {
					this.topicwiseInsert(param);
				}
			}
		});
	}

	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.teacherId = this.currentUser.login_id;
		if (this.currentUser.role_id === '3') {
			this.isTeacher = true;
			this.getClassByTeacherId();
		}
	}
	buildForm() {
		this.topicwiseforForm = this.fbuild.group({
			tw_teacher_id: '',
			teacher_name: '',
			tw_class_sec_id: '',
			tw_sub_id: ''
		});
	}
	topicwiseInsert(value) {
		this.smartService.topicwiseInsert(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result);
				this.getTopicwiseDetails();
			}
		});
	}
	getTeacherInfo(event) {
		console.log(event.target.value);
		this.teacherArray = [];
		if (event.target.value) {
			this.axiomService.getAllTeacher({ full_name: event.target.value, role_id: '3', status: '1' }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArray = result.data;
					console.log(result.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					this.topicsubtopicDetailsArray = [];
					this.noDataFlag = true;
					this.topicwiseforForm.patchValue({
						teacher_name: '',
						tw_teacher_id: '',
						tw_class_sec_id: '',
						tw_sub_id: ''
					});
				}
			});
		}
	}
	setTeacherId(teacherDetails) {
		this.topicwiseforForm.patchValue({
			teacher_name: teacherDetails.au_full_name,
			tw_teacher_id: teacherDetails.au_login_id,
			tw_class_sec_id: '',
			tw_sub_id: ''
		});
		this.noDataFlag = true;
		this.teacherId = teacherDetails.au_login_id;
		this.topicsubtopicDetailsArray = [];
		this.getClassByTeacherId();
	}
	getClassByTeacherId() {
		this.classArray = [];
		this.classSectionArray = [];
		this.smartService.getClassByTeacherId({ teacher_id: this.teacherId }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					if (this.classArray.length > 0) {
						this.classArray.forEach(item => {
							this.smartService.getSectionByTeacherIdClassId({
								teacher_id: this.teacherId,
								class_id: item.class_id
							}).subscribe((result1: any) => {
								if (result1 && result1.status === 'ok') {
									this.sectionArray = result1.data;
									if (this.sectionArray.length > 0) {
										this.sectionArray.forEach(item2 => {
											this.classSectionArray.push({
												cs_id: item.class_id + '-' + item2.sec_id,
												cs_name: item.class_name + ' - ' + item2.sec_name
											});
										});
									}
								}
							});
						});
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	getSubjectByTeacherIdClassIdSectionId(event) {
		const csArray = event.value.split('-');
		console.log(csArray);
		this.subjectArray = [];
		this.topicwiseforForm.patchValue({
			tw_sub_id: ''
		});
		this.noDataFlag = true;
		this.topicsubtopicDetailsArray = [];
		this.smartService.getSubjectByTeacherIdClassIdSectionId({
			teacher_id: this.teacherId,
			class_id: csArray[0], sec_id: csArray[1]
		}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
				/* if (this.subjectArray.length === 1) {
					this.topicwiseforForm.patchValue({
						tw_sub_id: this.subjectArray[0].sub_id
					});
				} */
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}

	getCTRStatus(tw_topic_id, tw_ctr_id, arr) {
		if (arr.length > 0) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].tw_topic_id === tw_topic_id && arr[i].tw_ctr_id === tw_ctr_id) {
					return { tw_status: arr[i].tw_status, tw_ctr_id: arr[i].tw_ctr_id, tw_entry_date: arr[i].tw_entry_date };
				}
			}
			return '';
		} else {
			return '';
		}
	}
	getTopicwiseDetails() {
		if (this.topicwiseforForm.value.tw_class_sec_id && this.topicwiseforForm.value.tw_sub_id) {
			const csArray = this.topicwiseforForm.value.tw_class_sec_id.split('-');
			const param: any = {};
			param.class_id = csArray[0];
			param.sec_id = csArray[1];
			param.sub_id = this.topicwiseforForm.value.tw_sub_id;
			this.smartService.getSubtopicCountAndDetail(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.noDataFlag = false;
					console.log('result', result.data);
					this.topicsubtopicArray = result.data;
					Object.assign(this.topicsubtopicDetailsArray, result.data);
					this.topicsubtopicDetailsArray.forEach(item => {
						item.courseCompleted = '';
						item.revisionDone = '';
						item.testConducted = '';
					});
					console.log('topicsubtopicDetailsArray', this.topicsubtopicDetailsArray);
					this.smartService.getTopicwiseCTR(param).subscribe((result1: any) => {
						if (result1 && result1.status === 'ok') {
							console.log(result1.data);
							this.topicCTRArray = result1.data;
							this.topicsubtopicDetailsArray.forEach(item => {
								item.courseCompleted = this.getCTRStatus(item.topic_id, '1', this.topicCTRArray);
								item.revisionDone = this.getCTRStatus(item.topic_id, '3', this.topicCTRArray);
								item.testConducted = this.getCTRStatus(item.topic_id, '2', this.topicCTRArray);
							});
							console.log(this.topicsubtopicDetailsArray);
						}
					});
				} else {
					this.topicsubtopicDetailsArray = [];
					this.noDataFlag = true;
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		}
	}

	toggleStatus(i, ctr, ctrStatus) {
		const csArray = this.topicwiseforForm.value.tw_class_sec_id.split('-');
		const param: any = {};
		param.tw_teacher_id = this.topicwiseforForm.value.tw_teacher_id;
		param.tw_class_id = csArray[0];
		param.tw_sec_id = csArray[1];
		param.tw_topic_id = this.topicsubtopicDetailsArray[i].topic_id;
		param.tw_ctr_id = ctr;
		if (ctrStatus && ctrStatus.tw_status === '1') {
			console.log('calling unpublish');
			param.tw_status = '0';
		} else {
			console.log('calling publish');
			param.tw_status = '1';
		}
		this.openUpdateConfirmation(param);
	}

}
