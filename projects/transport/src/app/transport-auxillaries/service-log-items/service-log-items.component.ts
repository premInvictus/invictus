import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';

export interface Element {
  item: string;
  quantity: number;
  rate: number;
  amount: number;
}
@Component({
  selector: 'app-service-log-items',
  templateUrl: './service-log-items.component.html',
  styleUrls: ['./service-log-items.component.scss']
})
export class ServiceLogItemsComponent implements OnInit {

  displayedColumns: string[] = ['item', 'quantity','rate','amount'];
  ELEMENT_DATA: Element[] = [];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  constructor(
    public dialogRef: MatDialogRef<ServiceLogItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log('this.data',this.data);
    if(this.data.items.length > 0){
      this.data.items.forEach(element => {
        this.ELEMENT_DATA.push({
          item:element.item,
          quantity:element.quantity,
          rate:element.rate,
          amount:element.quantity * element.rate
        })
      });
    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  getTotalCost() {
    return this.ELEMENT_DATA.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

}
