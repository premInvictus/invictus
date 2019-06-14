import { Component, OnInit } from '@angular/core';
import {FormGroup, FormArray, FormBuilder} from '@angular/forms';
import { AxiomService, SisService, SmartService } from '../../_services';

@Component({
	selector: 'app-classwork-update',
	templateUrl: './classwork-update.component.html',
	styleUrls: ['./classwork-update.component.css']
})
export class ClassworkUpdateComponent implements OnInit {

	classworkForm: FormGroup;
	noOfPeriods = 8;
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	reviewClasswork: any[] = [];
	subjectArray: any[] = [];
	categoryArray: any[] = [];
	classArray: any[] = [];
	sectiontArray: any[] = [];
	topicArray: any[] = [];
	subtopicArray: any[] = [];
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService
	) { }

	ngOnInit() {
		this.buildForm();
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
			cw_sub_id: '',
			cw_ctr_id: '',
			cw_class_id: '',
			cw_sec_id: '',
			cw_topic_id: '',
			cw_st_id: '',
			cw_ses_id: sesId,
			cw_assignment_desc: '',
			cw_entry_date: ''
		}));
	}

	reviewElementSubject(index, event) {
		
	}
	reviewElementCategory(index, event) {
		
	}
	reviewElementClass(index, event) {
		
	}
	reviewElementSection(index, event) {
		
	}
	reviewElementTopic(index, event) {
		
	}
	reviewElementSubtopic(index, event) {
		
	}
	reviewElementAssignment(index, event) {
		
	}
	getSubjectByTeacherId() {

	}
	getClassByTeacherIdSubjectId() {

	}
	getSectionByTeacherIdSubjectIdClassId() {

	}
	classworkInsert() {
		
	}

}

@Component({
	selector: 'review-classwork',
	templateUrl: 'review-classwork.html',
})

export class ReviewClasswork { }
