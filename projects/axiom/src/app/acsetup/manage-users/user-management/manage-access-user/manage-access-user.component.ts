import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
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
	submitButton = true;
	config = TreeviewConfig.create({
		hasAllCheckBox: true,
		hasFilter: true,
		hasCollapseExpand: true,
		decoupleChildFromParent: false,
		maxHeight: 300
});
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
		this.homeUrl = this.breadCrumbService.getUrl();

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
		this.qelementService.getUser({role_id: '2', status: '1', login_id: this.login_id}).subscribe(
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
						this.projectsArray = result.data;        }
			});
	}
	getAssignedModuleList() {
		this.assignedModuleArray = [];
		this.userAccessMenuService.getUserAccessMenu({login_id: this.login_id, role_id: '2'}).subscribe(
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
	getModuleList(pro_id) {
		this.moduleItems = [];
		this.moduleDivFlag = true;
		this.adminService.getModuleList({role_id: 2, pro_id: pro_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
						this.moduleArray = result.data;
						this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
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
	addUserAccessClass() {
		if (this.classValues.length > 0) {
		const classRelation: any = {login_id: this.login_id, class_id: this.classValues};
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

}
