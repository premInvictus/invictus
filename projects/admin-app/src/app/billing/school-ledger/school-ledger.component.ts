import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin-user-type/admin/services/admin.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AcsetupService } from '../../acsetup/service/acsetup.service';
import { NotificationService } from 'projects/axiom/src/app/_services/notification.service';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MatPaginator, MatTableDataSource, MatSort,MatDialog } from '@angular/material';
import {Router,ActivatedRoute} from '@angular/router';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';

@Component({
  selector: 'app-school-ledger',
  templateUrl: './school-ledger.component.html',
  styleUrls: ['./school-ledger.component.css']
})
export class SchoolLedgerComponent implements OnInit {
  school_id:any;
  schooldetails:any;
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
    }
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
  createInvoice(item, edit): void {
		const dialogRef = this.dialog.open(InvoiceModalComponent, {
			width: '80%',
			data: {
        title:'Create Invoice',
				item: item,
				edit: edit
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

}
