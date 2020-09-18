import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../admin-user-type/admin/services/admin.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AcsetupService } from '../../acsetup/service/acsetup.service';
import { NotificationService } from 'projects/axiom/src/app/_services/notification.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {Router,ActivatedRoute} from '@angular/router';
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
	constructor(
		private adminService: AdminService,
		private acsetupService: AcsetupService,
		private fb: FormBuilder,
		private notif: NotificationService,
    private router: Router,
    private route:ActivatedRoute   
	) { }

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
	}

	ngOnInit() {
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
	viewDetaills(value){
    console.log(value);
    this.router.navigate(['./school-ledger'], {queryParams: {school_id: value.school_id}, relativeTo: this.route});
  }
}
