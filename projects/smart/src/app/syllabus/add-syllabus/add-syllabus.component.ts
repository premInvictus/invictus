import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
			currentUser: any;
			public subjectArray: any[];
			constructor(
				private fbuild: FormBuilder,
				private syllabusservice: SyllabusserviceService,
			) { }

			ngOnInit() {
				this.buildForm();
				this.getClass();
				this.getTermList();
				
			}

			buildForm() {
				this.parameterform = this.fbuild.group({
						class_id: '',
						sub_id: '',
						term_id: ''
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
			this.syllabusservice.getSubjectsByClass(this.parameterform.value.class_id)
					.subscribe(
							(result: any) => {
									if (result && result.status === 'ok') {
											this.subjectArray = result.data;
									} else {
											this.subjectArray = [];
											//this.notif.showSuccessErrorMessage('No Record Found', 'error');
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
}
