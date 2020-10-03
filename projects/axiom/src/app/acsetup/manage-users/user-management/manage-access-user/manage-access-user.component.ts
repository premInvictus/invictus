import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from '../../../../user-type/admin/services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BreadCrumbService } from '../../../../_services/breadcrumb.service';
import { QelementService } from '../../../../questionbank/service/qelement.service';
import { UserAccessMenuService, NotificationService, TreeviewService, CommonAPIService } from '../../../../_services/index';
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
	finalAssignedModules: any[] = [];
	classValues: string[];
	classArray: any[] = [];
	projectsArray: any[] = [];
	moduleArray: any[] = [];
	assignedModuleArray: any[] = [];
	userDetails: any = {};
	homeUrl: string;
	ModuleForm: FormGroup;
	ClassModuleForm: FormGroup;
	schoolAssignForm:FormGroup;
	moduleDivFlag = false;
	manageAccessDiv = false;
	isApp = false;
	submitButton = true;
	typeVal = 'web';
	projectListArray: any[] = [];
	resultProjectListArray: any[] = [];
	userAssignClass: any[] = [];
	sessionArray:any[] = [];
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
	schoolGroupData:any[] = [];
	showNewSchoolUser = false;
	schoolUseArray:any[] = [];
	mappedSchoolUserArray:any[] = [];
	editNewUserFlag = false;
	currentMappedSchoolData:any= {};
	constructor(
		private adminService: AdminService,
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private breadCrumbService: BreadCrumbService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private treeviewService: TreeviewService,
		private commonAPIService: CommonAPIService
	) { }
	ngOnInit() {
		this.login_id = this.route.snapshot.params['id'];
		this.getAssignedModuleList();
		this.getUser();
		this.getClass();
		this.getSession();
		this.buildForm();
		this.getProjectList();
		this.getUserProjectList();
		this.getUserAssignClass();
		
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
		this.schoolAssignForm  = this.fbuild.group({
			schoolList:'',
			projectList:'',
			sessionList:'',
			interfaceList:'',
			mapUser:''
		})
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	getClass() {
		this.classItems = [];
		this.adminService.getClassData({ 'all_data': 'all_data' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					for (const classitem of this.classArray) {
						const citem: any = {};
						citem.text = classitem.class_name;
						citem.value = classitem.class_id;
						citem.checked = this.checkedAssignClass(classitem.class_id);
						this.classItems.push(new TreeviewItem(citem));
					}
				}
			});
	}
	checkedAssignClass(class_id) {
		const findex = this.userAssignClass.findIndex(f => Number(f.ucl_class_id) === Number(class_id));
		if (findex !== -1) {
			return true;
		} else {
			return false;
		}
	}

	getUserAssignClass() {
		this.adminService.getUserAssignClass({ au_login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userAssignClass = result.data;
				}
			});
	}
	getUser() {
		this.qelementService.getUser({ role_id: '2', status: '1', login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetails = result.data[0];
					this.manageAccessDiv = true;
					
					this.getGroupedSchool();
					
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
		this.finalAssignedModules = [];
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
		this.finalAssignedModules = [];
		this.moduleItems = [];
		this.userAccessMenuService.getUserAccessMenu({ login_id: this.login_id, role_id: '2', mor_type: 'app' }).subscribe(
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
					this.moduleDivFlag = true;
					this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'app' }).subscribe(
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
					if (this.assignedModuleArray.length > 0) {
						this.submitButton = false;
					}
				} else {
					this.moduleItems = [];
					this.moduleDivFlag = true;
					this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'app' }).subscribe(
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
	getModuleList($event) {
		const pro_id = $event.value;
		this.moduleItems = [];
		this.finalAssignedModules = [];
		this.moduleArray = [];
		this.moduleDivFlag = false;
		if (pro_id) {
			this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'web' }).subscribe(
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
							if (item.mod_pro_id === this.ModuleForm.value.pro_id) {
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
						this.moduleDivFlag = true;
						this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
						console.log('this.moduleItems', this.moduleItems, this.finalAssignedModules)
					}
				});
		}

	}

	getMappedModuleList($event) {
		const pro_id = this.schoolAssignForm.value.projectList;
		this.moduleItems = [];
		this.finalAssignedModules = [];
		this.moduleArray = [];
		this.moduleDivFlag = false;
		if (pro_id) {
			if (this.schoolAssignForm.value.interfaceList === 'app') {
				this.getMappedUserAccessMenu();
				this.getMappedAssignedModuleList2('1');
			} else {
				this.getMappedUserAccessMenu();
				this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: (this.schoolAssignForm.value.interfaceList ? this.schoolAssignForm.value.interfaceList : 'web' )  }).subscribe(
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
							console.log('this.schoolAssignForm.value.pro_id',this.schoolAssignForm.value.project);
							for (const item of this.assignedModuleArray) {
								console.log('item.mod_pro_id--',item.mod_pro_id)
								if (this.schoolAssignForm && this.schoolAssignForm.value &&  this.schoolAssignForm.value.projectList && this.schoolAssignForm.value.projectList.indexOf(item.mod_pro_id) > -1) {
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
							// this.moduleDivFlag = true;
							this.moduleItems = this.treeviewService.getItemData('menu', this.assignedModuleArray, this.moduleArray);
							
						}
					});
			}
		}

	}
	getMappedAssignedModuleList2(pro_id) {
		this.assignedModuleArray = [];
		this.moduleArray = [];
		this.finalAssignedModules = [];
		this.moduleItems = [];
		let inputJson = { mapped_prefix: this.currentMappedSchoolData.si_school_prefix,login_id: this.login_id, role_id: '2', mor_type: 'app' };
		console.log('inputJson--', inputJson);
		this.userAccessMenuService.getUserAccessMenu(inputJson).subscribe(
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
					this.moduleDivFlag = true;
					this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'app' }).subscribe(
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
					if (this.assignedModuleArray.length > 0) {
						this.submitButton = false;
					}
				} else {
					this.moduleItems = [];
					this.moduleDivFlag = true;
					this.adminService.getModuleList({ role_id: 2, pro_id: pro_id, mor_type: 'app' }).subscribe(
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
		if (this.finalAssignedModules.length > 0) {
			const menuRelation: any = {
				login_id: this.login_id, pro_id: this.isApp ? '1' : this.ModuleForm.value.pro_id, menuRelation: this.finalAssignedModules,
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

	getGroupedSchool() {
		console.log('this.userDetails2', this.userDetails, {si_school_prefix: this.userDetails.au_si_prefix});
		this.schoolGroupData = [];
		this.commonAPIService.getAllSchoolGroups({si_school_prefix: this.userDetails.au_si_prefix}).subscribe((data:any)=>{
			if (data && data.status == 'ok') {
				this.schoolGroupData = data.data;
				console.log('this.schoolGroupData12--', this.schoolGroupData);
				this.getMappedSchoolWithUser();
			}
		})
	}

	getSession() {
		this.commonAPIService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sessionArray= result.data;
					}
				});
	}

	saveSchoolAccessPermission() {
		
		console.log('this.schoolAssignForm', this.schoolAssignForm, this.finalAssignedModules)
		if (!this.editNewUserFlag) {
			let inputJson = {
				schoolList: this.schoolAssignForm.value.schoolList, 
				projectList: { pro_id: this.schoolAssignForm.value.projectList },
				sessionList: { ses_id: this.schoolAssignForm.value.sessionList },
				interfaceList : {interface_id: this.schoolAssignForm.value.interfaceList},
				 
				current_school_group: this.schoolGroupData[0].si_group,
				current_user_data: this.userDetails
			}
			this.commonAPIService.assignSchoolGroupToUser(inputJson).subscribe((result:any) => {
				if (result && result.status == 'ok') {
					this.getMappedSchoolWithUser();
					this.toggleCreateUser('');
					this.notif.showSuccessErrorMessage('User Created Successfully', 'success');
				} else {
					this.notif.showSuccessErrorMessage('Error While Creating User', 'error');
				}
				


			});
		}
		 
	}

	updateSchoolAccessPermission() {
		let tempProjectList = [];
		if (this.schoolAssignForm.value.projectList && this.schoolAssignForm.value.projectList.length > 0) {
			for(var i=0; i<this.projectsArray.length;i++) {
				if (this.schoolAssignForm.value.projectList.indexOf(this.projectsArray[i]['pro_id']) > -1) {
					tempProjectList.push(this.projectsArray[i]);
				}
			}
		}
		let inputJson = {
			school_prefix: this.currentMappedSchoolData.au_si_prefix, 
			projectList: tempProjectList,
			sessionList: { ses_id: this.schoolAssignForm.value.sessionList },
			moduleList : this.finalAssignedModules,
			interfaceList : {interface_id: this.schoolAssignForm.value.interfaceList},			 
			mapped_school_group: this.schoolGroupData[0].si_group,
			mapped_user_data: this.currentMappedSchoolData,
			current_user_data : this.userDetails
		}
		
		this.commonAPIService.updateSchoolAccessPermission(inputJson).subscribe((result:any) => {
			if (result && result.status == "ok") {
				this.notif.showSuccessErrorMessage('User Permissions Updated Successfully', 'success');
			} else {
				this.notif.showSuccessErrorMessage('Error While Update User Permission', 'error');
			}
		});
		console.log('inputJson', inputJson, 'this.finalAssignedModules', this.finalAssignedModules);
	}

	createSchoolUserMapping() {
		let inputJson = {
			"sgm_ref_from_login_id" : this.userDetails.au_login_id,
			"sgm_username":this.userDetails.au_username,
			"sgm_si_prefix":this.schoolAssignForm.value.schoolList,
			"sgm_si_group_name":this.schoolGroupData[0].si_group,
			"sgm_ref_to_login_id":this.schoolAssignForm.value.mapUser,
			"sgm_mapped_status":'1'
		}
		this.commonAPIService.createSchoolUserMapping(inputJson).subscribe((result:any)=>{
			this.getMappedSchoolWithUser();
			this.notif.showSuccessErrorMessage('Mapping Done Successfully ', 'success');
		});
	}

	getSchoolUser() {
		this.commonAPIService.getSchoolUser({prefix:this.schoolAssignForm.value.schoolList})
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolUseArray= result.data;
					}
				});
	}

	getMappedSchoolWithUser() {
		let inputJson = {
			login_id:this.userDetails.au_login_id,
			group_name: this.schoolGroupData[0]['si_group'],
			prefix:this.userDetails.au_si_prefix
		};
		console.log('inputJson--', inputJson)
		this.commonAPIService.getMappedSchoolWithUser(inputJson).subscribe((result:any)=> {
			console.log('result--', result);
			this.mappedSchoolUserArray = result.user_data ? result.user_data  : [];
		});
	}

	manageSchoolUserAccess(item) {
		this.currentMappedSchoolData = item;
		this.editNewUserFlag = true;
		this.showNewSchoolUser = true;
		this.adminService.getMappedUserProject({ au_login_id: item.au_login_id, prefix: item.au_si_prefix }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					var tempProjectArr = [];
					//this.resultProjectListArray = JSON.parse(result.data[0].au_project_mapped);
					//this.projectListArray = JSON.parse(result.data[0].au_project_mapped);
					for(var i=0; i<JSON.parse(result.data[0].au_project_mapped).length;i++) {
						tempProjectArr.push(JSON.parse(result.data[0].au_project_mapped)[i]['pro_id']);
					}
					this.schoolAssignForm.patchValue({
						projectList :tempProjectArr,
						interfaceList: 'web'
					});
					this.assignedModuleArray = [];
					this.moduleArray = [];
					this.finalAssignedModules = [];
					this.moduleItems = [];
					console.log('item', item);
					
					this.getMappedUserAccessMenu();
					this.getMappedModuleList({value:tempProjectArr, mor_type:'web', role_id:'2'});
					console.log('this.schoolAssignForm', this.schoolAssignForm)
				}
			});

	}

	getMappedUserAccessMenu() {
		let inputJson = { mapped_prefix:this.currentMappedSchoolData.si_school_prefix,  login_id:this.currentMappedSchoolData.au_login_id, role_id: '2', mor_type: (this.schoolAssignForm.value.interfaceList ? this.schoolAssignForm.value.interfaceList : 'web') };
					console.log('inputJson--', inputJson);
					this.userAccessMenuService.getUserAccessMenu(inputJson).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								this.assignedModuleArray = result.data;
								// this.getMappedModuleList({value:tempProjectArr, mor_type:'web', role_id:'2'});
								
							}
						}
					);
	}
	revokeAccessToAssignSchool(item) {
		let inputJson = {
			sgm_ref_from_login_id: this.userDetails.au_login_id,
			sgm_si_prefix: item.au_si_prefix,
			sgm_si_group_name:this.schoolGroupData[0]['si_group'],
			sgm_ref_to_login_id:item.au_login_id
		}
		this.commonAPIService.revokeAccessToAssignSchool(inputJson).subscribe((result:any)=>{
			this.notif.showSuccessErrorMessage('Revoke Access Successfully', 'success');
			this.getMappedSchoolWithUser();
			//location.reload();
		});
	}

	enableAccessToAssignSchool(item) {
		let inputJson = {
			sgm_ref_from_login_id: this.userDetails.au_login_id,
			sgm_si_prefix: item.au_si_prefix,
			sgm_si_group_name:this.schoolGroupData[0]['si_group'],
			sgm_ref_to_login_id:item.au_login_id
		}
		this.commonAPIService.enableAccessToAssignSchool(inputJson).subscribe((result:any)=>{
			this.notif.showSuccessErrorMessage('Enable Access Successfully', 'success');
			this.getMappedSchoolWithUser();
			//location.reload();
		});
	}

	toggleCreateUser(event) {
		this.showNewSchoolUser=false;
		this.editNewUserFlag = false;
		this.currentMappedSchoolData = {};
		this.moduleArray =[];
	}

	showNewUser($event) {
		this.showNewSchoolUser=true;
		this.editNewUserFlag = false;
		this.currentMappedSchoolData = {};
		this.moduleArray =[];
	}

	onTabChanged(event) {
		// this.currentTab = event.index;
		// console.log('this.currentTab--', this.currentTab);
		this.moduleArray =[];
	}

}
