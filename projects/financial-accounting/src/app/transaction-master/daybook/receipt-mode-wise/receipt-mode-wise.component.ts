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
  selector: 'app-receipt-mode-wise',
  templateUrl: './receipt-mode-wise.component.html',
  styleUrls: ['./receipt-mode-wise.component.scss']
})
export class ReceiptModeWiseComponent implements OnInit {

  @Input() param: any;
  tableDivFlag = false;
  ELEMENT_DATA: any[] = [];
  displayedColumns: any[] = [];
  displayedDate: any[] = [];
  session: any;
  headtoatl = 0;
  eachheadtotal_details:any;
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
    this.session = JSON.parse(localStorage.getItem('session'));
    console.log(this.param);
    this.getInvoiceDayBook();
    
  }
  getInvoiceDayBook(){
    this.headtoatl = 0;
    this.displayedColumns = [];
    this.ELEMENT_DATA = [];
    this.faService.getInvoiceDayBook({sessionId: this.session.ses_id,monthId: Number(this.param.month)}).subscribe((data:any)=>{
      if(data) {

        const tempData: any = data.receipt_data;
        
        
        const tempHeader: any[] = [];

        tempData.forEach(e => {
          e.value.forEach(element => {
            element.temp_id = element.pay_name ? element.pay_name.toString().toLowerCase().replace(/ /g,'') : '';
          }); 
        });
        console.log(tempData);
        tempData[0].value.forEach(element => {
          this.displayedColumns.push({
            id: element.temp_id,
            name: element.pay_name
          });
        }); 
        const dateArray: any[] = [];
        tempData.forEach(e => {
          const index = dateArray.findIndex(t => t == e.date);
          if(index == -1) {
            dateArray.push(e.date);
          }
        });
        this.eachheadtotal_details = {};
        this.displayedColumns.forEach(ee => {
          this.eachheadtotal_details['id_'+ee.id] = 0;
        });
        if(tempData.length > 0) {
          dateArray.forEach(e => {
            const tempelement: any = {};
            tempelement['date'] = e;
            let tempvalue = tempData.find(element => element.date == e);
            if(tempvalue) {
              this.displayedColumns.forEach(ee => {
                tempvalue.value.forEach(element => {
                  if(element.temp_id == ee.id){
                    let tempvaluehead = element.receipt_amt ? Number(element.receipt_amt) : 0;
                    this.headtoatl += tempvaluehead;
                    tempelement['id_'+ee.id] = tempvaluehead;
                    this.eachheadtotal_details['id_'+ee.id] += tempvaluehead;
                  }
                });
                              
              });
            }
            this.ELEMENT_DATA.push(tempelement);
          });
          this.tableDivFlag = true;
        }
        // if(tempData.length > 0) {
        //   dateArray.forEach(e => {
        //     const tempelement: any = {};
        //     tempelement['date'] = e;
        //     tempHeader.forEach(ee => {
        //       let tempvalue = tempData.find(element => element.ftr_pay_id == ee.id && element.ftr_transaction_date == e);
        //       if(tempvalue) {
        //         tempelement['id_'+ee.id] = Number(tempvalue.receipt_amt);
        //         this.headtoatl += Number(tempvalue.receipt_amt);
        //       } else {
        //         tempelement['id_'+ee.id] = '';
        //       }              
        //     });
        //     this.ELEMENT_DATA.push(tempelement);
        //   });
        //   this.tableDivFlag = true;
        // }
        console.log(this.ELEMENT_DATA);

      }
    });
  }
  getColumnTotal(item){
    let total = 0;
    Object.keys(item).forEach(key => {
      if(key != 'date'){
        let v = item[key] || 0;
        total += v;
      }
    });
    return total;
  }
  getTotal(id) {
    if(this.ELEMENT_DATA.length > 0){
      return this.ELEMENT_DATA.reduce((a,b) => a + Number(b['id_'+id]),0);
    } else {
      return 0;
    }
  }

}
