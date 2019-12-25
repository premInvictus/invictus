import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PageEvent, MatPaginator, MatTableDataSource } from '@angular/material';
import { InventoryService, CommonAPIService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-branch-tranfer-two',
  templateUrl: './branch-tranfer-two.component.html',
  styleUrls: ['./branch-tranfer-two.component.css']
})
export class BranchTranferTwoComponent implements OnInit, AfterViewInit {
  itempagesize = 100;
  totalRecords: any;
  displayedColumns: any[] = ['srno', 'date', 'created_by', 'branch_name', 'action'];
  BRANCH_TRANSFER_DATA: any[] = [];
  itempagesizeoptions = [100, 300, 500, 1000];
  pageIndex = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  datasource = new MatTableDataSource<any>(this.BRANCH_TRANSFER_DATA);
  pageEvent: PageEvent;
  pageSize = 100;
  constructor(private service: InventoryService,
    private common: CommonAPIService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getBranchTransferData();
  }
  ngAfterViewInit() {
  }
  fetchData(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getBranchTransferData();
    return event;
  }
  getBranchTransferData() {
    this.service.getBranchTransfer({
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "type": 'procurement-master'
    }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        let ind = 0;
        for (const item of res.data) {
          this.BRANCH_TRANSFER_DATA.push({
            srno: ind + 1,
            date: item.created_date,
            created_by: item.created_by.name,
            branch_name: item.branch_details.branch_name,
            action: item,
          })
          ind++;
        }
        this.totalRecords = Number(res.totalRecords);
        localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
        this.datasource = new MatTableDataSource<any>(this.BRANCH_TRANSFER_DATA);
        this.datasource.paginator.length = this.paginator.length = this.totalRecords;
        this.datasource.paginator = this.paginator;
      }
    });
  }
  addItems(val) {
    this.common.setBranchItems(val);
    this.router.navigate(['../add-items-branch-transfer'], { relativeTo: this.route })
  }
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
}
