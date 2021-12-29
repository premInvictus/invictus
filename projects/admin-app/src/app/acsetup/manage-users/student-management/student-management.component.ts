import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BreadCrumbService, UserAccessMenuService, NotificationService } from 'projects/axiom/src/app/_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './student.model';

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

	displayedColumns = ['position', 'userId', 'name', 'class', 'section', 'mobile', 'email', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);


	constructor(private userAccessMenuService: UserAccessMenuService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getClass();
		this.buildForm();
		this.getUser();
		this.tableCollection = true;
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
							this.ELEMENT_DATA.push({ position: ind, userId: t.au_username, name: t.au_full_name, class: t.class_name, section: t.sec_name, mobile: t.au_mobile, email: t.au_email, action: t });
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
	}
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


	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}

	getSectionsByClass(): void {
		this.qelementService.getSectionsByClass(this.Filter_form.value.au_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			}
		);
	}

	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() {  }

}



