import { Component, OnInit } from '@angular/core';
import {UserAccessMenuService, NotificationService} from 'projects/axiom/src/app/_services/index';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from 'projects/axiom/src/app/user-type/admin/services/admin.service';

@Component({
	selector: 'app-student-dashboard-management',
	templateUrl: './student-dashboard-management.component.html',
	styleUrls: ['./student-dashboard-management.component.css']
})
export class StudentDashboardManagementComponent implements OnInit {
	current_Pro_id: string;
	projectsArray: any[] = [];
	moduleArray: any[] = [];
	assignedModuleArray: any[] = [];
	moduleItems: TreeviewItem[] = [];
	moduleValues: string[];
	config = TreeviewConfig.create({
		hasAllCheckBox: true,
		hasFilter: true,
		hasCollapseExpand: true,
		decoupleChildFromParent: false,
		maxHeight: 400
});

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private adminService: AdminService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
	) { }

	ngOnInit() {
		this.getProjectList();
		this.getAssignedModuleList();
	}
	isExistAssignedModuleList(mod_id) {
		this.assignedModuleArray.filter(mitem => {
			if (mitem.menu_mod_id === mod_id) {
				return true;
		}
		});
		return false;
}
	getAssignedModuleList() {
		this.assignedModuleArray = [];
		this.userAccessMenuService.getUserAccessMenu({role_id: '4'}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.assignedModuleArray = result.data;
				}
			}
		);
	}
	getProjectList() {
		this.adminService.getProjectList({}).subscribe(
			(result: any ) => {
				if (result && result.status === 'ok') {
						this.projectsArray = result.data;        }
			});
	}
	onFilterChange(value: string) {
		}
	getModuleList(pro_id) {
		this.current_Pro_id = pro_id;
		this.moduleItems = [];
		this.adminService.getModuleList({role_id: 4, pro_id: pro_id}).subscribe(
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
		const menuRelation: any = {pro_id: this.current_Pro_id, menuRelation: this.moduleValues};
		this.adminService.addUserAccessMenu(menuRelation).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
					this.router.navigate(['../student-management'], {relativeTo : this.route});
				} else {
					this.notif.showSuccessErrorMessage('Faild to Submit', 'error');
					}
			});
		}
	}

}
