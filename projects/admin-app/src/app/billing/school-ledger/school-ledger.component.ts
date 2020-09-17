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

@Component({
  selector: 'app-school-ledger',
  templateUrl: './school-ledger.component.html',
  styleUrls: ['./school-ledger.component.css']
})
export class SchoolLedgerComponent implements OnInit {
  @ViewChild('deleteModalRef') deleteModalRef;
  school_id:any;
  schooldetails:any;
  schooldetailsArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator)
	paginator: MatPaginator;
	@ViewChild(MatSort)
	sort: MatSort;
	displayedColumns = [
		'position',
		'billing_invoiceid',
		'billing_date',
		'billing_duedate',
		'billing_month',
		'billing_amount',
		'action'
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
  editBilling(data){
	this.createInvoice(data,true,this.school_id);
  }
  deleteBilling (data){
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
  getBilling(){
    const param:any={};
    param.billing_school_id=this.school_id;
    param.status='1';
    this.acsetupService.getBilling(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schooldetailsArray = result.data;
				let ind = 1;
				for (const t of this.schooldetailsArray) {
					this.ELEMENT_DATA.push({
						position: ind,
						billing_invoiceid: t.billing_invoiceid,
						billing_date: t.billing_date,
						billing_duedate: t.billing_duedate,
						billing_month: t.billing_month_str,
						billing_amount: t.billing_amount,
						action: t,
					});
					ind++;
				}
				this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.dataSource.sort = this.sort;
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
		const dialogRef = this.dialog.open(InvoiceModalComponent, {
			width: '80%',
			data: {
        title:'Create Invoice',
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
	printBilling(value){
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

}
