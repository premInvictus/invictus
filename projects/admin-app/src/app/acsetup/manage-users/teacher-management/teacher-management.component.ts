import { Component, OnInit, ViewChild} from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BreadCrumbService, UserAccessMenuService, NotificationService } from 'projects/axiom/src/app/_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './teacher.model';

@Component({
	selector: 'app-teacher-management',
	templateUrl: './teacher-management.component.html',
	styleUrls: ['./teacher-management.component.css']
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
		private userAccessMenuService: UserAccessMenuService,
		private fbuild: FormBuilder,
		private breadCrumbService: BreadCrumbService,
		private qelementService: QelementService,
		private notif: NotificationService) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getClass(this);
		this.getAllTeacher(this);
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
			that.qelementService.getAllTeacher(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						that.userdetailArray = result.data;
						let ind = 1;
						for (const t of that.userdetailArray) {
								// tslint:disable-next-line:max-line-length
								that.ELEMENT_DATA.push({ position: ind, userId: t.au_username, name: t.au_full_name, mobile: t.au_mobile, email: t.au_email, status: t.au_status, action: t });
							ind++;
						}
						that.dataSource = new MatTableDataSource<Element>(that.ELEMENT_DATA);
						that.dataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.dataSource.sort = that.sort;
					} else {
						that.tableCollection = false;
						that.notif.showSuccessErrorMessage('No records found', 'error');
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
		this.qelementService.deleteUser({ au_login_id: currentUser }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getAllTeacher(this);
					this.notif.showSuccessErrorMessage('Teacher deleted successfully', 'success');
				} else {
					this.notif.showSuccessErrorMessage('Error deleting teacher', 'error');
				}
			},
		);
	}

	getClass(that) {
		that.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.classArray = result.data;
				}
			}
		);
	}


	getSubjectsByClass(): void {
		this.qelementService.getSubjectsByClass(this.Filter_form.value.uc_class_id).subscribe(
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
		this.qelementService.getSectionsByClass(this.Filter_form.value.uc_class_id).subscribe(
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

