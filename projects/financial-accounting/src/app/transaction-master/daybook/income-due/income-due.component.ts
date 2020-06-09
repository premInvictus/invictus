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
  selector: 'app-income-due',
  templateUrl: './income-due.component.html',
  styleUrls: ['./income-due.component.scss']
})
export class IncomeDueComponent implements OnInit, OnChanges  {

  @Input() param: any;
  tableDivFlag = false;
  ELEMENT_DATA: any[] = [];
  displayedColumns: any[] = [];
  displayedDate: any[] = [];
  session: any;
  con_adj_details:any;
  eachheadtotal_details:any;
  headtoatl = 0;
  contoatl = 0;

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
    if(this.param.month) {
      this.getInvoiceDayBook();
    } 
  }
  ngOnChanges() {
    console.log(this.param);
    if(this.param.month) {
      this.getInvoiceDayBook();
    }   
    
  }
  getInvoiceDayBook(){
    this.headtoatl = 0;
    this.contoatl = 0;
    this.displayedColumns = [];
    this.ELEMENT_DATA = [];
    this.faService.getInvoiceDayBook({sessionId: this.session.ses_id,monthId: Number(this.param.month)}).subscribe((data:any)=>{
      if(data && data.invoice_due_data.length > 0) {
        const tempData: any = data.invoice_due_data;
        const tempHeader: any[] = [];
        tempData[0].value.forEach(element => {
          this.displayedColumns.push({
            id: element.fh_id,
            name: element.fh_name
          });
        });       

        this.con_adj_details = {};
        this.eachheadtotal_details = {};
        this.displayedColumns.forEach(ee => {
          this.con_adj_details['id_'+ee.id] = 0;
          this.eachheadtotal_details['id_'+ee.id] = 0;
        });
        const dateArray: any[] = [];
        tempData.forEach(e => {
          const index = dateArray.findIndex(t => t == e.date);
          if(index == -1) {
            dateArray.push(e.date);
          }
        })
        if(tempData.length > 0) {
          dateArray.forEach(e => {
            const tempelement: any = {};
            tempelement['date'] = e;
            let tempvalue = tempData.find(element => element.date == e);
            if(tempvalue) {
              this.displayedColumns.forEach(ee => {
                tempvalue.value.forEach(element => {
                  if(element.fh_id == ee.id){
                    let tempvaluehead = element.head_amt ? Number(element.head_amt) : 0;
                    let tempvaluecon = Number(element.concession_at) + Number(element.adjustment_amt);
                    this.headtoatl += tempvaluehead;
                    this.contoatl += tempvaluecon;
                    tempelement['id_'+ee.id] = tempvaluehead;
                    this.con_adj_details['id_'+ee.id] += tempvaluecon;
                    this.eachheadtotal_details['id_'+ee.id] += tempvaluehead;
                  }
                });
                              
              });
            }
            this.ELEMENT_DATA.push(tempelement);
          });
          this.tableDivFlag = true;
        }
        console.log(this.ELEMENT_DATA);
        console.log(this.eachheadtotal_details);
        console.log(this.con_adj_details);

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
