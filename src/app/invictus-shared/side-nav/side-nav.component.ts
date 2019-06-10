import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserAccessMenuService } from '../../_services/index';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { Router } from '@angular/router';
export function getAccordionConfig(): AccordionConfig {
	return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
	selector: 'app-side-nav',
	templateUrl: './side-nav.component.html',
	styleUrls: ['./side-nav.component.css'],
	providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }]
})
export class SideNavComponent implements OnInit, OnChanges {


	currentUser: any = {};
	userAccessMenuArray: any[] = [];
	menuSubmenuArray: any[] = [];
	upperMenu: any;
	user_role_id;
	submenuLength = 0;
	submenuLengthArray: any[] = [];
	showSubmenuArray: any[] = [];
	@Input() projectId: any = '1';
	constructor(private userAccessMenuService: UserAccessMenuService, private router: Router) { }
	ngOnChanges() {
		this.getUserAccessMenu(this.projectId);
	}

	ngOnInit() {
		this.upperMenu = '<i class=\'fas fa-users\'></i>';
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.user_role_id = this.currentUser.role_id;
		this.getUserAccessMenu(this.projectId);
	}

	moveToDashboard() {
		if (this.currentUser.role_id === '1') {
			this.router.navigateByUrl('admin');
		} else if (this.currentUser.role_id === '2') {
			if (localStorage.getItem('project')) {
				const url = JSON.parse(localStorage.getItem('project')).pro_url;
				if (url === 'axiom') {
					this.router.navigateByUrl('axiom/school');
				} else if (url === 'sis') {
					this.router.navigateByUrl('sis/school');
				} else if (url === 'fees') {
					this.router.navigateByUrl('fees/school');
				} else if (url === 'smart') {
					this.router.navigateByUrl('smart/school');
				}
			}
		} else if (this.currentUser.role_id === '3') {
			this.router.navigateByUrl('axiom/teacher');
		} else {
			this.router.navigateByUrl('student');
		}
	}

	getUserAccessMenu(pro_id) {
		// this is used to render side nav as per project id
		this.userAccessMenuArray = [];
		this.menuSubmenuArray = [];
		if (Number(this.currentUser.role_id) === 1) {
			const param: any = {};
			param.login_id = this.currentUser.login_id;
			param.role_id = this.currentUser.role_id;
			param.pro_id = pro_id;
			this.userAccessMenuService.getUserAccessMenu(param).subscribe(
				(result: any) => {
					if (result.status === 'ok') {
						this.userAccessMenuService.setUserAccessMenu(result.data);
						this.userAccessMenuArray = result.data;
						localStorage.setItem('userAccessMenu', JSON.stringify({ menus: this.userAccessMenuArray }));
						const morStatusEnabledArray: any[] = [];
						for (const item of this.userAccessMenuArray) {
							if (item.mor_status === '1') {
								morStatusEnabledArray.push(item);
							}
						}
						for (const level0 of morStatusEnabledArray) {
							let menu: any = {};
							if (level0.mod_level === '0') {
								menu = level0;
								menu.submenu = [];
								for (const level1 of morStatusEnabledArray) {
									if (level1.mod_parent_id === level0.mod_id) {
										menu.submenu.push(level1);
									}
								}
								this.menuSubmenuArray.push(menu);
							}
						}
					} else {
						this.menuSubmenuArray = [];
					}
				});
		} else if (Number(this.currentUser.role_id) === 2) {
			const param: any = {};
			param.login_id = this.currentUser.login_id;
			param.role_id = this.currentUser.role_id;
			param.pro_id = pro_id;
			this.userAccessMenuService.getUserAccessMenu(param).subscribe(
				(result: any) => {
					if (result.status === 'ok') {
						this.userAccessMenuService.setUserAccessMenu(result.data);
						this.userAccessMenuArray = result.data;
						localStorage.setItem('userAccessMenu', JSON.stringify({ menus: this.userAccessMenuArray }));
						for (const level0 of this.userAccessMenuArray) {
							let menu: any = {};
							if (level0.mod_level === '0') {
								menu = level0;
								menu.submenu = [];
								for (const level1 of this.userAccessMenuArray) {
									if (level1.mod_parent_id === level0.mod_id) {
										menu.submenu.push(level1);
									}
								}
								this.menuSubmenuArray.push(menu);
							}
						}
					} else {
						this.menuSubmenuArray = [];
					}
				}
			);
		} else if (Number(this.currentUser.role_id) === 3) {
			const param: any = {};
			param.login_id = this.currentUser.login_id;
			param.role_id = this.currentUser.role_id;
			param.pro_id = pro_id;
			this.userAccessMenuService.getUserAccessMenu(param).subscribe(
				(result: any) => {
					if (result.status === 'ok') {
						this.userAccessMenuService.setUserAccessMenu(result.data);
						this.userAccessMenuArray = result.data;
						localStorage.setItem('userAccessMenu', JSON.stringify({ menus: this.userAccessMenuArray }));
						for (const level0 of this.userAccessMenuArray) {
							let menu: any = {};
							if (level0.mod_level === '0') {
								menu = level0;
								menu.submenu = [];
								for (const level1 of this.userAccessMenuArray) {
									if (level1.mod_parent_id === level0.mod_id) {
										menu.submenu.push(level1);
									}
								}
								this.menuSubmenuArray.push(menu);
							}
						}
					} else {
						this.menuSubmenuArray = [];
					}
				}
			);
		} else if (Number(this.currentUser.role_id) === 4) {
			const studentMenuArray: any[] = [];
			const param: any = {};
			param.role_id = this.currentUser.role_id;
			this.userAccessMenuService.getUserAccessMenu(param).subscribe(
				(result: any) => {
					if (result.status === 'ok') {
						this.userAccessMenuService.setUserAccessMenu(result.data);
						this.userAccessMenuArray = result.data;
						localStorage.setItem('userAccessMenu', JSON.stringify({ menus: this.userAccessMenuArray }));
						for (const level0 of this.userAccessMenuArray) {
							const findex = studentMenuArray.findIndex(f => Number(f.menu_mod_id) === Number(level0.menu_mod_id));
							if (findex === -1) {
								studentMenuArray.push(level0);
							}
						}
						for (const level0 of studentMenuArray) {
							let menu: any = {};
							if (level0.mod_level === '0') {
								menu = level0;
								menu.submenu = [];
								for (const level1 of this.userAccessMenuArray) {
									if (level1.mod_parent_id === level0.mod_id) {
										menu.submenu.push(level1);
									}
								}
								this.menuSubmenuArray.push(menu);
							}
						}
					} else {
						this.menuSubmenuArray = [];
					}
				}
			);
		}
	}
	activateDiv(index) {
		this.showSubmenuArray[index] = true;
		const menuToggle = JSON.parse(localStorage.getItem('menuToggle'));
		if (menuToggle && menuToggle.menuIndex !== index) {
			const showdiv2 = document.getElementById(menuToggle.menuId);
			this.showSubmenuArray[menuToggle.menuIndex] = false;
			showdiv2.style.display = menuToggle.display === 'block' ? 'block' : 'none';
			if (showdiv2.style.display === 'none' || showdiv2.style.display === '') {
				showdiv2.style.display = 'block';
			} else {
				showdiv2.style.display = 'none';
			}
		}
		const showdiv = document.getElementById('menu' + index);
		showdiv.style.display = showdiv.style.display === 'block' ? 'block' : 'none';
		if (showdiv.style.display === 'none' || showdiv.style.display === '') {
			showdiv.style.display = 'block';
		} else {
			showdiv.style.display = 'none';
		}
		const menuJSon = {
			menuId: 'menu' + index,
			menuIndex: index,
			display: showdiv.style.display
		};
		localStorage.setItem('menuToggle', JSON.stringify(menuJSon));
	}
}
