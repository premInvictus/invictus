import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-whatsapp-dynamic",
  templateUrl: "./whatsapp-dynamic.component.html",
  styleUrls: ["./whatsapp-dynamic.component.css"],
})
export class WhatsappDynamicComponent implements OnInit {
  ELEMENT_DATA: any[] = [
    { sr_no: 1, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 2, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 3, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 4, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 5, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 6, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 7, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 8, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 9, name: "Prem", mobile_no: "0123456789", message: "Hello" },
    { sr_no: 10, name: "Prem", mobile_no: "0123456789", message: "Hello" },
  ];

  displayedColumns: string[] = ["sr_no", "name", "mobile_no", "message"];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

  constructor() {}

  ngOnInit() {}

  sendSelector() {
    alert("Selector binding in progress...");
  }

  showPreview() {
    alert("Dynamic Preview in progress...");
  }

  sendMessage() {
    alert("Sending Message in progress...");
  }
}
