import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { ReviewClassworkComponent } from './review-classwork/review-classwork.component';
import {AssignmentAttachmentDialogComponent } from '../../smart-shared/assignment-attachment-dialog/assignment-attachment-dialog.component';

@Component({
	selector: 'app-classwork-update',
	templateUrl: './classwork-update.component.html',
	styleUrls: ['./classwork-update.component.css']
})
export class ClassworkUpdateComponent implements OnInit {

	classworkForm: FormGroup;
	noOfPeriods = 2;
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	reviewClasswork: any[] = [];
	subjectArray: any[] = [];
	categoryArray: any[] = [];
	classArray: any[] = [];
	sectiontArray: any[] = [];
	topicArray: any[] = [];
	subtopicArray: any[] = [];
	teacherId = '';
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.teacherId = '1239';
		this.buildForm();
		this.getSubjectByTeacherId();
		this.ctrList();
	}
	buildForm() {
		this.classworkForm = this.fbuild.group({
			periods: this.fbuild.array([])
		});
		for (let i = 0; i < this.noOfPeriods; i++) {
			this.addPeriods(i + 1, '2', '1625');
			this.reviewClasswork.push({
				period: i + 1,
				subjectName: '',
				categoryName: '',
				className: '',
				sectionName: '',
				topicName: '',
				subtopicName: '',
				assignment: ''
			});
		}

	}

	get Periods() {
		return this.classworkForm.get('periods') as FormArray;
	}

	addPeriods(period, sesId, teacherId) {
		this.Periods.push(this.fbuild.group({
			cw_teacher_id: teacherId,
			cw_period_id: period,
			cw_sub_id: ['', Validators.required],
			cw_ctr_id: ['', Validators.required],
			cw_class_id: ['', Validators.required],
			cw_sec_id: ['', Validators.required],
			cw_topic_id: ['', Validators.required],
			cw_st_id: ['', Validators.required],
			cw_ses_id: sesId,
			cw_assignment_desc: '',
			cw_entry_date: '',
			cw_attachment: []
		}));
	}

	reviewElementSubject(index, event) {
		this.reviewClasswork[index].subjectName = this.subjectArray.find(item => item.sub_id === event.value).sub_name;
		console.log(this.reviewClasswork[index]);
	}
	reviewElementCategory(index, event) {
		this.reviewClasswork[index].categoryName = this.categoryArray.find(item => item.ctr_id === event.value).ctr_name;
		console.log(this.reviewClasswork[index]);
	}
	reviewElementClass(index, event) {
		this.reviewClasswork[index].className = this.classArray[index].find(item => item.class_id === event.value).class_name;
		console.log(this.reviewClasswork[index]);
	}
	reviewElementSection(index, event) {
		this.reviewClasswork[index].sectionName = this.sectiontArray[index].find(item => item.sec_id === event.value).sec_name;
		console.log(this.reviewClasswork[index]);
	}
	reviewElementTopic(index, event) {
		this.reviewClasswork[index].topicName = this.topicArray[index].find(item => item.topic_id === event.value).topic_name;
		console.log(this.reviewClasswork[index]);
	}
	reviewElementSubtopic(index, event) {
		this.reviewClasswork[index].subtopicName = this.subtopicArray[index].find(item => item.st_id === event.value).st_name;
		console.log(this.reviewClasswork[index]);
	}
	reviewElementAssignment(index, event) {
		this.reviewClasswork[index].assignment = event.target.value;
		console.log(this.reviewClasswork[index]);
	}
	getSubjectByTeacherId() {
		this.subjectArray = [];
		this.smartService.getSubjectByTeacherId({ teacher_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}
	getClassByTeacherIdSubjectId(i) {
		console.log(this.Periods);
		const eachPeriodFG = this.Periods.controls[i];
		console.log(eachPeriodFG);
		this.classArray[i] = [];
		this.smartService.getClassByTeacherIdSubjectId({ teacher_id: this.teacherId, sub_id: eachPeriodFG.value.cw_sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray[i] = result.data;
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
		this.smartService.ctrList().subscribe((result: any) => {
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
		this.axiomService.getTopicByClassSubject(eachPeriodFG.value.cw_class_id, eachPeriodFG.value.cw_sub_id).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.topicArray[i] = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubtopicByTopic(i) {
		this.subtopicArray[i] = [];
		const eachPeriodFG = this.Periods.controls[i];
		this.axiomService.getSubtopicByTopic(eachPeriodFG.value.cw_topic_id).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subtopicArray[i] = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	cancelForm() {
		console.log(this.classworkForm);
		console.log(this.classworkForm.value);
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
				console.log('The dialog was closed');
				console.log(dresult);
				if (dresult && dresult.data) {
					console.log('submitting form');
					if (this.classworkForm.valid) {
						this.smartService.classworkInsert(this.classworkForm.value).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
								this.resetClasswork();
							}
						});
					}
				}
			});
		}

	}
	resetClasswork() {
		this.classworkForm.reset();
		this.reviewClasswork = [];
	}

	attachmentDialog(currentAttachmentIndex) {
		const eachPeriodFG = this.Periods.controls[currentAttachmentIndex];
		const dialogRef = this.dialog.open(AssignmentAttachmentDialogComponent, {
			width: '1000px',
			height: '50%',
			data: {
				page: 'classwork',
				title: 'Assignment',
				edit: false,
				currentAttachmentIndex: currentAttachmentIndex,
				attachments: eachPeriodFG.value.cw_attachment ? eachPeriodFG.value.cw_attachment : [],
				class_id: eachPeriodFG.value.cw_class_id,
				sec_id: eachPeriodFG.value.cw_sec_id,
				sub_id: eachPeriodFG.value.cw_sub_id,
				topic_id: eachPeriodFG.value.cw_topic_id,
				st_id: eachPeriodFG.value.cw_st_id,
				assignment_desc: eachPeriodFG.value.cw_assignment_desc
			}
		});
		dialogRef.afterClosed().subscribe(dresult => {
			console.log('clossing dialog');
			console.log(dresult);
			if (dresult && dresult.attachments) {
				eachPeriodFG.patchValue({
					cw_attachment: dresult.attachments
				});
			}
			console.log('eachPeriodFG', eachPeriodFG);
		});
	}

}
