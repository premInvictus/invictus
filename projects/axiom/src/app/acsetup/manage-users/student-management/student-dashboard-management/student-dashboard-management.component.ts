import { Component, OnInit } from '@angular/core';
import { UserAccessMenuService, NotificationService, TreeviewService } from '../../../../_services/index';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../user-type/admin/services/admin.service';

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
	typeArray = [
		{ id: 'web', name: 'Desktop' },
		{ id: 'app', name: 'Mobile' }
	];
	isApp = false;
	submitButton = true;
	typeVal = 'web';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private adminService: AdminService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private treeviewService: TreeviewService,
	) { }

	ngOnInit() {
		//this.getProjectList();
		this.getAssignedModuleList();
	}
	changeIsWebApp($event) {
		if ($event.value === 'app') {
			this.isApp = true;
			this.typeVal = 'app';
			this.getAssignedModuleList2();
		} else {
			this.typeVal = 'web';
			this.isApp = false;
			this.moduleValues = [];
			this.getAssignedModuleList();
		}
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
		this.userAccessMenuService.getUserAccessMenu({ role_id: '4', mor_type: 'web' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.assignedModuleArray = result.data;
					this.getModuleList();
				} else {
					this.getModuleList();
				}
			}
		);
	}
	getAssignedModuleList2() {
		this.assignedModuleArray = [];
		this.moduleArray = [];
		this.moduleItems = [];
		this.userAccessMenuService.getUserAccessMenu({ role_id: '4', mor_type: 'app' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.assignedModuleArray = result.data;
					this.moduleItems = [];
					this.adminService.getModuleList({ role_id: 4, mor_type: 'app' }).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								this.moduleArray = result.data;
								this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
							}
						});
				} else {
					this.moduleItems = [];
					this.adminService.getModuleList({ role_id: '4', mor_type: 'app' }).subscribe(
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
	getProjectList() {
		this.adminService.getProjectList({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.projectsArray = result.data;
				}
			});
	}
	onFilterChange(value: string) {
	}
	getModuleList() {
		//this.current_Pro_id = pro_id;
		this.moduleItems = [];
		//, pro_id: pro_id
		this.adminService.getModuleList({ role_id: 4, mor_type: 'web' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.moduleArray = result.data;
					this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
				}
			});
	}
	submitModule() {
		//this.current_Pro_id = 1;
		// if (this.current_Pro_id) {
		const menuRelation: any = { pro_id: 1, menuRelation: this.moduleValues, type: this.isApp ? 'app' : 'web' };
		this.adminService.addUserAccessMenu(menuRelation).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
					this.router.navigate(['../student-management'], { relativeTo: this.route });
				} else {
					this.notif.showSuccessErrorMessage('Faild to Submit', 'error');
				}
			});
		// }
	}

}
