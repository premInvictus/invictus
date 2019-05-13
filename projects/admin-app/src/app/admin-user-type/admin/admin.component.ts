import { Component, OnInit } from '@angular/core';
import {AdminService} from '../admin/services/admin.service';
import {Router} from '@angular/router';


@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
	schooldetailsArray: any[];
	currentUser: any = {};


	constructor(private adminService: AdminService, private router: Router) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getUserAccessSchool();

	}
	getUserAccessSchool() {
		this.adminService.getUserAccessSchool({login_id: this.currentUser.login_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
						this.schooldetailsArray = result.data;
				}
			});
	}
loadSchool(value) {
	if (this.currentUser) {
		this.router.navigate(['/school']);
	}
}

onHidden(): void {
}
onShown(): void {
}
isOpenChange(): void {
}





}
