import { Component, OnInit, Input,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonAPIService, InventoryService } from '../../_services';

@Component({
  selector: 'app-inv-item-details',
  templateUrl: './inv-item-details.component.html',
  styleUrls: ['./inv-item-details.component.css']
})
export class InvItemDetailsComponent implements OnInit {
  itemDetails: any;
  detailsFlag = false;
  constructor(
    public dialogRef: MatDialogRef<InvItemDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private inventoryService: InventoryService,
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.getItemRecordMaster();
  }
  getItemRecordMaster(){
    const param: any = {};
    param.item_code = this.data.item_code;
    this.detailsFlag = false
    this.inventoryService.getItemRecordMaster(param).subscribe((result: any) => {
      if(result && result.status === 'ok'){
        this.itemDetails = result.data.records[0];
        //console.log(this.itemArray);
        const total_qty = this.itemDetails.item_location.reduce((total:number, val) => {
          return total += Number(val.item_qty);
        },0);
        const location = this.itemDetails.item_location_details.reduce((current, next, index) => {
          next.item_qty = this.itemDetails.item_location[index].item_qty;
          current.push(next);
          return current;
        },[]);
        this.itemDetails.total_qty = total_qty;
        this.itemDetails.location = location;
      }
    })
  }
  closeDialog(){
    this.dialogRef.close();
  }

}
