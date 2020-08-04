import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BreadCrumbService, UserAccessMenuService, NotificationService, SmartService, CommonAPIService } from '../../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './student.model';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
	selector: 'app-student-management',
	templateUrl: './student-management.component.html',
	styleUrls: ['./student-management.component.css']
})

export class StudentManagementComponent implements OnInit {
	Filter_form: FormGroup;
	studentdetailArray: any[] = [];
	classArray: any[];
	currentUser: any[];
	sectionArray: any[] = [];
	public role_id: any;
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	tableCollection = false;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;

	displayedColumns = ['position', 'userId', 'name', 'class', 'section', 'mobile', 'email', 'status', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);


	constructor(private userAccessMenuService: UserAccessMenuService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private smartService: SmartService,
		private common: CommonAPIService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getClass();
		this.buildForm();
		this.getUser();
		this.tableCollection = true;
	}
	toggleStatus(au_login_id, status) {
		console.log(status);
		if (status === '1') {
			status = '0';
		} else {
			status = '1';
		}
		this.qelementService.changeUserStatus({ au_login_id: au_login_id, au_status: status }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getUser();
					this.notif.showSuccessErrorMessage(result.data, 'success');
				} else {
					this.notif.showSuccessErrorMessage(result.data, 'error');
				}
			},
		);
	}
	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	buildForm() {
		this.Filter_form = this.fbuild.group({
			au_full_name: '',
			au_class_id: '',
			au_sec_id: ''
		});

	}
	getUser() {
		this.studentdetailArray = [];
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		const param: any = {};
		if (this.Filter_form.value.au_class_id) {
			param.class_id = this.Filter_form.value.au_class_id;
		}
		if (this.Filter_form.value.au_sec_id) {
			param.sec_id = this.Filter_form.value.au_sec_id;
		}
		param.role_id = '4';
		param.enrollment_type = ['3','4'];
		this.common.getMasterStudentDetail(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.studentdetailArray = result.data;
					let ind = 1;
					for (const t of this.studentdetailArray) {
						// tslint:disable-next-line:max-line-length
						this.ELEMENT_DATA.push({
							position: ind,
							userId: t.au_username,
							name: t.au_full_name,
							class: t.class_name,
							section: t.sec_name,
							mobile: t.au_mobile,
							email: t.au_email,
							status: t.au_status === '1' ? true : false,
							action: t
						});
						ind++;
					}
					this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.dataSource.sort = this.sort;
					this.tableCollection = true;
				} else {
					this.tableCollection = false;
					this.notif.showSuccessErrorMessage('No records found', 'error');
				}
			}
		);
	}zz
	/*getUser() {
		this.studentdetailArray = [];
		this.ELEMENT_DATA = [];
		const param: any = {};
		if (this.Filter_form.value.au_full_name) {
			param.full_name = this.Filter_form.value.au_full_name;
		}
		if (this.Filter_form.value.au_class_id) {
			param.class_id = this.Filter_form.value.au_class_id;
		}
		if (this.Filter_form.value.au_sec_id) {
			param.sec_id = this.Filter_form.value.au_sec_id;
		}
		param.role_id = '4';
		param.status = 1;
		if (this.Filter_form.valid) {
			this.qelementService.getUser(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.studentdetailArray = result.data;
						let ind = 1;
						for (const t of this.studentdetailArray) {
							// tslint:disable-next-line:max-line-length
							this.ELEMENT_DATA.push({ 
								position: ind, 
								userId: t.au_username, 
								name: t.au_full_name, 
								class: t.class_name, 
								section: t.sec_name,
								mobile: t.au_mobile, 
								email: t.au_email, 
								status: t.au_status === '1' ? true : false,
								action: t });
							ind++;
						}
						this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.dataSource.sort = this.sort;
					} else {
						this.tableCollection = false;
						this.notif.showSuccessErrorMessage('No records found', 'error');
					}

				}
			);
		}
		this.tableCollection = true;
	}*/
	deleteStu(value) {
		this.studentdetailArray.filter(item => {
			if (value === item.au_login_id) {
				this.currentUser = item.au_login_id;
			}
		});
	}

	deleteUser(currentUser) {
		this.qelementService.deleteUser({ au_login_id: currentUser }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getUser();
					this.notif.showSuccessErrorMessage('Student  Deleted Successfully', 'success');
				} else {
					this.notif.showSuccessErrorMessage('Deleting Student', 'error');
				}
			},
		);
	}


	// changed for smart module
	getClass() {
		this.classArray = [];
		this.smartService.getClass({ class_status: '1' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}

	getSectionsByClass(): void {
		this.sectionArray = [];
		this.smartService.getSectionsByClass({ class_id: this.Filter_form.value.au_class_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				}
			}
		);
	}
	// end

	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() { }
	openchangepasswordmodal(au_login_id) {
		const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
			width: '500px',
			data: {au_login_id: au_login_id}
		  });
	  
		  dialogRef.afterClosed().subscribe(result => {
			if(result.changed === '1') {
				this.notif.showSuccessErrorMessage('Updated Successfully', 'success');
			}
		  });
	}

}



