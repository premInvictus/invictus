import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, ErrorStateMatcher } from '@angular/material';
import { CommonAPIService, SisService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Element } from './promotion-tool.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-promotion-tool',
	templateUrl: './promotion-tool.component.html',
	styleUrls: ['./promotion-tool.component.scss']
})
export class PromotionToolComponent implements OnInit, AfterViewInit {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	displayedColumns: any[] = ['select', 'no', 'name', 'class', 'section', 'action'];
	PROMOTE_ELEMENT_DATA: Element[] = [];
	DEMOTE_ELEMENT_DATA: Element[] = [];
	promotedataSource = new MatTableDataSource<Element>(this.PROMOTE_ELEMENT_DATA);
	demotedataSource = new MatTableDataSource<Element>(this.DEMOTE_ELEMENT_DATA);
	enrollMentTypeArray: any[] = [{
		au_process_type: '3', au_process_name: 'Provisional Admission'
	},
	{
		au_process_type: '4', au_process_name: 'Admission'
	}];
	classArray: any[] = [];
	sectionArray: any[] = [];
	promotionSectionArray: any[] = [];
	demotionSectionArray: any[] = [];
	promoteForm: FormGroup;
	demoteForm: FormGroup;
	sessionArray: any[] = [];
	currentSessionStudentCount: any;
	nextSessionStudentCount: any;
	currentDate = new Date();
	sessionPromote: any;
	sessionDemote: any;
	promoteSessionId: any;
	demoteSessionId: any;
	promoteStudentListArray: any[] = [];
	demoteStudentListArray: any[] = [];
	promoteFlag = false;
	toBePromotedList: any[] = [];
	toBeDemotedList: any[] = [];
	promotionListAllFlag = false;
	demotionListAllFlag = false;
	demoteFlag = false;
	session; any = {};
	prev: any;
	next: any;
	orderByArray: any[] = [{ order_by: 'sec_id', order_by_name: 'Section' }];
	@ViewChild('sortP') sortP: MatSort;
	@ViewChild('sortD') sortD: MatSort;


	constructor(private commonApiService: CommonAPIService,
		private sisService: SisService,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.session = JSON.parse(localStorage.getItem('session'));
		this.buildForm();
		this.getClass();
		this.getSession();
		// this.sessionPromote = this.currentDate.getFullYear() - 1 + '-' + (this.currentDate.getFullYear().toString()).substring(2, 4);
		// this.sessionDemote = this.currentDate.getFullYear() + '-' + ((this.currentDate.getFullYear() + 1).toString()).substring(2, 4);
		this.promoteFlag = false;
		this.demoteFlag = false;
	}
	ngAfterViewInit() {
		this.promotedataSource.sort = this.sortP;
		this.demotedataSource.sort = this.sortD;
	}
	buildForm() {
		this.promoteForm = this.fbuild.group({
			class_id: '',
			new_class_id: '',
			ses_id: '',
			sec_id: '',
			enrollment_type: '',
			order_by: ''
		});
		this.demoteForm = this.fbuild.group({
			class_id: '',
			ses_id: '',
			sec_id: '',
			enrollment_type: '',
		});
	}

	applyFilterPromote(filterValue: string) {
		this.promotedataSource.filter = filterValue.trim().toLowerCase();
	}
	applyFilterDemote(filterValue: string) {
		this.demotedataSource.filter = filterValue.trim().toLowerCase();
	}
	getClass() {
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
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
	getSectionByClassForDemotion(class_id) {
		this.demotionSectionArray = [];
		this.sisService.getSectionsByClass({ class_id: class_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.demotionSectionArray = result.data;
			}
		});
	}
	getSession() {
		this.sisService.getSession().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sessionArray = result.data;
				for (const item of this.sessionArray) {
					// if (item.ses_name ===  (this.currentDate.getFullYear() - 1 + '-' + this.currentDate.getFullYear())) {
					//   this.promoteSessionId = item.ses_id;
					//
					//
					const findex = this.sessionArray.findIndex(f => f.ses_id === this.session.ses_id);
					if (findex !== -1) {
						this.promoteSessionId = this.session.ses_id;
						this.sessionPromote = this.sessionArray[findex].ses_name;
						this.getCountCurrentYearStudents();
						this.prev = Number(this.sessionPromote.split('-')[0]) + 1;
						this.next = Number(this.sessionPromote.split('-')[1]) + 1;
					} if (item.ses_name === this.prev + '-' + this.next) {
						this.demoteSessionId = item.ses_id;
						this.sessionDemote = item.ses_name;
						this.getCountNextYearStudents();
					}
				}
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
	getCountNextYearStudents() {
		this.sisService.getCountStudents({
			ses_id: this.demoteSessionId
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.nextSessionStudentCount = result.data;
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
			this.sisService.getStudentsPromotionTool({
				class_id: this.promoteForm.value.class_id,
				ses_id: this.promoteSessionId,
				sec_id: this.promoteForm.value.sec_id,
				enrollment_type: this.promoteForm.value.enrollment_type,
				order_by: this.promoteForm.value.order_by,
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
				} else {
					this.PROMOTE_ELEMENT_DATA = [];
					this.promotedataSource = new MatTableDataSource<Element>(this.PROMOTE_ELEMENT_DATA);
					this.commonApiService.showSuccessErrorMessage('No Records Found', 'error');
					this.promoteFlag = false;
				}
			});
		}
	}
	getDemotionList() {
		console.log(this.promoteForm.value.enrollment_type === '4');
		this.toBeDemotedList = [];
		this.demoteStudentListArray = [];
		this.DEMOTE_ELEMENT_DATA = [];
		this.demotedataSource = new MatTableDataSource<Element>(this.DEMOTE_ELEMENT_DATA);
		if (!this.demoteForm.value.enrollment_type) {
			this.commonApiService.showSuccessErrorMessage('Enroll type needed', 'error');
		} else if (!this.demoteForm.value.class_id) {
			this.commonApiService.showSuccessErrorMessage('Current Class needed', 'error');
		} else {
			this.sisService.getStudentsPromotionTool({
				class_id: this.demoteForm.value.class_id,
				ses_id: this.demoteSessionId,
				sec_id: '',
				enrollment_type: this.demoteForm.value.enrollment_type,
			}).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.demoteStudentListArray = result.data;
					let counter = 1;
					for (const item of this.demoteStudentListArray) {
						this.DEMOTE_ELEMENT_DATA.push({
							select: counter,
							no: item.au_login_id,
							name: item.au_full_name,
							class: item.class_name,
							section: item.sec_id !== '0' ? item.sec_name : '-',
							em_admission_no: this.promoteForm.value.enrollment_type === '4'
							|| this.demoteForm.value.enrollment_type === '4' ? item.em_admission_no : item.em_provisional_admission_no,
							action: item
						});
						counter++;
					}
					this.demotedataSource = new MatTableDataSource<Element>(this.DEMOTE_ELEMENT_DATA);
					this.demotedataSource.sort = this.sortD;
					this.demoteFlag = true;
				} else {
					this.DEMOTE_ELEMENT_DATA = [];
					this.demotedataSource = new MatTableDataSource<Element>(this.DEMOTE_ELEMENT_DATA);
					this.commonApiService.showSuccessErrorMessage('No Records Found', 'error');
					this.demoteFlag = false;
				}
			});
		}
	}
	isSelectedP(login_id) {
		return this.toBePromotedList.findIndex(f => f.em_admission_no === login_id) !== -1 ? true : false;
	}
	isDisabledP(login_id) {
		return this.promoteStudentListArray.findIndex(f => f.au_login_id === login_id && f.pmap_status === '0') !== -1 ? true : false;
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
	isSelectedD(login_id) {
		return this.toBeDemotedList.findIndex(f => f.em_admission_no === login_id) !== -1 ? true : false;
	}
	insertIntoToBeDemotedList($event, item) {
		if ($event.checked === true) {
			this.toBeDemotedList.push({
				em_admission_no: $event.source.value,
				item: item
			});
		} else {
			const findex = this.toBeDemotedList.findIndex(f => f.em_admission_no === $event.source.value);
			this.toBeDemotedList.splice(findex, 1);
		}
	}
	promoteStudent(item) {
		if (!this.promoteForm.value.new_class_id) {
			this.commonApiService.showSuccessErrorMessage('New Class Required', 'error');
		} else {
			this.demoteForm.patchValue({
				'enrollment_type': this.promoteForm.value.enrollment_type,
				'class_id': this.promoteForm.value.new_class_id,
				'sec_id': this.promoteForm.value.sec_id
			});
			this.sisService.promoteStudents({
				students: [{
					pmap_login_id: item.action.au_login_id,
					pmap_class_id: this.promoteForm.value.new_class_id,
					pmap_sec_id: item.action.sec_id,
					pmap_hou_id: item.action.hou_id,
					pmap_ses_id: this.demoteSessionId,
					pmap_enrollment_type: this.promoteForm.value.enrollment_type
				}]
			}).subscribe((result: any) => {
				if (result.status === 'ok') {
					// tslint:disable-next-line:max-line-length
					this.commonApiService.showSuccessErrorMessage('Student of admission number ' + item.action.au_login_id + ' has been promoted', 'success');
					this.getPromotionList();
					this.getDemotionList();
					this.getCountCurrentYearStudents();
					this.getCountNextYearStudents();
				}
			});
		}
	}
	demoteStudent(item) {
		if (!this.demoteForm.value.class_id) {
			this.commonApiService.showSuccessErrorMessage('Promoted Class Required', 'error');
		}
		this.sisService.demoteStudents({
			students: [{
				pmap_login_id: item.action.au_login_id,
				pmap_id: item.action.pmap_id,
				pmap_enrollment_type: this.demoteForm.value.enrollment_type,
				pmap_ses_id: this.demoteSessionId,
			}]
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				// tslint:disable-next-line:max-line-length
				this.commonApiService.showSuccessErrorMessage('Student of admission number ' + item.action.au_login_id + ' has been demoted', 'success');
				this.getPromotionList();
				this.getDemotionList();
				this.getCountCurrentYearStudents();
				this.getCountNextYearStudents();
			}
		});
	}
	checkAllPromotionList($event) {
		this.toBePromotedList = [];
		if ($event.checked === true) {
			this.promotionListAllFlag = true;
			for (const item of this.PROMOTE_ELEMENT_DATA) {
				if (item.action.pmap_status === '1') {
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
	checkAllDemotionList($event) {
		this.toBeDemotedList = [];
		if ($event.checked === true) {
			this.demotionListAllFlag = true;
			for (const item of this.DEMOTE_ELEMENT_DATA) {
				this.toBeDemotedList.push({
					em_admission_no: item.no,
					item: item.action
				});
			}
		} else {
			this.demotionListAllFlag = false;
		}
	}
	promoteStudentInBulk() {
		if (!this.promoteForm.value.new_class_id) {
			this.commonApiService.showSuccessErrorMessage('New Class Required', 'error');
		} else {
			this.demoteForm.patchValue({
				'enrollment_type': this.promoteForm.value.enrollment_type,
				'class_id': this.promoteForm.value.new_class_id,
				'sec_id': this.promoteForm.value.sec_id
			});
			const promoteBulkArray: any[] = [];
			for (const titem of this.toBePromotedList) {
				promoteBulkArray.push({
					pmap_login_id: titem.item.au_login_id,
					pmap_class_id: this.promoteForm.value.new_class_id,
					pmap_sec_id: titem.item.sec_id,
					pmap_hou_id: titem.item.hou_id,
					pmap_ses_id: this.demoteSessionId,
					pmap_enrollment_type: this.promoteForm.value.enrollment_type
				});
			}
			if (promoteBulkArray.length > 0) {
				this.sisService.promoteStudents({
					students: promoteBulkArray
				}).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonApiService.showSuccessErrorMessage('Promoted Successfully', 'success');
						this.demoteStudentListArray = [];
						this.DEMOTE_ELEMENT_DATA = [];
						this.promoteStudentListArray = [];
						this.PROMOTE_ELEMENT_DATA = [];
						this.toBePromotedList = [];
						this.getPromotionList();
						this.getDemotionList();
						this.getCountCurrentYearStudents();
						this.getCountNextYearStudents();
					}
				});
			}
		}
	}
	demoteStudentInBulk() {
		if (!this.demoteForm.value.class_id) {
			this.commonApiService.showSuccessErrorMessage('Promoted Class Required', 'error');
		} else {
			const demoteBulkArray: any[] = [];
			for (const titem of this.toBeDemotedList) {
				demoteBulkArray.push({
					pmap_login_id: titem.item.au_login_id,
					pmap_id: titem.item.pmap_id,
					pmap_enrollment_type: this.demoteForm.value.enrollment_type,
					pmap_ses_id: this.demoteSessionId
				});
			}
			if (demoteBulkArray.length > 0) {
				this.sisService.demoteStudents({
					students: demoteBulkArray
				}).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonApiService.showSuccessErrorMessage('Demoted Successfully', 'success');
						this.demoteStudentListArray = [];
						this.DEMOTE_ELEMENT_DATA = [];
						this.promoteStudentListArray = [];
						this.PROMOTE_ELEMENT_DATA = [];
						this.toBeDemotedList = [];
						this.getPromotionList();
						this.getDemotionList();
						this.getCountCurrentYearStudents();
						this.getCountNextYearStudents();
					}
				});
			}
		}
	}
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched);
// 	}
// }
