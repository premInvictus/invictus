import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {AdminService} from '../services/admin.service';
import { QelementService } from '../../../questionbank/service/qelement.service';
import {ActivatedRoute} from '@angular/router';
import {BreadCrumbService, TreeviewService, NotificationService, UserAccessMenuService} from '../../../_services/index';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';


@Component({
	selector: 'app-manage-access',
	templateUrl: './manage-access.component.html',
	styleUrls: ['./manage-access.component.css']
})
export class ManageAccessComponent implements OnInit {
	login_id: string;
	currentUser: any = {};
	dropdownEnabled = true;
	items: TreeviewItem[] = [];
	values: string[];
	moduleItems: TreeviewItem[] = [];
	moduleValues: string[];
	classItems: TreeviewItem[] = [];
	classValues: string[];
	userClassArray: any[] = [];
	subjectItems: TreeviewItem[] = [];
	subjectValues: string[];
	userSubjectArray: any[] = [];
	topicItems: TreeviewItem[] = [];
	topicValues: string[];
	schoolsArray: any[] = [];
	userschoolsArray: any[] = [];
	projectsArray: any[] = [];
	userprojectsArray: any[] = [];
	moduleArray: any[] = [];
	userDetails: any = {};
	ModuleForm: FormGroup;
	subjectForm: FormGroup;
	topicForm: FormGroup;
	moduleDivFlag = false;
	config = TreeviewConfig.create({
			hasAllCheckBox: true,
			hasFilter: true,
			hasCollapseExpand: true,
			decoupleChildFromParent: false,
			maxHeight: 400
	});


	constructor(
		private adminService: AdminService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private treeviewService: TreeviewService,
		private userAccessMenuService: UserAccessMenuService
	) {

	}

	ngOnInit() {
		this.login_id = this.route.snapshot.params['id'];
		// this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getUser();
		this.getClass();
		this.getSchoolDetails();
		this.getUserAccessSchool();
		this.getProjectList();
	}
	buildForm() {
		this.ModuleForm = this.fbuild.group({
			login_id: '',
			si_id: '',
			pro_id: ''
		});
		this.subjectForm = this.fbuild.group({
			class_id: ''
		});
		this.topicForm = this.fbuild.group({
			class_id: '',
			sub_id: ''
		});
	}
	onFilterChange(value: string) {
	}
	onFilterModule(value: string) {
	}
	onFilterClassValues(value: string) {
	}
	onFilterSubjectValues(value: string) {
	}
	onFilterTopicValues(value: string) {
	}
	getUser() {
	this.qelementService.getUser({role_id: '1', status: '1', login_id: this.login_id}).subscribe(
		(result: any) => {
			if (result && result.status === 'ok') {
					this.userDetails = result.data[0];
			}
		});

	}
	getClass() {
		this.qelementService.getClass().subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.adminService.getUserAccessClass({login_id: this.login_id}).subscribe((result1: any) => {
						if (result1 && result1.status === 'ok') {
							this.userClassArray = result1.data;
							this.classItems = this.treeviewService.getItemData('class', this.userClassArray, result.data);
						} else {
							this.classItems = this.treeviewService.getItemData('class', [], result.data);
						}
					});
				} else {
					this.classItems = [];
				}
			});
	}
	getUserAccessClass() {
		this.adminService.getUserAccessClass({login_id: this.login_id}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.userClassArray = result.data;
			} else {
				this.notif.showSuccessErrorMessage('No Record Found', 'error');
			}
		});
	}
	addUserAccessClass() {
		if (this.classValues.length > 0) {
			const classRelation: any = {login_id: this.login_id, class_id: this.classValues};
			this.adminService.addUserAccessClass(classRelation).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Faild to Submit', 'error');
					}
				});
		}
	}
	getSubjectsByClass() {
		if (this.subjectForm.value.class_id) {
			this.qelementService.getSubjectsByClass(this.subjectForm.value.class_id).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.adminService.getUserAccessSubject(
						{login_id: this.login_id, class_id: this.subjectForm.value.class_id
						}).subscribe((result1: any) => {
						if (result1 && result1.status === 'ok') {
							this.subjectItems = this.treeviewService.getItemData('subject', result1.data, result.data);
						} else {
							this.subjectItems = this.treeviewService.getItemData('subject', [], result.data);
						}
					});
				}
			});
		}
	}
	getUserAccessSubject() {
		this.adminService.getUserAccessSubject({login_id: this.login_id, class_id: this.topicForm.value.class_id}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.userSubjectArray = result.data;
			} else {
				this.userSubjectArray = [];
				this.notif.showSuccessErrorMessage('No record found', 'error');
			}
		});
	}
	addUserAccessSubject() {
		if (this.subjectValues.length > 0) {
			const subjectRelation: any = {login_id: this.login_id, class_id: this.subjectForm.value.class_id, sub_id: this.subjectValues};
			this.adminService.addUserAccessSubject(subjectRelation).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Faild to Submit', 'error');
					}
				});
		}
	}
	getTopciByClassSubject() {
		this.qelementService.getTopicByClassSubject(this.topicForm.value.class_id, this.topicForm.value.sub_id).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.adminService.getUserAccessTopic({
						login_id: this.login_id, class_id: this.topicForm.value.class_id, sub_id: this.topicForm.value.sub_id
					}).subscribe((result1: any) => {
						if (result1 && result1.status === 'ok') {
							this.topicItems = this.treeviewService.getItemData('topic', result1.data, result.data);
						} else {
							this.topicItems = this.treeviewService.getItemData('topic', [], result.data);
						}
					});
				} else {
					this.topicItems = [];
				}
			});
	}
	addUserAccessTopic() {
		if (this.topicValues.length > 0) {
			const topicRelation: any = {
				login_id: this.login_id, class_id: this.topicForm.value.class_id,
				sub_id: this.topicForm.value.sub_id, topic_id: this.topicValues};
			this.adminService.addUserAccessTopic(topicRelation).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Faild to Submit', 'error');
					}
				});
		}
	}
	getSchoolDetails() {
		this.adminService.getSchoolDetails().subscribe(
		(result: any) => {
				if (result && result.status === 'ok') {
						this.schoolsArray = result.data;
						this.getProjectList();

				}
			});
	}
	getUserAccessSchool() {
		this.adminService.getUserAccessSchool({login_id: this.login_id}).subscribe(
		(result: any) => {
				if (result && result.status === 'ok') {
						this.userschoolsArray = result.data;
				}
			});
	}
	getUserAccessProject(school_id) {
		this.adminService.getUserAccessProject({login_id: this.login_id, school_id: school_id}).subscribe(
		(result: any) => {
				if (result.status === 'ok') {
						this.userprojectsArray = result.data;

				}
			});
	}
	// get project list only
	getProjectList() {
		this.adminService.getProjectList({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
						this.projectsArray = result.data;        }
			});
	}
	getModuleList() {
		this.moduleItems = [];
		this.moduleDivFlag = true;
		this.adminService.getModuleList({role_id: 1, pro_id: this.ModuleForm.value.pro_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.moduleArray = result.data;
					this.userAccessMenuService.getUserAccessMenu({login_id: this.login_id, role_id: '1'}).subscribe((result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.moduleItems = this.treeviewService.getItemData('menu', result1.data, this.moduleArray);
							} else {
								this.moduleItems = this.treeviewService.getItemData('menu', [], this.moduleArray);
							}
						}
					);
				}
			});
	}
	submitSP() {
		const SPRelation: any = {login_id: this.login_id, SPRelation: this.values};
		this.adminService.addUserAccessControl(SPRelation).subscribe(
		(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
					this.getUserAccessSchool();
				} else {
					this.notif.showSuccessErrorMessage('Faild to Submit', 'error');
				}
			});
	}
	submitModule() {
		if (this.moduleValues.length > 0) {
		const menuRelation: any = {login_id: this.login_id, pro_id: this.ModuleForm.value.pro_id, menuRelation: this.moduleValues};
		this.adminService.addUserAccessMenu(menuRelation).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
				}
			});
		} else {
			this.notif.showSuccessErrorMessage('Please select Project', 'error');
		}
	}
}
