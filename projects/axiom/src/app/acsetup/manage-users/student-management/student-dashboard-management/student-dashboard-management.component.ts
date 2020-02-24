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
	finalAssignedModules: any[] = [];
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
	checkIfValueExist(mod_id) {
		const findex = this.finalAssignedModules.indexOf(mod_id);
		if (findex !== -1) {
			return true;
		} else {
			return false;
		}
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
	getAssignedModuleList2() {
		this.assignedModuleArray = [];
		this.moduleArray = [];
		this.finalAssignedModules = [];
		this.moduleItems = [];
		this.userAccessMenuService.getUserAccessMenu({ role_id: '4', mor_type: 'app' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.assignedModuleArray = result.data;
					for (const item of this.assignedModuleArray) {
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
					this.moduleItems = [];
					this.adminService.getModuleList({ role_id: 4, mor_type: 'app' }).subscribe(
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
					this.adminService.getModuleList({ role_id: '4', mor_type: 'app' }).subscribe(
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
	toggleTopMenu(index) {
		this.moduleArray[index].display = this.moduleArray[index].display === 'block' ? 'none' : 'block'
	}
	toggleSubMenu1(index1, index2) {
		this.moduleArray[index1].submenu_level_1[index2].display = this.moduleArray[index1].submenu_level_1[index2].display === 'block' ? 'none' : 'block'
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
		this.moduleArray = [];
		this.finalAssignedModules = [];
		//, pro_id: pro_id
		this.adminService.getModuleList({ role_id: 4, mor_type: 'web' }).subscribe(
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
					for (const item of this.assignedModuleArray) {
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
					this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
				}
			});
	}
	submitModule() {
		//this.current_Pro_id = 1;
		// if (this.current_Pro_id) {
		const menuRelation: any = { pro_id: 1, menuRelation: this.finalAssignedModules, type: this.isApp ? 'app' : 'web' };
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
