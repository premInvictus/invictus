import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InventoryService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../inventory-shared/customPaginatorClass';
import { CapitalizePipe } from 'src/app/_pipes';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css'],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }]
})
export class ItemSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  searchForm: FormGroup;
  pageindex = 0;
  pagesize = 10;
  constructor(private fbuild: FormBuilder, private service: InventoryService) { }
  ITEM_MASTER_DATA: any[] = [];
  datasource = new MatTableDataSource<any>(this.ITEM_MASTER_DATA);
  itempagesize = 100;
  totalRecords: any;
  pageIndex = 0;
  pageEvent: PageEvent;
  pageSize = 100;
  displayedColumns = ['sno', 'code', 'name', 'nature', 'category', 'location', 'qty', 'reorder', 'desc'];
  val: any;
  itempagesizeoptions = [100, 300, 500, 1000];
  itemArray: any[] = [];
  spans: any[] = [];
  @ViewChild('paginator') paginator: MatPaginator;
  ngOnInit() {
    localStorage.removeItem('invoiceBulkRecords');
    this.buildForm();
  }
  ngOnDestroy(){
    localStorage.removeItem('invoiceBulkRecords');
  }
  search() { }
  buildForm() {
    this.searchForm = this.fbuild.group({
      search: '',
      page_size: this.pagesize,
      page_index: this.pageindex,
    });
  }
  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
  }
  getItems($event) {
    if ($event.target.value) {
      this.val = $event.target.value
      if (this.val.length >= 3) {
        this.getAllItemsFromMaster();
      }
    }
  }
  getAllItemsFromMaster() {
    this.ITEM_MASTER_DATA = [];
    this.datasource = new MatTableDataSource<any>(this.ITEM_MASTER_DATA);
    const json = {
      page_index: this.pageIndex,
      page_size: this.pageSize,
      searchData: this.val
    };
    this.service.searchItemsFromMaster(json).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.itemArray = [];
        this.itemArray = res.data;
        const DATA = this.itemArray.reduce((current, next, index) => {
          next.item_location.forEach(element => {
            current.push({
              "sno": index + 1,
              "code": next.item_code,
              "name": next.item_name,
              "session": next.item_session,
              "nature": next.item_nature.name,
              "category": next.item_category.name,
              "location": this.getLocation(element.location_id, next.locs),
              "qty": this.getQuantity(element.location_id, next.item_location),
              "reorder": next.item_reorder_level,
              "units": next.item_units.name,
              "desc": next.item_desc,
              "status": next.item_status
            });
          });
          return current;
        }, []);
        this.ITEM_MASTER_DATA = DATA;
        this.cacheSpan('sno', d => d.sno);
        this.cacheSpan('code', d => d.code);
        this.cacheSpan('name', d => d.name);
        this.cacheSpan('nature', d => d.nature);
        this.cacheSpan('category', d => d.category);
        this.cacheSpan('reorder', d => d.reorder);
        this.cacheSpan('desc', d => d.desc);
        console.log(this.spans);
        console.log(this.ITEM_MASTER_DATA);
        this.totalRecords = Number(res.totalRecords);
        localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
        this.datasource = new MatTableDataSource<any>(this.ITEM_MASTER_DATA);
        this.datasource.paginator.length = this.paginator.length = this.totalRecords;
        this.datasource.paginator = this.paginator;
      }
    });
  }
  getLocation(id, array: any[]) {
    const findex = array.findIndex(f => Number(f.location_id) === Number(id));
    if (findex !== -1) {
      return array[findex].location_hierarchy;
    } else {
      return '-';
    }
  }
  getQuantity(id, array: any[]) {
    const findex = array.findIndex(f => Number(f.location_id) === Number(id));
    if (findex !== -1) {
      return array[findex].item_qty;
    }
  }
  fetchData(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllItemsFromMaster();
    return event;
  }
  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }
  cacheSpan(key, accessor) {
    for (let i = 0; i < this.ITEM_MASTER_DATA.length;) {
      let currentValue = accessor(this.ITEM_MASTER_DATA[i]);
      let count = 1;
      for (let j = i + 1; j < this.ITEM_MASTER_DATA.length; j++) {
        if (currentValue != accessor(this.ITEM_MASTER_DATA[j])) {
          break;
        }
        count++;
      }
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      this.spans[i][key] = count;
      i += count;
    }
  }

}
