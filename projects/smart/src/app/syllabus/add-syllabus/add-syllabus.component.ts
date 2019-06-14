import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonAPIService } from '../../_services';
import { SyllabusserviceService } from './../syllabusservice.service';
@Component({
	selector: 'app-add-syllabus',
	templateUrl: './add-syllabus.component.html',
	styleUrls: ['./add-syllabus.component.css']
})
export class AddSyllabusComponent implements OnInit {
			public parameterform: FormGroup;
			modalForm: FormGroup;
			public classArray: any[];
			public termArray: any[];
			public ctrArray: any[];
			currentUser: any;
			public subjectArray: any[];
			constructor(
				private fbuild: FormBuilder,
				private syllabusservice: SyllabusserviceService,
				public common: CommonAPIService,
			) { }

			ngOnInit() {
				this.buildForm();
				this.getClass();
				this.getTermList();
				this.ctrList();

			}

			buildForm() {
				this.parameterform = this.fbuild.group({
						syl_class_id: '',
						syl_sub_id: '',
						syl_term_id: ''
				});
				this.modalForm = this.fbuild.group({
						qus_unpublish_remark: ['', Validators.required],
						reason_id: ['', Validators.required],
				});
		}
		getClass() {
				this.syllabusservice.getClass()
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.classArray = result.data;
										}
								}
						);
		}

		getSubjectsByClass(): void {
			this.syllabusservice.getSubjectsByClass(this.parameterform.value.syl_class_id)
					.subscribe(
							(result: any) => {
									if (result && result.status === 'ok') {
											this.subjectArray = result.data;
									} else {
											this.subjectArray = [];
											this.common.showSuccessErrorMessage('No Record Found', 'error');
									}
							}
					);
			}
		getTermList() {
				this.syllabusservice.getTermList()
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.termArray = result.data;
										}
								}
						);
		}
		ctrList() {
			this.syllabusservice.ctrList()
					.subscribe(
							(result: any) => {
									if (result && result.status === 'ok') {
											this.ctrArray = result.data;
									}
							}
					);
		}

		submit() {
			if (this.parameterform.valid) {
				this.syllabusservice.insertSyllabus(this.parameterform.value).subscribe((result: any) => {
				});
			} else {
				this.common.showSuccessErrorMessage('Please fill all required field', 'error');
			}
		}
}
