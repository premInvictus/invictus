import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { UpdateConfirmationComponent } from './update-confirmation/update-confirmation.component';

@Component({
	selector: 'app-topicwise-update',
	templateUrl: './topicwise-update.component.html',
	styleUrls: ['./topicwise-update.component.css']
})
export class TopicwiseUpdateComponent implements OnInit {

	topicwiseforForm: FormGroup;
	subjectArray: any[] = [];
	categoryArray: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	classSectionArray: any[] = [];
	teacherId = '';
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
		) {}

	openUpdateConfirmation() {
		const dialogRef = this.dialog.open(UpdateConfirmationComponent, {
			height: '400px',
			width: '550px'
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	ngOnInit() {
		this.buildForm();
	}
	buildForm() {
		this.topicwiseforForm = this.fbuild.group({
			tw_teacher_id: '',
			teacher_name: '',
			tw_class_id: '',
			tw_sub_id: ''
		});
	}
	getTeacherInfo(event) {
		console.log(event.target.value);
		this.teacherId = event.target.value;
		this.axiomService.getAllTeacher({login_id: event.target.value, role_id: '3', status: '1'}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				this.topicwiseforForm.patchValue({
					teacher_name : result.data[0].au_full_name
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				this.topicwiseforForm.patchValue({
					tw_teacher_id: '',
					teacher_name : ''
				});
			}
		});
	}
	getClassByTeacherId() {
		this.classArray = [];
		this.classSectionArray = [];
		this.smartService.getClassByTeacherId({ teacher_id: this.teacherId}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					if (this.classArray.length > 0 ) {
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

		this.smartService.getSubjectByTeacherIdClassIdSectionId({ teacher_id: this.teacherId,
			class_id: csArray[0], sec_id: csArray[1] }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}

	getTopicwise() {
		console.log('calling gettopicwise');
	}	

}
