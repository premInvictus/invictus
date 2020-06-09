import { Component, OnInit, ViewChild, Input, OnChanges  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import {SelectionModel} from '@angular/cdk/collections';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { IndianCurrency } from '../../../_pipes';
import * as moment from 'moment';

@Component({
  selector: 'app-total-fee-receivable',
  templateUrl: './total-fee-receivable.component.html',
  styleUrls: ['./total-fee-receivable.component.scss']
})
export class TotalFeeReceivableComponent implements OnInit {

  @Input() param: any;
  tableDivFlag = false;
  ELEMENT_DATA: any[] = [];
  displayedColumns: string[] = [];
  displayedDate: any[] = [];
  session: any;
  responseData: any;
  constructor(
    private fbuild: FormBuilder,
		  private sisService: SisService,
		  private commonAPIService: CommonAPIService,
		  private faService:FaService,
		  private dialog: MatDialog,            
		  private router: Router,
			private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.session = JSON.parse(localStorage.getItem('session'));
    //this.getInvoiceDayBook();
  }
  ngOnChanges() {
    console.log(this.param);
    this.session = JSON.parse(localStorage.getItem('session'));
    this.getInvoiceDayBook();
    
  }
  getInvoiceDayBook(){
    this.ELEMENT_DATA = [];
    this.faService.getInvoiceDayBook({sessionId: this.session.ses_id,monthId: this.param.month}).subscribe((data:any)=>{
      if(data) {

        this.responseData = data;
        const tempreceipt_data: any = data.receipt_data;
        const tempinvoice_due_data: any = data.invoice_due_data;
        

        const dateArray: any[] = [];
        tempinvoice_due_data.forEach(e => {
          const index = dateArray.findIndex(t => t == e.date);
          if(index == -1) {
            dateArray.push(e.date);
          }
        });
        
        if(tempinvoice_due_data.length > 0) {
          dateArray.forEach(e => {
            const tempelement: any = {};
            tempelement['date'] = e;
            let temptotal = 0;
            tempinvoice_due_data.forEach(element => {
              if(element.date == e){
                element.value.forEach(element1 => {
                  temptotal += Number(element1.head_amt);
                });
              }
            });
            tempelement['income_due'] = temptotal;
            temptotal = 0;
            tempinvoice_due_data.forEach(element => {
              if(element.date == e){
                element.value.forEach(element1 => {
                  temptotal += (Number(element1.concession_at) + Number(element1.adjustment_amt));
                });
              }
            });
            tempelement['con_adj'] = temptotal;
            temptotal = 0;
            tempreceipt_data.forEach(element => {
              if(element.date == e){
                element.value.forEach(element1 => {
                  temptotal += Number(element1.receipt_amt);
                });
              }
            });
            tempelement['receipt_amt'] = temptotal;
            tempelement['balance_amt'] = tempelement['income_due'] - tempelement['con_adj'] - tempelement['receipt_amt'];
            this.ELEMENT_DATA.push(tempelement);
          });
          this.tableDivFlag = true;
        }
        console.log(this.ELEMENT_DATA);

      }
    });
  }
  getTotal(id) {
    if(this.ELEMENT_DATA.length > 0){
      return this.ELEMENT_DATA.reduce((a,b) => a + Number(b[id]),0);
    } else {
      return 0;
    }
  }

}
