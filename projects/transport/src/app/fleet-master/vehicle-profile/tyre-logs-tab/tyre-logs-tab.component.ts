import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material'
import { ServiceLogItemsComponent } from '../../../transport-auxillaries/service-log-items/service-log-items.component';
import { MatDialog } from '@angular/material/dialog';
export interface Element {
  date: any,
  billno: any,
  quantity:any,
  rate:any
  amount: any,
  action: any
}

@Component({
  selector: 'app-tyre-logs-tab',
  templateUrl: './tyre-logs-tab.component.html',
  styleUrls: ['./tyre-logs-tab.component.scss']
})
export class TyreLogsTabComponent implements OnInit {

  @Input() vehicle: any = {};
  transportlogsArray: any[] = [];
  displayedColumns: string[] = ['date', 'billno', 'quantity','rate', 'amount', 'modify'];
  ELEMENT_DATA: Element[] = [];
  datasource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    console.log('ngOnInit tyre_logs', this.vehicle);
    this.prepareDataSource();
  }
  ngOnChanges(){
    console.log('ngOnChange tyre_logs', this.vehicle);
    this.prepareDataSource();
  }
  prepareDataSource() {
    this.ELEMENT_DATA = [];
    this.transportlogsArray = this.vehicle.tyre_logs ? this.vehicle.tyre_logs : [];
    for (const item of this.transportlogsArray) {
      const element = {
        date: item.date,
        billno: '',
        quantity: item.quantity,
        rate: item.rate,
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
