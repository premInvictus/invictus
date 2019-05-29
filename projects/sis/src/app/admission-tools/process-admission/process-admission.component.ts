import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService, ProcesstypeService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
export interface PeriodicElement {
	select: any;
	regd_no: number;
	name: string;
	class: string;
	contact: string;
	dates: string;
	score: number;
	status: string;
	admit: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
	{
		select: 0,
		regd_no: 1,
		name: 'Rajesh',
		class: 'III',
		contact: '8452154121',
		dates: '14-01-2008',
		score: 25,
		status: 'approved',
		admit: 1
	}
];

@Component({
	selector: 'app-process-admission',
	templateUrl: './process-admission.component.html',
	styleUrls: ['./process-admission.component.scss']
})
export class ProcessAdmissionComponent implements OnInit, AfterViewInit {

	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private processType: ProcesstypeService,
		private router: Router,
		private route: ActivatedRoute) { }
	@ViewChild('deleteModal') deleteModal;
	displayedColumns: string[] = [
		'regd_no',
		'name',
		'class',
		'contact',
		'dates',
		'score',
		'status',
		'admit'
	];
	processAdmissionData: any[] = [];
	PROCESS_ELEMENT_DATA: any[] = [];
	selectedUserArr: any[] = [];
	allUserSelectFlag = false;
	migrationMessage = 'Are you sure, you want to Approve this Student for Admission ?';
	userDataSource = new MatTableDataSource<Element>(this.PROCESS_ELEMENT_DATA);
	@ViewChild(MatSort) sort: MatSort;
	openDeleteDialog = (data) => {
		if (data.score.documentStatus === 0) {
			this.migrationMessage = 'This requisite documents for the child are not available. <br>Do you wish to grant Provisional Admission ?';
		} else if (data.score.documentStatus === 1) {
			this.migrationMessage = 'Are you sure, you want to Approve this Student for Admission ?';
		}
		this.deleteModal.openModal(data);
	}

	ngOnInit() {
		this.userDataSource.sort = this.sort;
		this.getProcessAdmissionData();
	}

	ngAfterViewInit() {
		this.userDataSource.sort = this.sort;
	}


	getProcessAdmissionData() {
		this.processAdmissionData = [];
		this.PROCESS_ELEMENT_DATA = [];
		this.userDataSource = new MatTableDataSource(this.PROCESS_ELEMENT_DATA);
		this.sisService.getProcessAdmission({ 'enrollment_type': '2' }).subscribe((result: any) => {

			if (result && result.status === 'ok') {
				this.processAdmissionData = result.data;
				this.prepareDataSource();
			} else {
				this.PROCESS_ELEMENT_DATA = [];
				this.userDataSource = new MatTableDataSource(this.PROCESS_ELEMENT_DATA);
			}
		}, (error) => {
			this.PROCESS_ELEMENT_DATA = [];
			this.userDataSource = new MatTableDataSource(this.PROCESS_ELEMENT_DATA);
		});
	}

	prepareDataSource() {
		this.userDataSource = new MatTableDataSource<Element>(this.PROCESS_ELEMENT_DATA);
		let counter = 1;
		for (let i = 0; i < this.processAdmissionData.length; i++) {
			const tempObj = {};
			tempObj['au_login_id'] = this.processAdmissionData[i]['au_login_id'];
			tempObj['name'] = this.processAdmissionData[i]['au_full_name'];
			tempObj['class'] = this.processAdmissionData[i]['class_name'];
			tempObj['section'] = this.processAdmissionData[i]['sec_name'];
			tempObj['contact'] = this.processAdmissionData[i]['au_mobile'];
			tempObj['status'] = this.processAdmissionData[i]['status'] === '1' ? 'Approved' : this.processAdmissionData[i]['status'] === '0'
				? 'Pending' : 'Declined';
			tempObj['dates'] = this.processAdmissionData[i]['dates'];
			tempObj['score'] = this.processAdmissionData[i]['score'];
			tempObj['regd_no'] = this.processAdmissionData[i]['regd_no'];
			this.PROCESS_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.userDataSource = new MatTableDataSource(this.PROCESS_ELEMENT_DATA);
		this.userDataSource.sort = this.sort;
	}

	checkAllUserList($event) {
		this.selectedUserArr = [];
		if ($event.checked === true) {
			this.allUserSelectFlag = true;
			for (const item of this.PROCESS_ELEMENT_DATA) {
				this.selectedUserArr.push({
					login_id: item.au_login_id
				});
			}
		} else {
			this.allUserSelectFlag = false;
		}
	}

	prepareSelectedRowData($event, item) {
		const findex = this.selectedUserArr.findIndex(f => f.login_id === item);
		if (findex === -1) {
			this.selectedUserArr.push({ login_id: item });
		} else {
			this.selectedUserArr.splice(findex, 1);
		}
	}


	applyFilterUser(filterValue: string) {
		this.userDataSource.filter = filterValue.trim().toLowerCase();
	}


	moveToAdmission(event) {
		const inputJson = {
			'login_id': event.au_login_id,
			'process_type_from': '2',
			'doc_verify_status': event.score.documentStatus
		};
		if (event.score.documentStatus) {
			this.processType.setProcesstype('4');
		} else {
			this.processType.setProcesstype('3');
		}
		this.sisService.migrgateProcessAdmission(inputJson).subscribe((result: any) => {
			if (result.status === 'ok' && result.data) {
				this.notif.showSuccessErrorMessage(result.message, 'success');
				const invoiceJSOn = {
					processFrom: '2',
					processTo: event.score.documentStatus ? '4' : '3',
					login_id: [result.data.toString()]
				};
				this.sisService.insertInvoice(invoiceJSOn).subscribe((result2: any) => {
					if (result2.data && result2.status === 'ok') {
						const length = result2.data.split('/').length;
						saveAs(result2.data, result2.data.split('/')[length - 1]);
						this.getProcessAdmissionData();
					}
				});
			} else {
				this.notif.showSuccessErrorMessage('Error While Admitting Student', 'error');
			}
		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.notif.isExistUserAccessMenu(mod_id);
	}
	deleteCancel() { }
}
