import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { BreadCrumbService, UserAccessMenuService, NotificationService } from '../../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {Element } from './user.model';
@Component({
	selector: 'app-user-management',
	templateUrl: './user-management.component.html',
	styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
	constructor(
		private userAccessMenuService: UserAccessMenuService,
		private qelementService: QelementService,
			private notif: NotificationService,
		private breadCrumbService: BreadCrumbService
	) { }

	currentUser: any[];
	userdetailArray: any[] = [];
	public role_id: any;
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;

	displayedColumns = ['position', 'userId', 'name', 'status', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getUser();
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	getUser() {
		this.userdetailArray = [];
		this.ELEMENT_DATA = [];
		this.qelementService.getUser({ role_id: '2', status: '1' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userdetailArray = result.data;
					let ind = 1;
					for (const t of this.userdetailArray) {
						this.ELEMENT_DATA.push({ position: ind, userId: t.au_username, name: t.au_full_name, status: t.au_status, action: t });
						ind++;
					}
					this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.dataSource.sort = this.sort;


				}
			});

	}
	deleteUsr(value) {
		this.userdetailArray.filter(item => {
			if (value === item.au_login_id) {
				this.currentUser = item.au_login_id;
			}
		});
	}

	deleteUser(currentUser) {
		// if(confirm('Are you sure? You want to Delete')== true)
		// {
		this.qelementService.deleteUser({ au_login_id: currentUser }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getUser();
					this.notif.showSuccessErrorMessage('User Deleted Successfully', 'success');
					} else {
					this.notif.showSuccessErrorMessage('Error Deleting the User', 'error');
				}
			},
		);
	}

	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() {  }

	toggleStatus(status) {
		if(status == 1) {
			status = 0;
		} else {
			status = 1;
		}
		console.log(status);
	}
}
