import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { FeeService, CommonAPIService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe,TitleCasePipe } from '@angular/common';
import { ConcessionList } from './concession-list.model';
import { PreviewDocumentComponent } from './preview-document/preview-document.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { element } from 'protractor';

@Component({
	selector: 'app-concession-rectification',
	templateUrl: './concession-rectification.component.html',
	styleUrls: ['./concession-rectification.component.scss']
})
export class ConcessionRectificationComponent implements OnInit, AfterViewInit {
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('concessionremarkmodal') concessionremarkmodal;
	displayedColumns: string[] =
		['srno', 'enrollment', 'name', 'class_sec', 'remarks', 'concession', 'proposed_by', 'action'];
	ELEMENT_DATA: ConcessionList[] = [];
	dataSource = new MatTableDataSource<ConcessionList>(this.ELEMENT_DATA);
	crArray: any[] = [];
	review_array: any[] = [];
	array_login_id: any[] = [];
	classSectionName: any;
	constructor(
		private dialog: MatDialog,
		public feeService: FeeService,
		public commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.getConcessionRectification();
		this.getConcessionRectificationNew();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	getConcessionRectification() {
		// this.ELEMENT_DATA = [];
		// this.dataSource = new MatTableDataSource<ConcessionList>(this.ELEMENT_DATA);
		// const param: any = {};
		// param.pro_id = '3';
		// param.accd_fcg_status = 'approved';
		// param.accd_process_type = '4';
		// this.feeService.getConcessionRectification(param).subscribe((result: any) => {
		// 	if (result && result.status === 'ok') {
		// 		this.crArray = result.data.table_result;
		// 		this.review_array = result.data.review_result;
		// 		if (this.crArray.length > 0) {
		// 			let sno = 0;
		// 			this.crArray.forEach(element => {
		// 				if (element.sec_name !== null) {
		// 					this.classSectionName = element.class_name + ' - ' + element.sec_name;
		// 				} else {
		// 					this.classSectionName = element.class_name;
		// 				}
		// 				this.ELEMENT_DATA.push({
		// 					srno: ++sno,
		// 					enrollment: element.accd_login_id,
		// 					class_sec: this.classSectionName,
		// 					remarks: this.getRemarks(element.mod_rev_id),
		// 					admno: element.au_admission_no,
		// 					name: element.au_full_name,
		// 					concession: element.fcc_name,
		// 					proposed_by: this.getProposedBy(element.mod_rev_id),
		// 					action: element
		// 				});
		// 			});
		// 			this.dataSource = new MatTableDataSource<ConcessionList>(this.ELEMENT_DATA);
		// 			this.dataSource.paginator = this.paginator;
		// 		}
		// 	} else {
		// 		this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
		// 	}
		// });
	}

	getConcessionRectificationNew() {
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<ConcessionList>(this.ELEMENT_DATA);
		this.feeService.getConcessionRectificationNew().subscribe((result: any) => {
			if(result.status != "error" && result.data.length > 0) {
				let sno = 0;
				
				
				result.data.forEach(element => {
					// let created_name = this.getNameById(element.tucc_created_by);
					// console.log("i am created ----------", created_name);
					
					let classSecName = element.class_name + ' - ' + element.sec_name;
					this.ELEMENT_DATA.push({
						srno: ++sno,
						enrollment: element.accd_login_id,
						class_sec: classSecName,
						remarks: element.tucc_remarks,
						admno: element.au_admission_no,
						name: element.au_full_name,
						concession: element.fcg_name,
						proposed_by: element.tucc_created_by,
						action: element
					});

				});
				this.dataSource = new MatTableDataSource<ConcessionList>(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		})
	}

	getNameById(au_login_id) {
		let allow = false;
		if(this.array_login_id.length == 0) {
			allow = true
		} else {
			let status = this.array_login_id.filter(element => {
				if(element.au_login_id == au_login_id)
				return true
			})
			if(status.length == 0) {
				allow = true
			} else {
				return status[0].au_full_name
			}
		}
		if(allow)
		this.feeService.getNameById({au_login_id: au_login_id}).subscribe((res: any) => {
			if(res.data.length > 0) {
				console.log("i am here", res.data[0], res.data[0].au_full_name);
				this.array_login_id.push({
					au_login_id:au_login_id,
					au_full_name:  res.data[0].au_full_name
				})
				
				return res.data[0].au_full_name;
			} else {
				return ' - ';
			}
		})
	}

	openConcessionRemarkModal(data) {
		data['status'] = 'approved';
		this.concessionremarkmodal.openModal(data);
	}
	openConcessionRemarkRejectModal(data) {
		data['status'] = 'reject';
		this.concessionremarkmodal.openModal(data);
	}

	approve(event) {
		const param: any = {};
		if(event.callee_data.status == 'approved') {
			param.tucc_status = '1'
		} else {
			param.tucc_status = '2'
		}
		param.tucc_id = event.callee_data.tucc_id
		// if (event.reason_id) {
		// 	param.reason_id = event.reason_id;
		// }
		// if (event.reason_remark) {
		// 	param.reason_remark = event.reason_remark;
		// }
		// if (event.callee_data.accd_id) {
		// 	param.accd_id = event.callee_data.accd_id;
		// }
		// if (event.callee_data.status) {
		// 	param.accd_fcg_status = event.callee_data.status;
		// }
		// this.feeService.updateConcessionRectification(param).subscribe((result: any) => {
		// 	if (result && result.status === 'ok') {
		// 		this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
		// 		this.getConcessionRectification();
		// 	} else {
		// 		this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
		// 	}
		// });
		this.feeService.updateConcessionRectificationNew(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getConcessionRectificationNew();
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	getRemarks(mod_rev_id) {
		const findex = this.review_array.findIndex(f => f.mod_rev_id === mod_rev_id);
		if (findex !== -1) {
			return this.review_array[findex].mod_review_remark;
		}
	}
	getProposedBy(mod_rev_id) {
		const findex = this.review_array.findIndex(f => f.mod_rev_id === mod_rev_id);
		if (findex !== -1) {
			return this.review_array[findex].proposed_by;
		}
	}
	previewImage(imgArray, index) {
		const imgArrays: any[] = [];
		imgArrays.push({ 'file_url': imgArray });
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imgArrays,
				index: index
			},
			height: '100vh',
			width: '100vh'
		});
	}
}
