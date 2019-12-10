import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonAPIService, InventoryService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './record-master.model';
import {MatTableDataSource, MatPaginator, PageEvent} from '@angular/material';

@Component({
  selector: 'app-record-master',
  templateUrl: './record-master.component.html',
  styleUrls: ['./record-master.component.css']
})
export class RecordMasterComponent implements OnInit {

  paramform: FormGroup;
  tableDivFlag = false;
  tabledataFlag = false;
  itemArray: any = [];
  ELEMENT_DATA: any[] = [];
  pageLength: number;
	pageSize = 300;
  pageSizeOptions=[100, 300, 1000];
  displayedColumns: string[] = ['position', 'item_code', 'item_name', 'item_desc', 'item_location', 'item_current_stock'];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  spans = [];
  constructor(
    private fbuild: FormBuilder,
    private commonAPIService: CommonAPIService,
    private inventoryService: InventoryService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getItemRecordMaster();
  }
  buildForm(){
    this.paramform = this.fbuild.group({

    });
  }
  getRowSpan(col, index) {    
    //console.log('col '+col, 'index'+index);
    return this.spans[index] && this.spans[index][col];
  }
  cacheSpan(key, accessor) {
    //console.log(key, accessor);
    for (let i = 0; i < this.ELEMENT_DATA.length;) {
      let currentValue = accessor(this.ELEMENT_DATA[i]);
      let count = 1;
      //console.log('currentValue',currentValue);
      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.ELEMENT_DATA.length; j++) {
        if (currentValue != accessor(this.ELEMENT_DATA[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
    //console.log('spans', this.spans);
  }
  getItemRecordMaster(){
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.inventoryService.getItemRecordMaster({}).subscribe((result: any) => {
      if(result && result.status === 'ok'){
        this.itemArray = result.data;
        //console.log(this.itemArray); 

        /*this.itemArray.forEach((element, index) => {
          const location = element.item_location.map(e => e.location_name ? e.location_name : '');
          const stock = element.item_location.map(e => e.item_stocks ? e.item_stocks : 0);
          this.ELEMENT_DATA.push({
            position: index + 1,
            item_code: element.item_code,
            item_name: element.item_name,
            item_desc: element.item_desc,
            item_location: location,
            item_current_stock: stock
          });
        });*/
        const DATA = this.itemArray.reduce((current, next, index) => {
          next.item_location.forEach(element => {
            current.push({
              position: index + 1,
              item_code: next.item_code,
              item_name: next.item_name,
              item_desc: next.item_desc,
              item_location: element.location_name,
              item_current_stock: element.item_stocks,
              item_units_name: next.item_units_name
            });
          });
          return current;
        },[]);
        console.log(DATA);
        this.ELEMENT_DATA = DATA;
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.pageLength = this.ELEMENT_DATA.length;
        this.dataSource.paginator = this.paginator;
        this.cacheSpan('position', d => d.position);
        this.cacheSpan('item_code', d => d.item_code);
        this.cacheSpan('item_name', d => d.item_name);
        this.cacheSpan('item_desc', d => d.item_desc);
        this.tableDivFlag = true;
        this.tabledataFlag = true;
      }
    })
  }
  changePage(pageEvent: PageEvent) {
		console.log(pageEvent);
		// this.paginator.length = 100;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
