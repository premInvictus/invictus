import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms';
import { QelementService } from '../../../../questionbank/service/qelement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcsetupService } from '../../../../acsetup/service/acsetup.service';
import { BreadCrumbService, UserAccessMenuService, NotificationService } from 'projects/axiom/src/app/_services/index';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { AdminService } from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-create-new-teacher',
	templateUrl: './create-new-teacher.component.html',
	styleUrls: ['./create-new-teacher.component.css']
})

export class CreateNewTeacherComponent implements OnInit {



	constructor(
		private adminService: AdminService,
		private acsetupService: AcsetupService,
		private userAccessMenuService: UserAccessMenuService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private router: Router,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService
	) {
	}

	Teacher_Form: FormGroup;
	Cs_relation_Form: FormGroup;
	Personal_Form: FormGroup;
	Qualification_Form: FormGroup;
	Documents_Form: FormGroup;
	Remark_Form: FormGroup;
	hosturl = appConfig.apiUrl;
	subjectArray: any[];
	classArray: any[];
	sectionArray: any[];
	schoolinfoArray: any = {};
	url: any;
	cs_relationArray: any[] = [];
	userDetails: any = {};
	homeUrl: string;
	current_Pro_id: string;
	department: any;
	projectsArray: any[] = [];
	moduleArray: any[] = [];
	assignedModuleArray: any[] = [];
	moduleItems: TreeviewItem[] = [];
	moduleValues: string[];
	login_id;
	arrayCountry: any[] = [];
	arrayState: any[] = [];
	arrayCity: any[] = [];
	currentClass: string;
	currentSection: string;
	currentSubject: string;
	mintoday: string;
	updateFlag = false;
	private file1: File;
	insertdata = false;
	designation: any;
	events: string[] = [];

	config = TreeviewConfig.create({
		hasAllCheckBox: true,
		hasFilter: true,
		hasCollapseExpand: true,
		decoupleChildFromParent: false,
		maxHeight: 400
	});


	au_email = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	au_mobile = new FormControl('', [Validators.required,
	]);
	au_full_name = new FormControl('', [Validators.required]);
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}

	ngOnInit() {
		this.login_id = this.route.snapshot.queryParams['login_id'];
		if (this.route.snapshot.queryParams['login_id']) {
			const param: any = {};
			param.role_id = '3';
			param.login_id = this.login_id;
			this.insertdata = true;
			this.qelementService.getUser(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						if (result.data.length > 0) {
							this.userDetails = result.data[0];
							const csrelationdetail = this.userDetails.cs_relations[0];
							this.Teacher_Form.patchValue({
								au_login_id: this.userDetails.au_login_id,
								au_full_name: this.userDetails.au_full_name, au_mobile: this.userDetails.au_mobile,
								au_email: this.userDetails.au_email, au_profileimage: this.userDetails.au_profileimage,
							}),
							// tslint:disable-next-line:max-line-length
							this.Cs_relation_Form.patchValue({uc_class_id: csrelationdetail.uc_class_id, uc_sec_id: csrelationdetail.uc_sec_id, uc_sub_id: csrelationdetail.uc_sub_id, uc_department: csrelationdetail.uc_department, uc_designation: csrelationdetail.uc_designation

							});
							document.getElementById('teacherImage').setAttribute('src', this.hosturl + this.userDetails.au_profileimage);
							this.cs_relationArray = this.userDetails.cs_relations;
							for (const item of this.cs_relationArray) {
								this.designation = item.uc_designation;
								this.department = item.uc_department;
							}
							this.updateFlag = true;
						}
					}
				});
			this.getAssignedModuleList();
		}
		this.getProjectList();
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getSchool();
		this.getClass();
		this.getState();
		this.getCity();
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.Personal_Form.value.upd_dob, 'yyyy-MM-dd');
		this.Personal_Form.patchValue({
			'upd_dob': convertedDate
		});
	}
	setCurrentClass(value) {
		const classObj = this.classArray.find(item => item.class_id === value);
		if (classObj) {
			this.currentClass = classObj.class_name;
		}
	}

	setCurrentSection(value) {
		const secObj = this.sectionArray.find(item => item.sec_id === value);
		if (secObj) {
			this.currentSection = secObj.sec_name;
		}
	}
	setCurrentSubject(value) {
		const subObj = this.subjectArray.find(item => item.sub_id === value);
		if (subObj) {
			this.currentSubject = subObj.sub_name;
		}
	}

	deleteCSRelation(deletei) {
		this.cs_relationArray.splice(deletei, 1);
	}



	getAssignedModuleList() {
		this.assignedModuleArray = [];
		this.userAccessMenuService.getUserAccessMenu({ login_id: this.login_id , role_id: '3'}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.assignedModuleArray = result.data;
				}
			}
		);
	}
	isExistAssignedModuleList(mod_id) {
		if (this.assignedModuleArray.find((item) => item.menu_mod_id === mod_id)) {
			return true;
		}
		return false;
	}

	buildForm() {
		this.Teacher_Form = this.fbuild.group({
			au_profileimage: new FormControl({}),
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
			upd_spouse_pincode: '',
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
			ue_role: '',
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
			pro_id: '',
			uc_appraisal: '',
			uc_interviewe: '',
			uc_other: '',
		});
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	addCSToTeacher() {
		this.insertdata = true;
		if (!this.Teacher_Form.value.au_full_name) {
			this.notif.showSuccessErrorMessage('Name is required', 'error');
		}

		if (!this.Teacher_Form.value.au_mobile) {
			this.notif.showSuccessErrorMessage('Contact number is required', 'error');
		}
		if (!this.Teacher_Form.value.au_email) {
			this.notif.showSuccessErrorMessage('Email is required', 'error');
		}

		if (!this.Cs_relation_Form.value.uc_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}

		if (!this.Cs_relation_Form.value.uc_sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}

		if (!this.Cs_relation_Form.value.uc_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}

		if (this.Cs_relation_Form.valid) {
			let relations: any = {};
			relations = this.Cs_relation_Form.value;
			relations.class_name = this.currentClass;
			relations.sec_name = this.currentSection;
			relations.sub_name = this.currentSubject;
			let pushFlag = 0;
			for (const item of this.cs_relationArray) {
				if (item.uc_class_id === relations.uc_class_id && item.uc_sec_id === relations.uc_sec_id && item.uc_sub_id === relations.uc_sub_id) {
					pushFlag = 1;
					break;
				}
			}
			if (pushFlag === 0) {
				this.cs_relationArray.push(relations);
			}
		}
	}

	getProjectList() {
		this.adminService.getProjectList({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.projectsArray = result.data;
				}
			});
	}

	getModuleList(pro_id) {
		this.current_Pro_id = pro_id;
		this.moduleItems = [];
		this.adminService.getModuleList({ role_id: 3, pro_id: pro_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.moduleArray = result.data;
					for (const moditem of this.moduleArray) {
						const mitem: any = {};
						mitem.text = moditem.mod_name;
						mitem.value = moditem.mod_id;
						mitem.checked = this.isExistAssignedModuleList(moditem.mod_id);
						mitem.children = [];
						for (const submenu1 of moditem.submenu_level_1) {
							const submenu1item: any = {};
							submenu1item.text = submenu1.mod_name;
							submenu1item.value = moditem.mod_id + '-' + submenu1.mod_id;
							submenu1item.checked = this.isExistAssignedModuleList(submenu1.mod_id);
							submenu1item.children = [];
							for (const submenu2 of submenu1.submenu_level_2) {
								const submenu2item: any = {};
								submenu2item.text = submenu2.mod_name;
								submenu2item.value = moditem.mod_id + '-' + submenu1.mod_id + '-' + submenu2.mod_id;
								submenu2item.checked = this.isExistAssignedModuleList(submenu2.mod_id);
								submenu1item.children.push(submenu2item);
							}
							mitem.children.push(submenu1item);
						}
						this.moduleItems.push(new TreeviewItem(mitem));
					}
				}
			});
	}

	submitModule() {
		if (this.current_Pro_id) {
			const menuRelation: any = { login_id: this.login_id, pro_id: this.current_Pro_id, menuRelation: this.moduleValues };
			this.adminService.addUserAccessMenu(menuRelation).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Modules Assigned Successfully', 'success');
					}
				});
		}
	}

	getSchool() {
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.schoolinfoArray = result.data[0];
				}
			},
		);
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			},
		);
	}

	readUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();
			reader.onload = (eventObj: any) => {
				this.url = eventObj.target.result;
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	}

	uploadTeacherImage(event) {
		if (event.target.files.length > 0) {
			this.file1 = event.target.files[0];
		}
	}

	getSubjectsByClass(): void {
		this.qelementService.getSubjectsByClass(this.Cs_relation_Form.value.uc_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			}
		);
	}

	getSectionsByClass(): void {
		this.qelementService.getSectionsByClass(this.Cs_relation_Form.value.uc_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			},
		);
	}

	addUser() {
		if (this.Teacher_Form.valid) {
			const newTeacherFormData = new FormData();
			newTeacherFormData.append('au_profileimage', this.file1);
			newTeacherFormData.append('au_full_name', this.Teacher_Form.value.au_full_name);
			newTeacherFormData.append('au_mobile', this.Teacher_Form.value.au_mobile);
			newTeacherFormData.append('au_email', this.Teacher_Form.value.au_email);
			newTeacherFormData.append('au_role_id', '3');
			newTeacherFormData.append('cs_relations', JSON.stringify(this.cs_relationArray));
			this.qelementService.addUser(newTeacherFormData).subscribe(
				(result: any) => {
					if (result) {
						this.login_id = result.data.login_id;
						if (result.data.url) {
							const xhr = new XMLHttpRequest();
							xhr.open('GET', result.data.url, true);
							xhr.send();
						}
						this.notif.showSuccessErrorMessage('Teacher added successfully', 'success');
					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Please enter all the required fields', 'error');
		}
	}

	updateUser() {
		if (this.Teacher_Form.valid) {
			const newTeacherFormData = new FormData();
			if (this.file1) {
				newTeacherFormData.append('au_profileimage', this.file1);
			}
			newTeacherFormData.append('au_login_id', this.Teacher_Form.value.au_login_id);
			newTeacherFormData.append('au_full_name', this.Teacher_Form.value.au_full_name);
			newTeacherFormData.append('au_mobile', this.Teacher_Form.value.au_mobile);
			newTeacherFormData.append('au_email', this.Teacher_Form.value.au_email);
			newTeacherFormData.append('au_role_id', '3');
			newTeacherFormData.append('au_admission_no', this.userDetails.au_admission_no);
			newTeacherFormData.append('cs_relations', JSON.stringify(this.cs_relationArray));
			this.qelementService.updateUser(newTeacherFormData).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Updated successfully', 'success');
					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Please enter all the required fields', 'error');
		}
	}

	getCountry() {
		this.acsetupService.getCountry().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayCountry = result.data;
				}
			}
		);
	}
	getState() {
		this.acsetupService.getState().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayState = result.data;
				}
			}
		);
	}
	getCity() {
		this.acsetupService.getCity().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayCity = result.data;
				}

			}
		);
	}

	saveief() {
		this.Teacher_Form.patchValue({au_full_name: '', au_email: '', au_mobile: ''}),
		// tslint:disable-next-line:max-line-length
		this.Cs_relation_Form.patchValue({uc_class_id: '', uc_sec_id: '', uc_sub_id: '', au_profileimage: '', uc_designation: '', uc_department: ''});
	}
}
