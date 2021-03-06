import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../admin-user-type/admin/services/admin.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AcsetupService } from '../../acsetup/service/acsetup.service';
import { NotificationService } from 'projects/axiom/src/app/_services/notification.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Element } from './school.model';
@Component({
	selector: 'app-school-listing',
	templateUrl: './school-listing.component.html',
	styleUrls: ['./school-listing.component.css']
})
export class SchoolListingComponent implements OnInit {
	schoolSetupDiv = true;
	hosturl = appConfig.apiUrl;
	file1: any = 'https://invictus-data.s3.ap-south-1.amazonaws.com/invictus/sis/documents/logo/document_150_1582010338.png';
	file2: any = 'https://invictus-data.s3.ap-south-1.amazonaws.com/invictus/sis/documents/favicon/document_50_1582010449.png';
	schooldetailsArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator)
	paginator: MatPaginator;
	@ViewChild(MatSort)
	sort: MatSort;
	displayedColumns = [
		'position',
		'logo',
		'schoolname',
		//'schoolprefix',
		//'board',
		//'affiliation',
		'address',
		'city',
		//'pin',
		'contact',
		//'email',
		//'manager',
		'action'
	];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	monthArray: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	invictusUserData:any;
	constructor(
		private adminService: AdminService,
		private acsetupService: AcsetupService,
		private fb: FormBuilder,
		private notif: NotificationService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
	}

	ngOnInit() {
		this.getInvictusUser();
		this.getSchoolDetails();
	}



	getSchoolDetails() {
		this.schooldetailsArray = [];
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.adminService.getSchoolDetails().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schooldetailsArray = result.data;
				let ind = 1;
				for (const t of this.schooldetailsArray) {
					if(this.checkForLoginAccess(t)) {
						this.ELEMENT_DATA.push({
							position: ind,
							logo: t.school_logo,
							schoolname: t.school_name,
							schoolprefix: t.school_prefix,
							board: t.school_board,
							affiliation: t.school_afflication_no,
							address: t.school_address,
							pin: t.si_pincode,
							contact: t.school_phone,
							city: t.school_city,
							email: t.school_email,
							manager: t.school_website,
							action: t,
						});
						ind++;
					}
					
				}
				this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.dataSource.sort = this.sort;
			} else {
				this.notif.showSuccessErrorMessage('No records found', 'error');
			}
		});
	}

	getSchoolStatusColor(value) {
		if (value === 1) {
			return 'green';
		} else {
			return 'red';
		}
	}
	viewDetaills(value) {
		console.log(value);
		this.router.navigate(['./school-ledger'], { queryParams: { school_id: value.school_id }, relativeTo: this.route });
	}
	loginForSupportUser(item) {
		var role_id = 2;
		var prefix = item.schoolprefix, usertype = 'admin';
		if (usertype == 'admin') {
			role_id = 2;
		} else if (usertype == 'teacher') {
			role_id = 3;
		} else if (usertype == 'student') {
			role_id = 4;
		}
		const hostName = 'https://login.invictusdigisoft.com/login?s=' + role_id + '-' + prefix;
		var left = (screen.width / 2) - (800 / 2);
		var top = (screen.height / 2) - (800 / 2);
		window.open(hostName, 'Staff', 'height=800,width=800,dialog=yes,resizable=no, top=' +
			top + ',' + 'left=' + left);
		// 	const dialogRef = this.dialog.open(SupportLoginModalComponent, {
		// 		height: '520px',
		// 		width: '800px',
		// 		data: {
		// 	title: 'Manage Admin User Access',
		// 	apiData:{data:item, schoolprefix:item.schoolprefix}   
		//   }
		// 	});
		// 	dialogRef.afterClosed().subscribe(dresult => {
		// 		console.log(dresult);
		// 		//this.getAccounts();
		// 	});
	}

	getInvictusUser() {
		this.invictusUserData = [];
		this.adminService.getAllUsers().subscribe((data:any)=>{
			if (data && data.status == 'ok') {
				let currentUser = JSON.parse(localStorage.getItem('currentUser'))['login_id'];
				for (var i=0; i<data.data.length;i++) {
					if(data.data[i]['au_login_id'] == currentUser) {
						this.invictusUserData = data.data[i];
					}
				}
				//console.log('this.invictusUserData--', this.invictusUserData);
			}
		})
	}

	checkForLoginAccess(item) {
		
		if (item && item.school_manager  && item.school_manager != 'undefined'  && item.school_manager != 0) {
			if(item.school_manager){
				var managerData = JSON.parse(item.school_manager);
				if (managerData.indexOf(this.invictusUserData.au_login_id) > -1) {
					return true;
				}
			} else {
				return false;
			}
			
		}
	}







}
