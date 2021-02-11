import { Component, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeFeeService, FeeService } from '../../_services';
import { StudentRouteMoveStoreService } from '../../feemaster/student-route-move-store.service';
import { CommonStudentProfileComponent } from '../../feemaster/common-student-profile/common-student-profile.component';
import { StudentAccountComponent } from '../../feemaster/student-account/student-account.component';
import { IndianCurrency } from '../../_pipes';

@Component({
	selector: 'app-missing-invoice',
	templateUrl: './missing-invoice.component.html',
	styleUrls: ['./missing-invoice.component.css']
})
export class MissingInvoiceComponent implements OnInit {
	lastRecordId;
	checkallstatus = false;
	loginId: any;
	permissionFlag: any;
	checkFlag1 = true;
	checkFlag2 = true;
	viewOnly = true;
	process_type = '';
	datasource: any = [];
	resultdataArray = [];
	studentDetails: any;
	@ViewChild(StudentAccountComponent) stuAcc: StudentAccountComponent;
	@ViewChild(CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
	feeRenderId: any;
	constructor(
		private sisService: SisService,
		private commmon: CommonAPIService,
		public processtypeService: ProcesstypeFeeService,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService,
		public feeService: FeeService
	) { }

	ngOnInit() {
		this.checkEmit(1);
		this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
			if (data.adm_no && data.login_id) {
				this.lastRecordId = data.adm_no;
				this.loginId = data.login_id;
			} else {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						this.studentDetails = this.commonStu;
						this.lastRecordId = result.data[0].last_record;
						this.loginId = result.data[0].au_login_id;
						this.getDataofMissingInvoice();
					}
				});
			}
			this.getDataofMissingInvoice();
		});
	}
	checkEmit(process_type) {
		console.log('processType--', process_type);
		this.process_type = process_type;
		if (process_type) {
			this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
				console.log('result--', result);
				if (result.status === 'ok') {
					if (result.data[0].last_record && result.data[0].au_login_id) {
						this.studentDetails = this.commonStu;
						this.lastRecordId = result.data[0].last_record;
						this.loginId = result.data[0].au_login_id;
					} else {
						this.studentDetails = this.commonStu;
						this.lastRecordId = 0;
						this.loginId = 0;
					}
					// console.log("i m here",this.studentDetails, this.lastRecordId,this.loginId  );

					// this.getDataofMissingInvoice();
				}
			});
		}
	}
	next(admno) {
		this.loginId = admno;
		this.getDataofMissingInvoice();
	}
	prev(admno) {
		this.loginId = admno;
		this.getDataofMissingInvoice();
	}
	first(admno) {
		this.loginId = admno;
		this.getDataofMissingInvoice();
	}
	last(admno) {
		this.loginId = admno;
		this.getDataofMissingInvoice();
	}
	key(admno) {
		this.loginId = admno;
		this.getDataofMissingInvoice();
	}

	getDataofMissingInvoice() {
		// console.log("i am this",this.process_type, this.loginId, this.commonStu, this.stuAcc, this.studentDetails);
		this.datasource = [];
		this.feeService.getMissingInvoiceDetails({ au_login_id: this.loginId, process_type: this.process_type }).subscribe(
			(res: any) => {
				if (res) {
					this.datasource = res
				}
				else {
					this.commmon.showSuccessErrorMessage('No Data Fetchecd', 'error');
				}
			}
		)
	}
	getInteger(a, b, c) {
		return new IndianCurrency().transform(parseInt(a) + parseInt(b) + parseInt(c));
	}
	getValue(b) {
		return JSON.parse(b)[0];
	}

	getItem(item) {
		// function containsObject(obj, list) {
		// 	var i;
		// 	for (i = 0; i < list.length; i++) {
		// 		if (list[i] === obj) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// }
		if (this.resultdataArray.length == 0) {
			this.resultdataArray.push(item);
			this.checkallstatus = false;
		} else {
			console.log("i am here", this.resultdataArray.filter(e => e == item));

			if (this.resultdataArray.filter(e => e == item).length > 0) {
				this.resultdataArray = this.resultdataArray.filter(e => e != item);
				this.checkallstatus = false;
				//   this.checkResult(item);
			}
			else {
				this.resultdataArray.push(item);
				if (this.datasource.length == this.resultdataArray.length) {
					this.checkallstatus = true;
				}
				//   this.checkResult(item);
			}
		}
		console.log("i am result array", this.resultdataArray);

	}

	getColor(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}

	getBorder(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}

	getallItem() {
		if (this.resultdataArray.length < this.datasource.length) {
			this.resultdataArray = this.datasource;
			this.checkallstatus = true;
		} else {
			this.resultdataArray = [];
			this.checkallstatus = false;
		}
		console.log('I am res', this.resultdataArray);

	}
	checkResult(item) {
		if (this.resultdataArray.filter(e => e == item).length > 0) {
			return true;
		}
		return false;
	}
	addInvoiceToledger() {
		console.log("i am invoice ledger", this.resultdataArray);
		if (this.resultdataArray.length > 0)
			this.feeService.addledgertomissinginvoice({ data: this.resultdataArray }).subscribe((res: any) => {
				this.feeService.getMissingInvoiceDetails({ au_login_id: this.loginId, process_type: this.process_type }).subscribe(
					(res: any) => {
						if (res) {
							this.datasource = res
						}
						else {
							this.commmon.showSuccessErrorMessage('No Data Fetchecd', 'error');
						}
					}
				)

			})
		else {
			this.commmon.showSuccessErrorMessage('Please Select any Invoice', 'info');
		}

	}

}
