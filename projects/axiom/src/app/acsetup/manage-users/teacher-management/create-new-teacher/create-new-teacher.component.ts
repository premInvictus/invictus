import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms';
import { QelementService } from '../../../../questionbank/service/qelement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcsetupService } from '../../../../acsetup/service/acsetup.service';
import { BreadCrumbService, UserAccessMenuService, NotificationService, SmartService, TreeviewService } from '../../../../_services/index';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { AdminService } from '../../../../user-type/admin/services/admin.service';
import { appConfig } from '../../../../app.config';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-create-new-teacher',
	templateUrl: './create-new-teacher.component.html',
	styleUrls: ['./create-new-teacher.component.css']
})

export class CreateNewTeacherComponent implements OnInit {
	@ViewChild('cropModal') cropModal;
	constructor(
		private adminService: AdminService,
		private acsetupService: AcsetupService,
		private userAccessMenuService: UserAccessMenuService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private smartService: SmartService,
		private route: ActivatedRoute,
		private router: Router,
		private notif: NotificationService,
		private treeviewService: TreeviewService,
		private breadCrumbService: BreadCrumbService
	) {
	}
	isApp = false;
	finalAssignedModules: any[] = [];
	typeVal = 'web';
	typeArray = [
		{ id: 'web', name: 'Desktop' },
		{ id: 'app', name: 'Mobile' }
	];
	deletedItemArray: any[] = [];
	finalSubjectArray: any[] = [];
	ctFlag = false;
	Teacher_Form: FormGroup;
	Cs_relation_Form: FormGroup;
	Personal_Form: FormGroup;
	Qualification_Form: FormGroup;
	Documents_Form: FormGroup;
	Remark_Form: FormGroup;
	hosturl = appConfig.apiUrl;
	subjectArray: any[] = [];
	classArray: any[];
	sectionArray: any[];
	schoolinfoArray: any = {};
	url: any = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
	checkAvailable = false;
	prefixStatusicon: string;
	prefixStatus: any;
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
	currentSubject: any[] = [];
	mintoday: string;
	updateFlag = false;
	private file1: File;
	insertdata = false;
	designation: any;
	events: string[] = [];
	ctValue: any;
	checkedFlag = false;
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
		this.buildForm();
		this.login_id = this.route.snapshot.queryParams['login_id'];
		if (this.route.snapshot.queryParams['login_id']) {
			this.onload();
			this.getAssignedModuleList();
		}
		this.getProjectList();
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getSchool();
		this.getClass();
		this.getState();
		this.getCity();
	}
	checkIfValueExist(mod_id) {
		const findex = this.finalAssignedModules.indexOf(mod_id);
		if (findex !== -1) {
			return true;
		} else {
			return false;
		}
	}
	setMenuAssignedLevel3($event, item) {
		const findex = this.finalAssignedModules.indexOf(item.mod_id);
		if (findex === -1) {
			this.finalAssignedModules.push(item.mod_id);
		} else {
			this.finalAssignedModules.splice(findex, 1);
		}
	}
	setMenuAssignedLevel2($event, item) {
		const findex = this.finalAssignedModules.indexOf(item.mod_id);
		if (findex === -1) {
			this.finalAssignedModules.push(item.mod_id);
			if (item.submenu_level_2 && item.submenu_level_2.length > 0) {
				for (const submenu of item.submenu_level_2) {
					let mod_id2 = submenu.mod_id;
					const findex2 = this.finalAssignedModules.indexOf(mod_id2);
					if (findex2 === -1) {
						this.finalAssignedModules.push(mod_id2);
					}
				}
			}

		} else {
			this.finalAssignedModules.splice(findex, 1);
			if (item.submenu_level_2 && item.submenu_level_2.length > 0) {
				for (const submenu of item.submenu_level_2) {
					let mod_id = submenu.mod_id;
					const findex3 = this.finalAssignedModules.indexOf(mod_id);
					if (findex3 !== -1) {
						this.finalAssignedModules.splice(findex3, 1);
					}
				}
			}
		}
	}
	toggleTopMenu(index) {
		this.moduleArray[index].display = this.moduleArray[index].display === 'block' ? 'none' : 'block'
	}
	toggleSubMenu1(index1, index2) {
		this.moduleArray[index1].submenu_level_1[index2].display = this.moduleArray[index1].submenu_level_1[index2].display === 'block' ? 'none' : 'block'
	}
	setLevel2($event, item) {
		if (item.submenu_level_2 && item.submenu_level_2.length > 0) {
			for (const submenu of item.submenu_level_2) {
				let mod_id2 = submenu.mod_id;
				const findex2 = this.finalAssignedModules.indexOf(mod_id2);
				if (findex2 === -1) {
					this.finalAssignedModules.push(mod_id2);
				} else {
					this.finalAssignedModules.splice(findex2, 1);
				}
			}
		}
	}
	setMenuAssigned($event, item) {
		// const mod_id = $event.value;
		const findex = this.finalAssignedModules.indexOf(item.mod_id);
		if (findex === -1) {
			this.finalAssignedModules.push(item.mod_id);
			if (item.submenu_level_1 && item.submenu_level_1.length > 0) {
				for (const submenu of item.submenu_level_1) {
					let mod_id2 = submenu.mod_id;
					const findex2 = this.finalAssignedModules.indexOf(mod_id2);
					if (findex2 === -1) {
						this.finalAssignedModules.push(mod_id2);
					}
					this.setLevel2($event, submenu);
				}
			}

		} else {
			this.finalAssignedModules.splice(findex, 1);
			if (item.submenu_level_1 && item.submenu_level_1.length > 0) {
				for (const submenu of item.submenu_level_1) {
					let mod_id = submenu.mod_id;
					const findex3 = this.finalAssignedModules.indexOf(mod_id);
					if (findex3 !== -1) {
						this.finalAssignedModules.splice(findex3, 1);
					}
					this.setLevel2($event, submenu);
				}
			}
		}
	}
	getAssignedModuleList2(pro_id) {
		this.assignedModuleArray = [];
		this.finalAssignedModules = [];
		this.moduleArray = [];
		this.moduleItems = [];
		this.userAccessMenuService.getUserAccessMenu({ login_id: this.login_id, role_id: '3', mor_type: 'app' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.assignedModuleArray = result.data;
					for (const item of this.assignedModuleArray) {
						if (item.mod_pro_id === '1') {
							const index = this.finalAssignedModules.indexOf(item.mod_id);
							if (index === -1) {
								this.finalAssignedModules.push(item.mod_id);
							}
							if (item.submenu_level_1 && item.submenu_level_2.length > 0) {
								for (const submenu of item.submenu_level_1) {
									const index2 = this.finalAssignedModules.indexOf(submenu.mod_id);
									if (index2 === -1) {
										this.finalAssignedModules.push(submenu.mod_id);
									}
									if (submenu.submenu_level_2 && submenu.submenu_level_2.length > 0) {
										for (const submenu2 of submenu.submenu_level_2) {
											const index3 = this.finalAssignedModules.indexOf(submenu2.mod_id);
											if (index3 === -1) {
												this.finalAssignedModules.push(submenu2.mod_id);
											}
										}
									}
								}
							}
						}
					}
					this.moduleItems = [];
					this.adminService.getModuleList({ role_id: 3, pro_id: pro_id, mor_type: 'app' }).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								for (const item of result.data) {
									item['display'] = 'block';
									if (item.submenu_level_1 && item.submenu_level_1.length > 0) {
										for (const submenu of item.submenu_level_1) {
											submenu['display'] = 'block';
											if (submenu.submenu_level_2 && submenu.submenu_level_2.length > 0) {
												for (const submenu2 of submenu.submenu_level_2) {
													submenu2['display'] = 'block';
												}

											}
										}
									}
									this.moduleArray.push(item);
								}
								this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
							}
						});
				} else {
					this.moduleItems = [];
					this.adminService.getModuleList({ role_id: 3, pro_id: pro_id, mor_type: 'app' }).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								for (const item of result.data) {
									item['display'] = 'block';
									if (item.submenu_level_1 && item.submenu_level_1.length > 0) {
										for (const submenu of item.submenu_level_1) {
											submenu['display'] = 'block';
											if (submenu.submenu_level_2 && submenu.submenu_level_2.length > 0) {
												for (const submenu2 of submenu.submenu_level_2) {
													submenu2['display'] = 'block';
												}

											}
										}
									}
									this.moduleArray.push(item);
								}
								this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
							}
						});
				}
			}
		);
	}
	changeIsWebApp($event) {
		if ($event.value === 'app') {
			this.isApp = true;
			this.typeVal = 'app';
			this.Remark_Form.patchValue({
				pro_id: ''
			});
			this.getAssignedModuleList2('1');
		} else {
			this.typeVal = 'web';
			this.isApp = false;
			this.moduleValues = [];
			this.getAssignedModuleList();
		}
	}
	onload() {
		const param: any = {};
		param.role_id = '3';
		param.login_id = this.login_id;
		this.insertdata = true;
		this.qelementService.getGlobalTeacher(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						this.updateFlag = true;
						this.userDetails = result.data[0];
						const csrelationdetail = this.userDetails.cs_relations[0];
						if (this.userDetails.cs_relations.length > 0) {
							this.ctFlag = true;
						}
						this.Teacher_Form.patchValue({
							au_login_id: this.userDetails.au_login_id,
							au_full_name: this.userDetails.au_full_name,
							au_username: this.userDetails.au_username,
							au_mobile: this.userDetails.au_mobile,
							au_email: this.userDetails.au_email,
							au_profileimage: this.userDetails.au_profileimage,
							usr_signature: this.userDetails.usr_signature
						}),
							// tslint:disable-next-line:max-line-length
							this.Cs_relation_Form.patchValue({
								//uc_class_id: csrelationdetail.uc_class_id,
								//uc_sec_id: csrelationdetail.uc_sec_id,
								//uc_sub_id: csrelationdetail.uc_sub_id,
								uc_department: csrelationdetail.uc_department,
								uc_designation: csrelationdetail.uc_designation

							});
						this.url = this.userDetails.au_profileimage ? this.userDetails.au_profileimage :
							'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
						this.cs_relationArray = this.userDetails.cs_relations;
						for (const item of this.cs_relationArray) {
							this.designation = item.uc_designation;
							this.department = item.uc_department;
						}
					}
				}
			});
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
		this.currentSubject = [];
		for (var i = 0; i < value.length; i++) {
			const subObj = this.finalSubjectArray.find(item => item.sub_id === value[i]);
			if (subObj) {
				this.currentSubject.push(subObj.sub_name);
			}
		}
	}

	deleteCSRelation(deletei) {
		this.cs_relationArray.splice(deletei, 1);
	}
	deleteSelected() {
		let index = 0;
		for (let item of this.deletedItemArray) {
			this.cs_relationArray.splice(item.id, 1);
			if (index === (this.deletedItemArray.length - 1)) {
				this.deletedItemArray = [];
			}
			index++;
		}
	}
	getDeleteEvent(index) {
		if (index !== 'all') {
			const rindex = this.deletedItemArray.findIndex(f => f.id === index);
			if (rindex !== -1) {
				this.deletedItemArray.splice(rindex, 1);
			} else {
				this.deletedItemArray.push({
					'id': index
				});
			}
		} else {
			if (this.deletedItemArray.length > 0 && (this.deletedItemArray.length === this.cs_relationArray.length)) {
				this.checkedFlag = false;
				this.deletedItemArray = [];
			} else {
				this.deletedItemArray = [];
				let index = 0;
				this.checkedFlag = true;
				for (let item of this.cs_relationArray) {
					this.deletedItemArray.push({
						'id': index
					})
					index++;
				}
			}
		}
	}

	getAssignedModuleList() {
		this.assignedModuleArray = [];
		this.moduleArray = [];
		this.userAccessMenuService.getUserAccessMenu({ login_id: this.login_id, role_id: '3' }).subscribe(
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
			au_username: '',
			au_mobile: '',
			au_email: '',
			au_role_id: '3',
			au_login_id: '',
			usr_signature: '',
			au_password: '',
			changepassword: ''
		});
		this.Cs_relation_Form = this.fbuild.group({
			uc_class_id: '',
			uc_sec_id: '',
			uc_sub_id: '',
			uc_designation: '',
			uc_department: '',
			uc_class_teacher: '0'
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
	activePasswordInput(event) {
		if (!event.checked) {
			this.Teacher_Form.patchValue({
				'au_password': ''
			});
		}
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	addCSToTeacher() {
		this.insertdata = true;
		if (!this.Teacher_Form.value.au_full_name) {
			this.notif.showSuccessErrorMessage('Name is required', 'error');
		}
		if (!this.Teacher_Form.value.au_username) {
			this.notif.showSuccessErrorMessage('Username is required', 'error');
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


			let pushFlag = 0;
			for (const item of this.cs_relationArray) {
				if (item.uc_class_id === relations.uc_class_id && item.uc_sec_id === relations.uc_sec_id && item.uc_sub_id === relations.uc_sub_id) {
					pushFlag = 1;
					break;
				}
			}
			if (pushFlag === 0) {
				for (var i = 0; i < this.currentSubject.length; i++) {
					let relations: any = {};
					relations.uc_class_id = this.Cs_relation_Form.value.uc_class_id;
					relations.uc_class_teacher = this.Cs_relation_Form.value.uc_class_teacher;
					relations.uc_department = this.Cs_relation_Form.value.uc_department;
					relations.uc_designation = this.Cs_relation_Form.value.uc_designation;
					relations.uc_sec_id = this.Cs_relation_Form.value.uc_sec_id;
					relations.uc_sub_id = this.Cs_relation_Form.value.uc_sub_id[i];
					relations.class_name = this.currentClass;
					relations.sec_name = this.currentSection;
					relations.sub_name = this.currentSubject[i];
					relations.uc_class_teacher = '0';
					this.cs_relationArray.push(relations);
				}
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
		this.finalAssignedModules = [];
		this.adminService.getModuleList({ role_id: 3, pro_id: pro_id, mor_type: 'web' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.moduleArray = [];
					this.moduleItems = [];
					for (const item of result.data) {
						item['display'] = 'block';
						if (item.submenu_level_1 && item.submenu_level_1.length > 0) {
							for (const submenu of item.submenu_level_1) {
								submenu['display'] = 'block';
								if (submenu.submenu_level_2 && submenu.submenu_level_2.length > 0) {
									for (const submenu2 of submenu.submenu_level_2) {
										submenu2['display'] = 'block';
									}

								}
							}
						}
						this.moduleArray.push(item);
					}
					for (const item of this.assignedModuleArray) {
						if (item.mod_pro_id === this.current_Pro_id) {
							const index = this.finalAssignedModules.indexOf(item.mod_id);
							if (index === -1) {
								this.finalAssignedModules.push(item.mod_id);
							}
							if (item.submenu_level_1 && item.submenu_level_2.length > 0) {
								for (const submenu of item.submenu_level_1) {
									const index2 = this.finalAssignedModules.indexOf(submenu.mod_id);
									if (index2 === -1) {
										this.finalAssignedModules.push(submenu.mod_id);
									}
									if (submenu.submenu_level_2 && submenu.submenu_level_2.length > 0) {
										for (const submenu2 of submenu.submenu_level_2) {
											const index3 = this.finalAssignedModules.indexOf(submenu2.mod_id);
											if (index3 === -1) {
												this.finalAssignedModules.push(submenu2.mod_id);
											}
										}
									}
								}
							}
						}
					}
					this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
				}
			});
	}

	submitModule() {
		if (!this.isApp ? this.current_Pro_id : this.finalAssignedModules.length > 0) {
			const menuRelation: any = {
				login_id: this.login_id, pro_id: this.isApp ? '1' : this.Remark_Form.value.pro_id, menuRelation: this.finalAssignedModules,
				type: this.isApp ? 'app' : 'web'
			};
			this.adminService.addUserAccessMenu(menuRelation).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Modules Assigned Successfully', 'success');
						this.router.navigate(['../teacher-management'], { relativeTo: this.route });
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
	uploadTeacherSign($event) {
		const file: File = $event.target.files[0];
		const reader = new FileReader();
		reader.onloadend = (e) => {
			const fileJson = {
				fileName: file.name,
				imagebase64: reader.result
			};
			this.qelementService.uploadDocuments([fileJson]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.Teacher_Form.patchValue({
						usr_signature: result.data[0].file_url
					});
				}
			});
		};
		reader.readAsDataURL(file);
	}

	readUrl(event: any) {
		let files = event.target.files[0].name;
		var ext = files.substring(files.lastIndexOf('.') + 1);
		if (ext === 'svg') {
			this.notif.showSuccessErrorMessage('Only Jpeg and Png image allowed.', 'error');
		} else {
			this.openCropDialog(event);
		}
	}
	openCropDialog = (imageFile) => this.cropModal.openModal(imageFile);

	uploadTeacherImage(event) {
		if (event.target.files.length > 0) {
			this.file1 = event.target.files[0];
		}
	}
	acceptCrop(result) {
		this.uploadImage(result.filename, result.base64);
	}
	uploadImage(fileName, au_profileimage) {
		this.qelementService.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profileimage, module: 'profile' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.url = result.data[0].file_url;
					this.Teacher_Form.patchValue({
						au_profileimage: this.url
					});
				}
			});
	}
	acceptNo(event) {
		event.target.value = '';
	}

	// changed for smart module
	getClass() {
		this.classArray = [];
		this.smartService.getClass({ class_status: '1' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}


	// getSubjectsByClass(): void { 
	// 	this.subjectArray = [];
	// 	this.smartService.getSubjectsByClass({ class_id: this.Cs_relation_Form.value.uc_class_id }).subscribe(
	// 		(result: any) => {
	// 			if (result && result.status === 'ok') {
	// 				this.subjectArray = result.data;
	// 			}
	// 		}
	// 	);
	// }

	getSubjectsByClass() {
		this.subjectArray = [];
		this.smartService.getSubjectsByClass({ class_id: this.Cs_relation_Form.value.uc_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				const temp = result.data;
				this.finalSubjectArray = result.data;
				let scholastic_subject: any[] = [];
				let coscholastic_subject: any[] = [];
				if (temp.length > 0) {
					temp.forEach(element => {
						if (element.sub_type === '1' || element.sub_type === '3') {
							if (element.sub_parent_id && element.sub_parent_id === '0') {
								var childSub: any[] = [];
								for (const item of temp) {
									if (element.sub_id === item.sub_parent_id) {
										childSub.push(item);
									}
								}
								element.childSub = childSub;
								scholastic_subject.push(element);
							}
						} else if (element.sub_type === '2' || element.sub_type === '4') {
							if (element.sub_parent_id && element.sub_parent_id === '0') {
								var childSub: any[] = [];
								for (const item of temp) {
									if (element.sub_id === item.sub_parent_id) {
										childSub.push(item);
									}
								}
								element.childSub = childSub;
								coscholastic_subject.push(element);
							}
						}
					});
				}
				for (var i = 0; i < scholastic_subject.length; i++) {
					this.subjectArray.push(scholastic_subject[i]);
				}
				for (var i = 0; i < coscholastic_subject.length; i++) {
					this.subjectArray.push(coscholastic_subject[i]);
				}
			} else {
				this.notif.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}




	getSectionsByClass(): void {
		this.sectionArray = [];
		this.smartService.getSectionsByClass({ class_id: this.Cs_relation_Form.value.uc_class_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				}
			}
		);
	}
	// end

	addUser() {
		if (this.Teacher_Form.valid) {
			const newTeacherFormData = new FormData();
			newTeacherFormData.append('au_profileimage', this.url);
			newTeacherFormData.append('usr_signature', this.Teacher_Form.value.usr_signature);
			newTeacherFormData.append('au_full_name', this.Teacher_Form.value.au_full_name);
			newTeacherFormData.append('au_username', this.Teacher_Form.value.au_username);
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
			if (this.url) {
				newTeacherFormData.append('au_profileimage', this.url);
			}
			newTeacherFormData.append('usr_signature', this.Teacher_Form.value.usr_signature);
			newTeacherFormData.append('au_login_id', this.Teacher_Form.value.au_login_id);
			newTeacherFormData.append('au_full_name', this.Teacher_Form.value.au_full_name);
			newTeacherFormData.append('au_username', this.Teacher_Form.value.au_username);
			newTeacherFormData.append('au_mobile', this.Teacher_Form.value.au_mobile);
			newTeacherFormData.append('au_email', this.Teacher_Form.value.au_email);
			newTeacherFormData.append('au_password', this.Teacher_Form.value.au_password);
			newTeacherFormData.append('au_role_id', '3');
			newTeacherFormData.append('au_admission_no', this.userDetails.au_admission_no);
			newTeacherFormData.append('cs_relations', JSON.stringify(this.cs_relationArray));
			this.qelementService.updateUser(newTeacherFormData).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Updated successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
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
		this.Teacher_Form.patchValue({ au_full_name: '', au_email: '', au_mobile: '' }),
			// tslint:disable-next-line:max-line-length
			this.Cs_relation_Form.patchValue({ uc_class_id: '', uc_sec_id: '', uc_sub_id: '', au_profileimage: '', uc_designation: '', uc_department: '' });
		const rindex = this.cs_relationArray.findIndex(f => f.uc_class_teacher === '1');
		if (rindex !== -1) {
			this.cs_relationArray[rindex].uc_class_teacher = '0';
		}
	}
	checkUserExists(value) {
		if (value) {
			this.qelementService.checkUserStatus({ user_name: value }).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.checkAvailable = true;
					this.prefixStatusicon = 'fas fa-check text-success';
					this.prefixStatus = res.data;
				} else {
					this.checkAvailable = false;
					this.prefixStatusicon = 'fas fa-times text-danger';
					this.prefixStatus = res.data;
				}
			});
		}
	}
	hideIcon() {
		this.prefixStatus = '';
	}
	checkStatus(index) {
		//console.log('index', index);
		if (Number(index) === 1) {
			return true;
		} else {
			return false;
		}
	}
	getChangeEvent($event, item) {
		this.ctValue = $event.value;
		if (Number(this.ctValue) === 1) {
			this.ctValue = '0';
		} else {
			this.ctValue = '1';
		}
		const rindex = this.cs_relationArray.findIndex(f => f.uc_class_teacher === '1');
		if (rindex !== -1) {
			this.cs_relationArray[rindex].uc_class_teacher = '0';
		}
		const findex = this.cs_relationArray.findIndex(f => f.uc_class_id === item.uc_class_id && f.uc_sec_id === item.uc_sec_id && f.uc_sub_id === item.uc_sub_id);
		if (findex !== -1) {
			this.cs_relationArray[findex].uc_class_teacher = this.ctValue;
		}
	}


}
