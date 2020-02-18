import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, ErrorStateMatcher } from '@angular/material';
import { CommonAPIService, SisService,SmartService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Element } from './branch-tool.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-branch-transfer-tool',
	templateUrl: './branch-transfer-tool.component.html',
	styleUrls: ['./branch-transfer-tool.component.scss']
})
export class BranchTransferToolComponent implements OnInit, AfterViewInit {

	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	displayedColumns: any[] = ['select', 'no', 'name', 'class', 'section', 'action'];
	PROMOTE_ELEMENT_DATA: Element[] = [];
	promotedataSource = new MatTableDataSource<Element>(this.PROMOTE_ELEMENT_DATA);
	enrollMentTypeArray: any[] = [{
		au_process_type: '3', au_process_name: 'Provisional Admission'
	},
	{
		au_process_type: '4', au_process_name: 'Admission'
	},
	{
		au_process_type: '5', au_process_name: 'Alumini'
	}];
	classArray: any[] = [];
	tclassArray: any[] = [];
	sectionArray: any[] = [];
	disableApiCall = false;
	promotionSectionArray: any[] = [];
	promoteForm: FormGroup;
	sessionArray: any[] = [];
	currentSessionStudentCount: any;
	currentDate = new Date();
	sessionPromote: any;
	promoteSessionId: any;
	promoteStudentListArray: any[] = [];
	promoteFlag = false;
	toBePromotedList: any[] = [];
	branchArray: any[] = [];
	promotionListAllFlag = false;
	session; any = {};
	prev: any;
	next: any;
	orderByArray: any[] = [{ order_by: 'sec_id', order_by_name: 'Section' }];
	@ViewChild('sortP') sortP: MatSort;
	@ViewChild('deleteModal') deleteModal;


	constructor(private commonApiService: CommonAPIService,
		private sisService: SisService,
		private SmartService: SmartService,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.session = JSON.parse(localStorage.getItem('session'));
		this.buildForm();
		this.getClass();
		// this.getSession();
		this.getBranch();
		// this.sessionPromote = this.currentDate.getFullYear() - 1 + '-' + (this.currentDate.getFullYear().toString()).substring(2, 4);
		// this.sessionDemote = this.currentDate.getFullYear() + '-' + ((this.currentDate.getFullYear() + 1).toString()).substring(2, 4);
		this.promoteFlag = false;
	}
	ngAfterViewInit() {
		this.promotedataSource.sort = this.sortP;
	}
	buildForm() {
		this.promoteForm = this.fbuild.group({
			class_id: '',
			new_class_id: '',
			ses_id: '',
			sec_id: '',
			enrollment_type: '',
			order_by: '',
			br_id: '',
			to_ses_id: ''
		});
	}

	applyFilterPromote(filterValue: string) {
		this.promotedataSource.filter = filterValue.trim().toLowerCase();
	}

	getClass() {
		this.SmartService.getClassData({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}

	getBranchClassAndSession(event) {
		this.sessionArray = [];
		this.tclassArray = [];
		this.sisService.getBranchClassAndSession({br_id: event.value}).subscribe((result: any) => {
			if (result.status === 'ok') {
				if (result.data.classes) {
					this.tclassArray = result.data.classes;
				}
				if (result.data.session) {
					this.sessionArray = result.data.session;
				}
			}
		});
	}

	getBranch() {
		this.branchArray = [];
		this.sisService.getBranch({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.branchArray = result.data;
			}
		});
	}

	getSectionByClassForPromotion(class_id) {
		this.promotionSectionArray = [];
		this.sisService.getSectionsByClass({ class_id: class_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.promotionSectionArray = result.data;
			}
		});
	}

	getSession() {
		this.sessionArray = [];
		this.sisService.getSession().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sessionArray = result.data;
				/* for (const item of this.sessionArray) {
					const findex = this.sessionArray.findIndex(f => f.ses_id === this.session.ses_id);
					if (findex !== -1) {
						this.promoteSessionId = this.session.ses_id;
						this.sessionPromote = this.sessionArray[findex].ses_name;
						this.getCountCurrentYearStudents();
						this.prev = Number(this.sessionPromote.split('-')[0]) + 1;
						this.next = Number(this.sessionPromote.split('-')[1]) + 1;
					}
				} */
			}
		});
	}
	getCountCurrentYearStudents() {
		this.sisService.getCountStudents({
			ses_id: this.promoteSessionId
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.currentSessionStudentCount = result.data;
			}
		});
	}

	getPromotionList() {
		this.toBePromotedList = [];
		this.promoteStudentListArray = [];
		this.PROMOTE_ELEMENT_DATA = [];
		this.promotedataSource = new MatTableDataSource<Element>(this.PROMOTE_ELEMENT_DATA);
		if (!this.promoteForm.value.enrollment_type) {
			this.commonApiService.showSuccessErrorMessage('Enroll type needed', 'error');
		} else if (!this.promoteForm.value.class_id) {
			this.commonApiService.showSuccessErrorMessage('Previous Class needed', 'error');
		} else {
			this.disableApiCall = true;
			this.sisService.getStudentsPromotionTool({
				class_id: this.promoteForm.value.class_id,
				ses_id: this.promoteSessionId,
				sec_id: this.promoteForm.value.sec_id,
				enrollment_type: this.promoteForm.value.enrollment_type,
				order_by: this.promoteForm.value.order_by
			}).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.promoteStudentListArray = result.data;
					let counter = 1;
					for (const item of this.promoteStudentListArray) {
						this.PROMOTE_ELEMENT_DATA.push({
							select: counter,
							no: item.au_login_id,
							name: item.au_full_name,
							class: item.class_name,
							section: item.sec_id !== '0' ? item.sec_name : '-',
							em_admission_no: this.promoteForm.value.enrollment_type === '4' ? item.em_admission_no : item.em_provisional_admission_no,
							action: item
						});
						counter++;
					}
					this.promotedataSource = new MatTableDataSource<Element>(this.PROMOTE_ELEMENT_DATA);
					this.promotedataSource.sort = this.sortP;
					this.promoteFlag = true;
					this.disableApiCall = false;
				} else {
					this.PROMOTE_ELEMENT_DATA = [];
					this.promotedataSource = new MatTableDataSource<Element>(this.PROMOTE_ELEMENT_DATA);
					this.commonApiService.showSuccessErrorMessage('No Records Found', 'error');
					this.promoteFlag = false;
					this.disableApiCall = false;
				}
			});
		}
	}

	isSelectedP(login_id) {
		return this.toBePromotedList.findIndex(f => f.em_admission_no === login_id) !== -1 ? true : false;
	}
	isDisabledP(login_id) {
		return this.promoteStudentListArray.findIndex(f => f.au_login_id === login_id && f.au_transfer_status === '1') !== -1 ? true : false;
	}
	insertIntoToBePromotedList($event, item) {
		console.log($event.source.value);
		if ($event.checked === true) {
			this.toBePromotedList.push({
				em_admission_no: $event.source.value,
				item: item
			});
		} else {
			const findex = this.toBePromotedList.findIndex(f => f.em_admission_no === $event.source.value);
			this.toBePromotedList.splice(findex, 1);
		}
	}

	promoteStudent(item) {
		if (!this.promoteForm.value.new_class_id) {
			this.commonApiService.showSuccessErrorMessage('New Class Required', 'error');
		} else {
			this.disableApiCall = true;
			let enrollment_no = 0;
			if (this.promoteForm.value.enrollment_type === '3') {
				enrollment_no = item.action.em_provisional_admission_no;
			} else if (this.promoteForm.value.enrollment_type === '4') {
				enrollment_no = item.action.em_admission_no;
			} else if (this.promoteForm.value.enrollment_type === '5') {
				enrollment_no = item.action.em_alumini_no;
			}
			this.sisService.branchTransfer({
				students: [{
					login_id: item.action.au_login_id,
					enrollment_no: enrollment_no,
					class_id: this.promoteForm.value.class_id,
					transfered_class_id: this.promoteForm.value.new_class_id,
					enrollment_type: this.promoteForm.value.enrollment_type,
					transfered_enrollment_type: '4',
					br_id: this.promoteForm.value.br_id,
					to_ses_id: this.promoteForm.value.to_ses_id
				}]
			}).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					// tslint:disable-next-line:max-line-length
					this.commonApiService.showSuccessErrorMessage('Student of admission number ' + item.action.au_login_id + ' has been transfered', 'success');
					this.getPromotionList();
					this.getCountCurrentYearStudents();
					this.disableApiCall = false;
				} else {
					this.commonApiService.showSuccessErrorMessage(result.data, 'error');
					this.disableApiCall = false;
				}
			});
		}
	}

	checkAllPromotionList($event) {
		this.toBePromotedList = [];
		if ($event.checked === true) {
			this.promotionListAllFlag = true;
			for (const item of this.PROMOTE_ELEMENT_DATA) {
				if (item.action.au_transfer_status === '0') {
					this.toBePromotedList.push({
						em_admission_no: item.no,
						item: item.action
					});
				}
			}
		} else {
			this.promotionListAllFlag = false;
		}
	}
	promoteStudentInBulk() {
		console.log(this.promoteForm.value);
		if (!this.promoteForm.value.new_class_id) {
			this.commonApiService.showSuccessErrorMessage('New Class Required', 'error');
		} else {
			this.disableApiCall = true;
			const promoteBulkArray: any[] = [];
			console.log(this.toBePromotedList);
			for (const titem of this.toBePromotedList) {
				let enrollment_no = 0;
				if (this.promoteForm.value.enrollment_type === '3') {
					enrollment_no = titem.item.em_provisional_admission_no;
				} else if (this.promoteForm.value.enrollment_type === '4') {
					enrollment_no = titem.item.em_admission_no;
				} else if (this.promoteForm.value.enrollment_type === '5') {
					enrollment_no = titem.item.em_alumini_no;
				}
				promoteBulkArray.push({
					login_id: titem.item.au_login_id,
					enrollment_no: enrollment_no,
					class_id: this.promoteForm.value.class_id,
					transfered_class_id: this.promoteForm.value.new_class_id,
					enrollment_type: this.promoteForm.value.enrollment_type,
					transfered_enrollment_type: '4',
					br_id: this.promoteForm.value.br_id,
					to_ses_id: this.promoteForm.value.to_ses_id
				});
			}
			if (promoteBulkArray.length > 0) {
				this.sisService.branchTransfer({
					students: promoteBulkArray
				}).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonApiService.showSuccessErrorMessage('Transfered Successfully', 'success');
						this.promoteStudentListArray = [];
						this.PROMOTE_ELEMENT_DATA = [];
						this.toBePromotedList = [];
						this.getPromotionList();
						this.getCountCurrentYearStudents();
						this.disableApiCall = false;
					} else {
						this.commonApiService.showSuccessErrorMessage(result.data, 'error');
						this.disableApiCall = false;
					}
				});
			}
		}
	}

	openDeleteModal(data = null) {
		this.deleteModal.openModal(data);
	}
	transferConfirm(item) {
		if (item) {
			this.promoteStudent(item);
		} else {
			this.promoteStudentInBulk();
		}
	}

}
