import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonAPIService, InventoryService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './record-master.model';
import { MatTableDataSource, MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../inventory-shared/customPaginatorClass';
import { InvItemDetailsComponent } from '../../inventory-shared/inv-item-details/inv-item-details.component';

@Component({
  selector: 'app-record-master',
  templateUrl: './record-master.component.html',
  styleUrls: ['./record-master.component.css'],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }]
})
export class RecordMasterComponent implements OnInit, OnDestroy, AfterViewInit {

  paramform: FormGroup;
  tableDivFlag = false;
  tabledataFlag = false;
  itemArray: any = [];
  ELEMENT_DATA: any[] = [];
  pageLength: number;
	pageSize = 2;
  pageSizeOptions=[1, 2, 4];
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
    localStorage.removeItem('invoiceBulkRecords');
    this.buildForm();
    this.getItemRecordMaster({pageSize: this.pageSize, pageIndex : 0});
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy(){
    localStorage.removeItem('invoiceBulkRecords');
  }
  buildForm(){
    this.paramform = this.fbuild.group({
      searchId:''
    });
  }
  openItemDetailsModal(item_code) {
    const item: any = {};
    item.item_code = item_code;
    const dialogRef = this.dialog.open(InvItemDetailsComponent, {
      width: '50%',
      height: '500',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
  getItemRecordMaster(value){
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.inventoryService.getItemRecordMaster(value).subscribe((result: any) => {
      if(result && result.status === 'ok'){
        this.itemArray = result.data.records;
        //console.log(this.itemArray); 

        this.itemArray.forEach((element, index) => {
          const total_qty = element.item_location.reduce((total:number, val) => {
            return total += Number(val.item_qty);
          },0);
          const location = element.item_location_details.reduce((current, next, index) => {
            next.item_qty = element.item_location[index].item_qty;
            current.push(next);
            return current;
          },[]);
          this.ELEMENT_DATA.push({
            position: index + 1,
            item_code: element.item_code,
            item_name: element.item_name,
            item_desc: element.item_desc,
            item_location: location,
            item_current_stock: total_qty,
            item_units_name: element.item_units_name
          });
        });
        /*const DATA = this.itemArray.reduce((current, next, index) => {
          next.item_location.forEach(element => {
            current.push({
              position: index + 1,
              item_code: next.item_code,
              item_name: next.item_name,
              item_desc: next.item_desc,
              item_location: element.location_name,
              item_current_stock: element.item_qty,
              item_units_name: next.item_units_name
            });
          });
          return current;
        },[]);
        console.log(DATA);
        this.ELEMENT_DATA = DATA;*/
        this.tableDivFlag = true;
        this.tabledataFlag = true;
        console.log(this.ELEMENT_DATA);
        localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: parseInt(result.data.totalRecord) }));
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.paginator.length = parseInt(result.data.totalRecord);
        this.dataSource.paginator.length = this.paginator.length;
        this.dataSource.paginator = this.paginator;
        //this.cacheSpan('position', d => d.position);
        //this.cacheSpan('item_code', d => d.item_code);
        //this.cacheSpan('item_name', d => d.item_name);
        //this.cacheSpan('item_desc', d => d.item_desc);
      }
    })
  }
  changePage(pageEvent: PageEvent) {
		console.log(pageEvent);
    // this.paginator.length = 100;
    this.getItemRecordMaster({pageSize: pageEvent.pageSize, pageIndex : pageEvent.pageIndex});
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
