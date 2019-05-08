import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonAPIService } from './../../../_services/index';
import { ManageUsersService } from './../../service/manage-users.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './user.model';
@Component({
	selector: 'app-user-management',
	templateUrl: './user-management.component.html',
	styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
	constructor(
		private commonAPIService: CommonAPIService,
		private manageUsersService: ManageUsersService,
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
		this.homeUrl = this.commonAPIService.getUrl();
		this.getUser();
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}
	getUser() {
		this.userdetailArray = [];
		this.ELEMENT_DATA = [];
		this.manageUsersService.getUser({ role_id: '2', status: '1' }).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.userdetailArray = result.data;
					let ind = 1;
					for (const t of this.userdetailArray) {
						this.ELEMENT_DATA.push({ position: ind, userId: t.au_username, name: t.au_full_name, status: t.au_status, action: t });
						ind++;
					}
					this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
					/* this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.dataSource.sort = this.sort; */


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
		this.manageUsersService.deleteUser({ au_login_id: currentUser }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getUser();
					this.commonAPIService.showSuccessErrorMessage('User Deleted Successfully', 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error Deleting the User', 'error');
				}
			},
		);
	}

	openModal = (data) => this.deleteModalRef.openModal(data);
	deleteComCancel() { }
}
