import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BreadCrumbService } from 'projects/axiom/src/app/_services/breadcrumb.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './accessuser.model';

@Component({
	selector: 'app-accesscontrol',
	templateUrl: './accesscontrol.component.html',
	styleUrls: ['./accesscontrol.component.css']
})
export class AccesscontrolComponent implements OnInit {
	userdetailArray: any[] = [];
	public role_id: any;
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator)
	paginator: MatPaginator;
	@ViewChild(MatSort)
	sort: MatSort;
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	displayedColumns = [
		'position',
		'fullname',
		'loginid',
		'accesslevel',
		'rights',
		'readonly',
		'reports',
		'priviledges',
		'status',
		'action'
	];

	constructor(
		private adminService: AdminService,
		private qelementService: QelementService,
		private notif: NotificationsService,
		private route: ActivatedRoute,
		private breadCrumbService: BreadCrumbService
	) {}

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getUser(this);
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
	}

	getUser(that) {
		that.userdetailArray = [];
		that.ELEMENT_DATA = [];
		this.qelementService
			.getUser({ role_id: '1', status: '1' })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					that.userdetailArray = result.data;
					let ind = 1;
					for (const t of that.userdetailArray) {
						that.ELEMENT_DATA.push({
							position: ind,
							fullname: t.au_full_name,
							loginid: t.au_login_id,
							accesslevel: 'NA',
							rights: 'NA',
							readonly: 'NA',
							reports: 'NA',
							priviledges: 'NA',
							status: t.au_status,
							action: t
						});
						ind++;
					}
					that.dataSource = new MatTableDataSource<Element>(that.ELEMENT_DATA);
					that.dataSource.paginator = that.paginator;
					that.sort.sortChange.subscribe(() => (that.paginator.pageIndex = 0));
					that.dataSource.sort = that.sort;
				}
			});
	}

	deleteUser(au_login_id) {
		if (confirm('Are you sure? You want to Delete') === true) {
			this.qelementService
				.deleteUser({ au_login_id: au_login_id })
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.getUser(this);
						this.notif.success('Success', 'User Deleted Successfully', {
							timeOut: 2000,
							showProgressBar: true,
							pauseOnHover: false,
							clickToClose: true,
							maxLength: 50
						});
					} else {
						this.notif.error('Error', 'Error Deleting the User', {
							timeOut: 2000,
							showProgressBar: true,
							pauseOnHover: false,
							clickToClose: true,
							maxLength: 50
						});
					}
				});
		}
	}
}
