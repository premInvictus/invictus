import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Element } from './model';
import { AdminService } from './../../admin-user-type/admin/services/admin.service';
@Component({
	selector: 'app-admin-user-access-model',
	templateUrl: './admin-user-access-model.component.html',
	styleUrls: ['./admin-user-access-model.component.css']
})
export class AdminUserAccessModalComponent implements OnInit {
	ELEMENT_DATA: Element[];
	accountsArray: any[] = [];
	displayedColumns: string[] = ['srno', 'user_id', 'user_name',  'user_email', 'user_flag'];
	dataSource = new MatTableDataSource<Element>();
	selection = new SelectionModel<Element>(true, []);
	school_prefix='';
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	constructor(public dialogRef: MatDialogRef<AdminUserAccessModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,private adminService: AdminService,) {
			console.log('data--', data);
		this.accountsArray = data.apiData.result.data;
		this.school_prefix = data.apiData.schoolprefix;
	}

	ngOnInit() {

		let element: any = {};
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		let pos = 1;

		console.log('this.accountsArray', this.accountsArray);
		for (const item of this.accountsArray) {
            element = {
              // srno: pos,
              // verified_on: new DatePipe('en-in').transform(item.verfication_on_date, 'd-MMM-y'),
              // verified_by: item.verfication_by ? item.verfication_by : '-',
              // verfication_by_name: item.verfication_by_name ? item.verfication_by_name : '-',
              // no_of_books: this.bookCount(item.details) ? this.bookCount(item.details) : '-'
              srno: pos,
              user_id: item.au_login_id,
              user_name: item.au_full_name,
              user_flag: item.au_user_access_flag ? '1' : '0',
              user_email: item.au_email,
              
             
              action:item

            };
            this.ELEMENT_DATA.push(element);
            pos++;
            
          }
          this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

		// this.dataSource.paginator = this.paginator;
		// this.dataSource.sort = this.sort;

	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
		this.selection.clear() :
		this.dataSource.data.forEach(row => this.selection.select(row));
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: Element): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.user_id}`;
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	toggleUserAccess(item, event) {
		var inputJson  = {au_login_id: item.au_login_id, au_user_access_flag: item.au_user_access_flag ? 0 : 1 };
		console.log(item, event, inputJson);
		this.adminService.setAdminUserAccessFlag({user_data:[inputJson],schoolprefix: this.school_prefix}).subscribe((result:any) => {
			this.manageSchoolUser();
		});
	}

	manageSchoolUser() {
		this.adminService.getSchoolAdminUsers({schoolprefix: this.school_prefix}).subscribe((result:any) => {
			
			this.accountsArray = result;
		})
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}

	closeDialog() {
		this.dialogRef.close();
	}


}
