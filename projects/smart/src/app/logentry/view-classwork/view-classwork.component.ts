import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { EditClassworkModalComponent } from './edit-classwork-modal/edit-classwork-modal.component';

@Component({
	selector: 'app-view-classwork',
	templateUrl: './view-classwork.component.html',
	styleUrls: ['./view-classwork.component.css']
})
export class ViewClassworkComponent implements OnInit {

	paramForm: FormGroup;
	teacherArray: any[] = [];
	classworkArray: any[] = [];
	teacherId = '';
	currentUser: any = {};
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	noDataFlag = true;
	toMin = new Date();
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.teacherId = this.currentUser.login_id;
			this.paramForm.patchValue({
				teacher_id: this.currentUser.login_id
			});
			this.getClasswork();
		}
	}

	openEditClassworkModal(value) {
		const dialogRef = this.dialog.open(EditClassworkModalComponent, {
			width: '600px',
			height: '50%',
			data: value
		});
		dialogRef.afterClosed().subscribe(dresult => {
			if (dresult && dresult.update) {
				if (dresult.update === 'success') {
					this.getClasswork();
				}
			}
		});
	}
	buildForm() {
		this.paramForm = this.fbuild.group({
			teacher_name: '',
			teacher_id: ['', Validators.required],
			from: [new Date(), Validators.required],
			to: [new Date(), Validators.required]
		});
	}
	setMinTo(event) {
		this.toMin = event.value;
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
					this.classworkArray = [];
					this.noDataFlag = true;

				}
			});
		}
	}
	setTeacherId(teacherDetails) {
		this.paramForm.patchValue({
			teacher_name: teacherDetails.au_full_name,
			teacher_id: teacherDetails.au_login_id
		});
		this.teacherId = teacherDetails.au_login_id;
		this.getClasswork();
	}

	getClassworkForDate(datestr, cwarray) {
		const tempcw: any[] = [];
		if (cwarray.length > 0) {
			cwarray.forEach(item => {
				if (this.commonAPIService.dateConvertion(item.cw_entry_date) === datestr) {
					tempcw.push(item);
				}
			});
		}
		return tempcw;
	}
	getClasswork() {
		if (this.paramForm.valid) {
			this.classworkArray = [];
			const param: any = {};
			if (this.paramForm.value.teacher_id) {
				param.teacher_id = this.paramForm.value.teacher_id;
			}
			if (this.paramForm.value.from) {
				param.from = this.commonAPIService.dateConvertion(this.paramForm.value.from);
			}
			if (this.paramForm.value.to) {
				param.to = this.commonAPIService.dateConvertion(this.paramForm.value.to);
			}
			this.smartService.getClasswork(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.noDataFlag = false;
					console.log(result.data);
					const tempcw = result.data;
					const dateSet = new Set();
					if (tempcw.length > 0) {
						tempcw.forEach(element => {
							dateSet.add(this.commonAPIService.dateConvertion(new Date(element.cw_entry_date)));
						});
					}
					dateSet.forEach(item => {
						this.classworkArray.push({
							cw_entry_date: item,
							cw_array: this.getClassworkForDate(item, tempcw)
						});
					});
					console.log(this.classworkArray);

				} else {
					this.noDataFlag = true;
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select teacher name', 'error');
		}
	}

}
