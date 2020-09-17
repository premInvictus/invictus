import { Component, OnInit ,ViewChild} from '@angular/core';
import { AdminService } from '../../admin-user-type/admin/services/admin.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AcsetupService } from '../../acsetup/service/acsetup.service';
import { NotificationService } from 'projects/axiom/src/app/_services/notification.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MatPaginator, MatTableDataSource, MatSort,MatDialog } from '@angular/material';
import {Router,ActivatedRoute} from '@angular/router';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';
import { Element } from './school.model';
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-school-ledger',
  templateUrl: './school-ledger.component.html',
  styleUrls: ['./school-ledger.component.css']
})
export class SchoolLedgerComponent implements OnInit {
  @ViewChild('deleteModalRef') deleteModalRef;
  selection = new SelectionModel<Element>(true, []);
  actionFlag: any = {
	deleteinvoice: false,
	edit: false,
	print: false,
	pay: false,
};
  school_id:any;
  schooldetails:any;
  schooldetailsArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator)
	paginator: MatPaginator;
	@ViewChild(MatSort)
	sort: MatSort;
	displayedColumns = [
		'select',
		'billing_invoiceid',
		'billing_ses',
		'billing_date',
		'billing_duedate',
		'billing_month',
		'billing_amount',
		'receipt_no',
		'receipt_date',
		'receipt_amount'
		//'action'
	];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  constructor(
    private adminService: AdminService,
		private acsetupService: AcsetupService,
		private fb: FormBuilder,
		private notif: NotificationService,
    private router: Router,
    private route:ActivatedRoute ,
    private dialog:MatDialog
  ) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams['school_id']) {
      this.school_id = this.route.snapshot.queryParams['school_id'];
      this.getSchoolDetails(this.school_id);
      this.getBilling();
    }
  }
  applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
  }
  editBilling(){
	let data:any=this.fetchSelection()[0];
	this.createInvoice(data,true,this.school_id);
  }
  deleteBilling (){
	let data:any=this.fetchSelection()[0];
    this.deleteModalRef.openDeleteModal(data);
  }
  deleteComOk(data){
    const param:any={};
    param.billing_id=data.billing_id;
    param.status = '5';
    this.acsetupService.changeBillingStatus(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
        this.notif.showSuccessErrorMessage(result.data, 'success');
      } else {
        this.notif.showSuccessErrorMessage(result.data, 'error');
      }
    });
  }
  viewDetaills(value){
    
  }
  isAllSelected() {
	const numSelected = this.selection.selected.length;
	const numRows = this.dataSource.data.length;
	return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => {
				/* if (row.selectionDisable === false) {
					this.selection.select(row);
				} */
				this.selection.select(row);
			});
	}							

	checkboxLabel(row?: Element): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}
	manipulateAction(row) {
		this.selection.toggle(row);
		let tempactionFlag: any
		tempactionFlag = {
			deleteinvoice: true,
			edit: true,
			print: true,
			pay: true,
		};		
		if (this.selection.selected.length > 0) {
			this.selection.selected.forEach(item => {
				tempactionFlag.deleteinvoice = tempactionFlag.deleteinvoice && item.eachActionFlag.deleteinvoice && this.selection.selected.length === 1;
				tempactionFlag.edit = tempactionFlag.edit && item.eachActionFlag.edit && this.selection.selected.length === 1;
				tempactionFlag.print = tempactionFlag.print && item.eachActionFlag.print && this.selection.selected.length === 1;
				tempactionFlag.pay = (tempactionFlag.pay && item.eachActionFlag.pay && this.selection.selected.length === 1);
				
				this.actionFlag = tempactionFlag;
			});
		} else {
			this.resetActionFlag();
		}
	}
	
	resetActionFlag() {
		this.actionFlag = {
			deleteinvoice: false,
			edit: false,
			print: false,
			pay: false,
		};
	}
  getBilling(){
	this.ELEMENT_DATA=[];
	this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    const param:any={};
    param.billing_school_id=this.school_id;
    param.status='1';
    this.acsetupService.getBilling(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schooldetailsArray = result.data;
				let ind = 1;
				for (const t of this.schooldetailsArray) {
					const tempactionFlag: any = {
						deleteinvoice: true,
						edit: true,
						print: true,
						pay: true,
					};
					this.ELEMENT_DATA.push({
						position: ind,
						billing_invoiceid: t.billing_invoiceid,
						billing_date: t.billing_date,
						billing_duedate: t.billing_duedate,
						billing_month: t.billing_month_str,
						billing_amount: t.billing_amount,
						action: t,
						eachActionFlag: tempactionFlag,
						receipt_no:'',
						receipt_date:'',
						receipt_amount:'',
						billing_ses:t.ses_name
					});
					ind++;
				}
				this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				// this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				// this.dataSource.sort = this.sort;
			} else {
				this.notif.showSuccessErrorMessage('No records found', 'error');
			}
    });
  }
  getSchoolDetails(school_id) {
		this.adminService.getSchools({school_id:school_id}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
        console.log(result);
        this.schooldetails = result.data[0];
			} else {
				this.notif.showSuccessErrorMessage('No records found', 'error');
			}
		});
  }
  createInvoice(item, edit,school_id): void {
	  let title = 'Create Invoice';
	  if(edit){
		  title = 'Update Invoice';
	  }
		const dialogRef = this.dialog.open(InvoiceModalComponent, {
			width: '80%',
			data: {
				title:title,
				item: item,
				edit: edit,
				school_id:school_id
				},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && result.status == 'ok') {
				this.getBilling();
			}
		});
	}
	printBilling(){
		let value:any=this.fetchSelection()[0];
		const param:any={};
		param.billing_id = value.billing_id;
		this.acsetupService.printBilling(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log('result', result.data);
				// this.familyDetailArr = result.data;
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
				window.open(result.data, '_blank');
			}
		});
	}
	fetchSelection() {
		const inv_id_arr = [];
		this.selection.selected.forEach(element => {
			if (element.action) {
				inv_id_arr.push(element.action);
			}
		});
		return inv_id_arr;
	}

}
