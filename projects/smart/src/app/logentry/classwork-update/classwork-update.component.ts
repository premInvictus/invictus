import { Component, OnInit } from '@angular/core';
import {FormGroup, FormArray, FormBuilder} from '@angular/forms';

@Component({
	selector: 'app-classwork-update',
	templateUrl: './classwork-update.component.html',
	styleUrls: ['./classwork-update.component.css']
})
export class ClassworkUpdateComponent implements OnInit {

	classworkForm: FormGroup;
	noOfPeriods = 8;
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	constructor(
		private fbuild: FormBuilder
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

}

@Component({
	selector: 'review-classwork',
	templateUrl: 'review-classwork.html',
})
