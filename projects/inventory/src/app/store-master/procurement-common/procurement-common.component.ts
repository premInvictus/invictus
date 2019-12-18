import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {CommonAPIService } from '../../_services/index';

@Component({
  selector: 'app-procurement-common',
  templateUrl: './procurement-common.component.html',
  styleUrls: ['./procurement-common.component.css']
})
export class ProcurementCommonComponent implements OnInit {
  tabSelectedIndex = 0;
  constructor(
    private commonAPIService: CommonAPIService,
  ) { }

  ngOnInit() {
  }
  setTabValue(value) {
    this.tabSelectedIndex = value;
    this.commonAPIService.tabChange.next({ 'currrentTab': this.tabSelectedIndex });
  }
}
