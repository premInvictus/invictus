import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { CommonAPIService } from '../../../../_services/index';
import { ManageUsersService } from '../../../service/manage-users.service';
@Component({
	selector: 'app-manage-access-user',
	templateUrl: './manage-access-user.component.html',
	styleUrls: ['./manage-access-user.component.scss']
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
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private manageUsersService: ManageUsersService
	) { }
	ngOnInit() {
		this.login_id = this.route.snapshot.params['id'];
		this.getAssignedModuleList();
		this.getUser();
		this.getClass();
		this.buildForm();
		this.getProjectList();
		this.homeUrl = this.commonAPIService.getUrl();

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
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}
	getClass() {
		this.classItems = [];
		this.manageUsersService.getClass().subscribe(
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
		this.manageUsersService.getUser({ role_id: '2', status: '1', login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetails = result.data[0];
					this.manageAccessDiv = true;
				}
			});
	}
	getProjectList() {
		this.manageUsersService.getProjectList({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.projectsArray = result.data;
				}
			});
	}
	getAssignedModuleList() {
		this.assignedModuleArray = [];
		this.commonAPIService.getUserAccessMenu({ login_id: this.login_id, role_id: '2' }).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
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
		this.manageUsersService.getModuleList({ role_id: 2, pro_id: pro_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.moduleArray = result.data;
					this.moduleItems = this.commonAPIService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
				}
			});
	}
	submitModule() {
		if (this.moduleValues.length > 0) {
			const menuRelation: any = { login_id: this.login_id, pro_id: this.ModuleForm.value.pro_id, menuRelation: this.moduleValues };
			this.manageUsersService.addUserAccessMenu(menuRelation).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage('Submitted Successfully', 'success');
					}
				});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select Project', 'error');
		}
	}
	addUserAccessClass() {
		if (this.classValues.length > 0) {
			const classRelation: any = { login_id: this.login_id, class_id: this.classValues };
			this.manageUsersService.addUserAccessClass(classRelation).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage('Submitted Successfully', 'success');
					}
				});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select class', 'error');
		}
	}

}
