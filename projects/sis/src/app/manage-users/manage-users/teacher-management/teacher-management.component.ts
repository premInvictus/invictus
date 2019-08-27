import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService, SmartService} from './../../../_services/index';
import { ManageUsersService } from './../../service/manage-users.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './teacher.model';

@Component({
	selector: 'app-teacher-management',
	templateUrl: './teacher-management.component.html',
	styleUrls: ['./teacher-management.component.scss']
})
export class TeacherManagementComponent implements OnInit {

	Filter_form: FormGroup;
	currentUser: any[];
	userdetailArray: any[] = [];
	classArray: any[];
	sectionArray: any[];
	subjectArray: any[];
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	tableCollection = false;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;

	displayedColumns = ['position', 'userId', 'name', 'mobile', 'email', 'status', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	constructor(
		private commonAPIService: CommonAPIService,
		private fbuild: FormBuilder,
		private manageUsersService: ManageUsersService,
		private smartService: SmartService
	) { }

	ngOnInit() {
		this.homeUrl = this.commonAPIService.getUrl();
		this.buildForm();
		this.getClass();
		this.getAllTeacher(this);
		this.tableCollection = true;
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}

	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}

	buildForm() {
		this.Filter_form = this.fbuild.group({
			uc_class_id: '',
			uc_sub_id: '',
			uc_sec_id: '',
			au_full_name: ''
		});
	}

	getAllTeacher(that) {
		that.userdetailArray = [];
		that.ELEMENT_DATA = [];
		const param: any = {};
		if (that.Filter_form.value.uc_class_id) {
			param.class_id = that.Filter_form.value.uc_class_id;
		}
		if (that.Filter_form.value.uc_sec_id) {
			param.sec_id = that.Filter_form.value.uc_sec_id;
		}
		if (that.Filter_form.value.uc_sub_id) {
			param.sub_id = that.Filter_form.value.uc_sub_id;
		}
		param.role_id = '3';
		param.status = 1;
		if (that.Filter_form.valid) {
			that.manageUsersService.getAllTeacher(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						that.userdetailArray = result.data;
						let ind = 1;
						for (const t of that.userdetailArray) {
							that.ELEMENT_DATA.push({
								position: ind,
								userId: t.au_username,
								name: t.au_full_name,
								mobile: t.au_mobile,
								email: t.au_email,
								status: t.au_status,
								action: t
							});
							ind++;
						}
						that.dataSource = new MatTableDataSource<Element>(that.ELEMENT_DATA);
						that.dataSource.paginator = that.paginator;
						if (that.sort) {
							that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						}
						that.dataSource.sort = that.sort;
					} else {
						that.tableCollection = false;
						that.commonAPIService.showSuccessErrorMessage('No records found', 'error');
					}
				}
			);
		}
		that.tableCollection = true;
	}

	deleteUsr(value) {
		this.userdetailArray.filter(item => {
			if (value === item.au_login_id) {
				this.currentUser = item.au_login_id;
			}
		});
	}

	deleteUser(currentUser) {
		this.manageUsersService.deleteUser({ au_login_id: currentUser }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getAllTeacher(this);
					this.commonAPIService.showSuccessErrorMessage('Teacher deleted successfully', 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error deleting teacher', 'error');
				}
			},
		);
	}

	/* getClass(that) {
		that.manageUsersService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.classArray = result.data;
				}
			}
		);
	}


	getSubjectsByClass(): void {
		this.manageUsersService.getSubjectsByClass(this.Filter_form.value.uc_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			}
		);
	}

	getSectionsByClass(): void {
		this.manageUsersService.getSectionsByClass(this.Filter_form.value.uc_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			}
		);
	} */
	getClass() {
		this.smartService.getClass({class_status: '1'}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}


	getSubjectsByClass(): void {
		this.smartService.getSubjectsByClass({class_id: this.Filter_form.value.uc_class_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			}
		);
	}

	getSectionsByClass(): void {
		this.smartService.getSectionsByClass({class_id: this.Filter_form.value.uc_class_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			}
		);
	}

	openModal = (data) => this.deleteModalRef.openModal(data);
	deleteComCancel() { }
}

