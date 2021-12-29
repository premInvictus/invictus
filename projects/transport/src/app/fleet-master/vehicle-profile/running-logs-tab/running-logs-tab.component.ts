import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material'
import { ServiceLogItemsComponent } from '../../../transport-auxillaries/service-log-items/service-log-items.component';
import { MatDialog } from '@angular/material/dialog';
export interface Element {
  date: any,
  starttime: any,
  endtime:any,
  action: any
}

@Component({
  selector: 'app-running-logs-tab',
  templateUrl: './running-logs-tab.component.html',
  styleUrls: ['./running-logs-tab.component.scss']
})
export class RunningLogsTabComponent implements OnInit {

  @Input() vehicle: any = {};
  transportlogsArray: any[] = [];
  displayedColumns: string[] = ['date', 'starttime', 'endtime', 'modify'];
  ELEMENT_DATA: Element[] = [];
  datasource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    console.log('ngOnInit fuel_logs', this.vehicle);
    this.prepareDataSource();
  }
  ngOnChanges(){
    console.log('ngOnChange fuel_logs', this.vehicle);
    //this.prepareDataSource();
  }
  prepareDataSource() {
    this.ELEMENT_DATA = [];
    this.transportlogsArray = this.vehicle.fuel_logs ? this.vehicle.fuel_logs : [];
    for (const item of this.transportlogsArray) {
      const element = {
        date: '',
        starttime: '',
        endtime: '',
        action: item
      };

      this.ELEMENT_DATA.push(element);
    }
    this.datasource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

  }
}
