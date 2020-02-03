import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from '../../../../user-type/admin/services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BreadCrumbService } from '../../../../_services/breadcrumb.service';
import { QelementService } from '../../../../questionbank/service/qelement.service';
import { UserAccessMenuService, NotificationService, TreeviewService } from '../../../../_services/index';
@Component({
	selector: 'app-manage-access-user',
	templateUrl: './manage-access-user.component.html',
	styleUrls: ['./manage-access-user.component.css']
})
export class ManageAccessUserComponent implements OnInit {
	login_id: string;

	moduleItems: TreeviewItem[] = [];
	textRights = 'Web View';
	moduleValues: string[] = [];
	classItems: TreeviewItem[] = [];
	classValues: string[];
	classArray: any[] = [];
	projectsArray: any[] = [];
	moduleArray: any[] = [];
	assignedModuleArray: any[] = [];
	userDetails: any = {};
	homeUrl: string;
	ModuleForm: FormGroup;
	ClassModuleForm: FormGroup;
	moduleDivFlag = false;
	manageAccessDiv = false;
	isApp = false;
	submitButton = true;
	typeVal = 'web';
	projectListArray: any[] = [];
	resultProjectListArray: any[] = [];
	config = TreeviewConfig.create({
		hasAllCheckBox: true,
		hasFilter: true,
		hasCollapseExpand: true,
		decoupleChildFromParent: false,
		maxHeight: 300
	});
	typeArray = [
		{ id: 'web', name: 'Desktop' },
		{ id: 'app', name: 'Mobile' }
	];
	constructor(
		private adminService: AdminService,
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private breadCrumbService: BreadCrumbService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private treeviewService: TreeviewService
	) { }
	ngOnInit() {
		this.login_id = this.route.snapshot.params['id'];
		this.getAssignedModuleList();
		this.getUser();
		this.getClass();
		this.buildForm();
		this.getProjectList();
		this.getUserProjectList();
		this.homeUrl = this.breadCrumbService.getUrl();

	}
	changeIsWebApp($event) {
		if ($event.value === 'app') {
			this.isApp = true;
			this.typeVal = 'app';
			this.ModuleForm.patchValue({
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
	buildForm() {
		this.ModuleForm = this.fbuild.group({
			login_id: '',
			si_id: '',
			pro_id: ''
		});
		this.ClassModuleForm = this.fbuild.group({
			login_id: '',

		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	getClass() {
		this.classItems = [];
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					for (const classitem of this.classArray) {
						const citem: any = {};
						citem.text = classitem.class_name;
						citem.value = classitem.class_id;
						citem.checked = false;
						this.classItems.push(new TreeviewItem(citem));
					}

				}
			});
	}
	getUser() {
		this.qelementService.getUser({ role_id: '2', status: '1', login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetails = result.data[0];
					this.manageAccessDiv = true;
				}
			});
	}
	getProjectList() {
		this.adminService.getProjectList({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.projectsArray = result.data;
				}
			});
	}
	getAssignedModuleList() {
		this.assignedModuleArray = [];
		this.moduleArray = [];
		this.moduleItems = [];
		this.userAccessMenuService.getUserAccessMenu({ login_id: this.login_id, role_id: '2', mor_type: 'web' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.assignedModuleArray = result.data;
					if (this.assignedModuleArray.length > 0) {
						this.submitButton = false;
					}
				}
			}
		);
	}
	getAssignedModuleList2(pro_id) {
		this.assignedModuleArray = [];
		this.moduleArray = [];
		this.moduleItems = [];
		this.userAccessMenuService.getUserAccessMenu({ login_id: this.login_id, role_id: '2', mor_type: 'app' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.assignedModuleArray = result.data;
					this.moduleItems = [];
					this.moduleDivFlag = true;
					this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'app' }).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								this.moduleArray = result.data;
								this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
							}
						});
					if (this.assignedModuleArray.length > 0) {
						this.submitButton = false;
					}
				} else {
					this.moduleItems = [];
					this.moduleDivFlag = true;
					this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'app' }).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								this.moduleArray = result.data;
								this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
							}
						});
				}
			}
		);
	}
	getModuleList($event) {
		const pro_id = $event.value;
		this.moduleItems = [];
		this.moduleDivFlag = true;
		if (pro_id) {
			this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'web' }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.moduleArray = result.data;
						this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
					}
				});
		}

	}
	getModuleList3(proj_id) {
		const pro_id = proj_id;
		this.moduleItems = [];
		this.moduleDivFlag = true;
		this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'web' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.moduleArray = result.data;
					this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
				}
			});
	}
	submitModule() {
		if (this.moduleValues.length > 0) {
			const menuRelation: any = {
				login_id: this.login_id, pro_id: this.isApp ? '1' : this.ModuleForm.value.pro_id, menuRelation: this.moduleValues,
				type: this.isApp ? 'app' : 'web'
			};
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
	addUserAccessClass() {
		if (this.classValues.length > 0) {
			const classRelation: any = { login_id: this.login_id, class_id: this.classValues };
			this.adminService.addUserAccessClass(classRelation).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
					}
				});
		} else {
			this.notif.showSuccessErrorMessage('Please select class', 'error');
		}
	}
	getUserProjectList() {
		this.adminService.getUserProject({ au_login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.resultProjectListArray = JSON.parse(result.data[0].au_project_mapped);
					this.projectListArray = JSON.parse(result.data[0].au_project_mapped);
				}
			});
	}
	assignProject(item) {
		const findex = this.projectListArray.findIndex(f => Number(f.pro_id) === Number(item.pro_id));
		if (findex !== -1) {
			this.projectListArray.splice(findex, 1)
		} else {
			this.projectListArray.push(item);
		}
	}
	submitProject() {
		const finayArray: any[] = [];
		if (this.projectListArray.length > 0) {
			for (let item of this.projectListArray) {
				finayArray.push({
					'pro_id': item.pro_id,
					'pro_name': item.pro_name,
					'pro_status': item.pro_status,
					'pro_url': item.pro_url
				});
			}
			this.adminService.updateUserProject({ au_login_id: this.login_id, au_project_mapped: JSON.stringify(finayArray) }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
						this.getUserProjectList();
					}
				});
		} else {
			this.notif.showSuccessErrorMessage('Please select project', 'error');
		}

	}
	getCheckStatus(pro_id) {
		const findex = this.resultProjectListArray.findIndex(f => Number(f.pro_id) === Number(pro_id));
		if (findex !== -1) {
			return true;
		} else {
			return false;
		}
	}

}
