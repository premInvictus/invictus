import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material'
import { ServiceLogItemsComponent } from '../../../transport-auxillaries/service-log-items/service-log-items.component';
import { MatDialog } from '@angular/material/dialog';
export interface Element {
  date: any,
  workshop: any,
  amount: any,
  items: any,
  action: any
}

@Component({
  selector: 'app-service-logs-tab',
  templateUrl: './service-logs-tab.component.html',
  styleUrls: ['./service-logs-tab.component.scss']
})
export class ServiceLogsTabComponent implements OnInit, OnChanges {

  @Input() vehicle: any = {};
  transportlogsArray: any[] = [];
  displayedColumns: string[] = ['date', 'workshop', 'items', 'amount', 'modify'];
  ELEMENT_DATA: Element[] = [];
  datasource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    console.log('ngOnInit service log', this.vehicle);
    this.prepareDataSource();
  }
  ngOnChanges(){
    console.log('ngOnChange service log', this.vehicle);
    this.prepareDataSource();
  }
  prepareDataSource() {
    this.ELEMENT_DATA = [];
    this.transportlogsArray = this.vehicle.service_logs ? this.vehicle.service_logs : [];
    for (const item of this.transportlogsArray) {
      const element = {
        date: item.date,
        workshop: item.workshop,
        items: item.items,
        amount: item.amount,
        action: item
      };

      this.ELEMENT_DATA.push(element);
    }
    this.datasource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

  }
  openDialogItemDetail(item): void {
		const dialogRef = this.dialog.open(ServiceLogItemsComponent, {
			height: '80%',
			width: '1000px',
			data: item
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

}
