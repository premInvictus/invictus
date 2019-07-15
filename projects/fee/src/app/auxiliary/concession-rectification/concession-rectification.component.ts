import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { FeeService, CommonAPIService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConcessionList } from './concession-list.model';

@Component({
	selector: 'app-concession-rectification',
	templateUrl: './concession-rectification.component.html',
	styleUrls: ['./concession-rectification.component.scss']
})
export class ConcessionRectificationComponent implements OnInit, AfterViewInit {

	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('concessionremarkmodal') concessionremarkmodal;
	displayedColumns: string[] =
		['srno', 'enrollment', 'name', 'concession', 'action'];
	ELEMENT_DATA: ConcessionList[] = [];
	dataSource = new MatTableDataSource<ConcessionList>(this.ELEMENT_DATA);
	crArray: any[] = [];
	constructor(
		public feeService: FeeService,
		public commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.getConcessionRectification();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	getConcessionRectification() {
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<ConcessionList>(this.ELEMENT_DATA);
		this.feeService.getConcessionRectification({pro_id: '3'}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.crArray = result.data;
				if (this.crArray.length > 0) {
					let sno = 0;
					this.crArray.forEach(element => {
						this.ELEMENT_DATA.push({
							srno: ++sno,
							enrollment: element.accd_login_id,
							name: element.au_full_name,
							concession: element.fcc_name,
							action: element
						});
					});
					this.dataSource = new MatTableDataSource<ConcessionList>(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
				}
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	openConcessionRemarkModal(data) {
		this.concessionremarkmodal.openModal(data);
	}
	approve(event) {
		console.log(event);
		const param: any = {};
		if (event.reason_id) {
			param.reason_id = event.reason_id;
		}
		if (event.reason_remark) {
			param.reason_remark = event.reason_remark;
		}
		if (event.callee_data.accd_id) {
			param.accd_id = event.callee_data.accd_id;
		}
		param.accd_fcg_status = 'approved';
		this.feeService.updateConcessionRectification(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getConcessionRectification();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

}
