import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { CommonAPIService } from '../../../../_services/index';
import { ManageUsersService } from '../../../service/manage-users.service';
import { environment } from '../../../../../environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SearchTeacherComponent } from './search-teacher/search-teacher.component';

@Component({
	selector: 'app-view-teacher-profile',
	templateUrl: './view-teacher-profile.component.html',
	styleUrls: ['./view-teacher-profile.component.scss']
})

export class ViewTeacherProfileComponent implements OnInit {

	dialogRef: MatDialogRef<SearchTeacherComponent>;
	Teacher_Form: FormGroup;
	Cs_relation_Form: FormGroup;
	Personal_Form: FormGroup;
	Qualification_Form: FormGroup;
	Documents_Form: FormGroup;
	Remark_Form: FormGroup;
	schoolinfoArray: any = {};
	hosturl = environment.apiUrl;
	currentTeacherLoginIndex: number;
	schoolId: number;
	url: any;
	cs_relationArray: any[] = [];
	teacherArray: any[] = [];
	teacherArrayByName: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	subjectArray: any[] = [];
	projectsArray: any[] = [];
	designation: any;
	userDetails: any = {};
	public role_id: any;
	homeUrl: string;
	current_Pro_id: string;
	login_id;
	currentClass: string;
	currentSection: string;
	currentSubject: string;
	department: any;
	updateFlag = false;
	config = TreeviewConfig.create({
		hasAllCheckBox: true,
		hasFilter: true,
		hasCollapseExpand: true,
		decoupleChildFromParent: false,
		maxHeight: 400
	});
	constructor(
		private dialog: MatDialog,
		private commonAPIService: CommonAPIService,
		private manageUsersService: ManageUsersService,
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private router: Router
	) { }
	ngOnInit() {
		this.login_id = this.route.snapshot.queryParams['login_id'];
		this.getAllTeacherList();
		if (this.route.snapshot.queryParams['login_id']) {
			const param: any = {};
			param.role_id = '3';
			param.login_id = this.login_id;
			this.getUserDetail(param);
		}
		this.homeUrl = this.commonAPIService.getUrl();
		this.buildForm();
		this.getSchool();
		// this.getUserDetail('');
	}
	getAllTeacherList() {
		const param: any = {};
		param.role_id = '3';
		param.status = 1;
		this.manageUsersService.getAllTeacher(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArray = result.data;
					if (this.teacherArray.length > 0) {
						this.currentTeacherLoginIndex = this.teacherArray.findIndex(item => item.uc_login_id === this.login_id);
					} else {
						this.commonAPIService.showSuccessErrorMessage('No Record Found', 'error');
					}
				} else {
					this.teacherArray = [];
				}
			}
		);
	}
	getAllTeacherListByName(param) {
		this.manageUsersService.getUser(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArrayByName = result.data;
				}
			}
		);
	}
	getUserDetail(param) {
		if (param) {
			this.manageUsersService.getUser(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						if (result.data.length > 0) {
							this.userDetails = result.data[0];
							this.Teacher_Form.controls.au_login_id.setValue(this.userDetails.au_login_id);
							this.Teacher_Form.controls.au_full_name.setValue(this.userDetails.au_full_name);
							this.Teacher_Form.controls.au_mobile.setValue(this.userDetails.au_mobile);
							this.Teacher_Form.controls.au_email.setValue(this.userDetails.au_email);
							this.cs_relationArray = this.userDetails.cs_relations;
							for (const item of this.cs_relationArray) {
								this.designation = item.uc_designation;
								this.department = item.uc_department;
							}
							this.updateFlag = true;
						}
					}
				}
			);
		}
	}
	getTeacherDetail(nextTeacherLoginIndex) {
		if (nextTeacherLoginIndex > -1 && nextTeacherLoginIndex < this.teacherArray.length) {
			this.currentTeacherLoginIndex = nextTeacherLoginIndex;
			this.router.navigate(['../view-teacher-profile'],
				{ queryParams: { login_id: this.teacherArray[this.currentTeacherLoginIndex].au_login_id }, relativeTo: this.route });
			const param: any = {};
			param.role_id = '3';
			param.login_id = this.teacherArray[this.currentTeacherLoginIndex].au_login_id;
			this.getUserDetail(param);
		}
	}
	getTeacherByLoginid(value) {
		const param: any = {};
		param.role_id = '3';
		param.login_id = value;
		this.router.navigate(['../view-teacher-profile'], { queryParams: { login_id: value }, relativeTo: this.route });
		this.getUserDetail(param);
	}
	buildForm() {
		this.Teacher_Form = this.fbuild.group({
			au_profileimage: '',
			au_full_name: '',
			au_mobile: '',
			au_email: '',
			au_role_id: '3',
			au_login_id: ''
		});
		this.Cs_relation_Form = this.fbuild.group({
			uc_class_id: '',
			uc_sec_id: '',
			uc_sub_id: '',
			uc_designation: '',
			uc_department: ''
		});
		this.Personal_Form = this.fbuild.group({
			upd_adhaar_no: ['', Validators.required],
			upd_dob: '',
			upd_gender: '',
			upd_martial_status: '',
			upd_doj: '',
			upd_cit_id: '',
			upd_sta_id: '',
			upd_spouse_name: '',
			upd_spouse_education: '',
			upd_spouse_occupation: '',
			upd_spouse_designation: '',
			upd_spouse_mobile: '',
			upd_spouse_email: '',
			upd_address: '',
			upd_spouse_pincode: ''
		});
		this.Qualification_Form = this.fbuild.group({
			uq_id: '',
			uq_percentage: '',
			uq_subject: '',
			uq_skill: '',
			uq_achievemnet: '',
			uq_board: '',
			uq_passing_year: '',
			uc_sub_id: '',
			uh_name: '',
			ue_id: '',
			ue_from_date: '',
			ue_to_date: '',
			ue_designation: '',
			ue_role: ''
		});
		this.Documents_Form = this.fbuild.group({
			upd_photo: '',
			upd_aadhaar_no: '',
			upd_pan: '',
			upd_qualification: '',
			upd_form: '',
			upd_resume: '',
			upd_certificate: '',
			upd_others: ''
		});
		this.Remark_Form = this.fbuild.group({
			uc_reference: '',
			uc_appraisal: '',
			uc_interviewe: '',
			uc_other: ''
		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}
	getSchool() {
		this.manageUsersService.getSchool().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.schoolinfoArray = result.data[0];
				}
			},
		);
	}
	getSubjectsByClass(): void {
		this.manageUsersService.getSubjectsByClass(this.Cs_relation_Form.value.uc_class_id).subscribe(
			(result: any) => {
				if (result) {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			}
		);
	}

	getSectionsByClass(): void {
		this.manageUsersService.getSectionsByClass(this.Cs_relation_Form.value.uc_class_id).subscribe(
			(result: any) => {
				if (result) {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			}
		);
	}
	searchTeacherByName(name) {
		const param: any = {};
		param.role_id = '3';
		param.status = '1';
		param.full_name = name;
		this.getAllTeacherListByName(param);
	}
	getTeacherDetailByName(login_id) {
		const param: any = {};
		param.role_id = '3';
		param.status = '1';
		param.login_id = login_id;
		this.getUserDetail(param);
	}
	searchTeacher(): void {
		const dialogRef = this.dialog.open(SearchTeacherComponent, {
			width: '850px',
			data: {}
		});


	}
}
