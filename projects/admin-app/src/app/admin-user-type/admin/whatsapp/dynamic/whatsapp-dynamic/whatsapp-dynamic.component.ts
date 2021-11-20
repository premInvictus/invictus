import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { WhatsappService } from "../../../services/whatsapp.service";

@Component({
  selector: "app-whatsapp-dynamic",
  templateUrl: "./whatsapp-dynamic.component.html",
  styleUrls: ["./whatsapp-dynamic.component.css"],
})
export class WhatsappDynamicComponent implements OnInit {
  ELEMENT_DATA: any[] = [
    { sr_no: 1, name: "Prem", mobile_no: "0123456789", message: "Hello" },
  ];

  displayedColumns: string[] = ["sr_no", "name", "mobile_no", "message"];
  dataSource: MatTableDataSource<Element>;
  // dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

  constructor(private whatsapp: WhatsappService) {}

  ngOnInit() {}

  sendSelector() {
    alert("Selector binding in progress...");
  }

  showPreview() {
    let temp = {};
    this.whatsapp.getMobileNumbers().subscribe((result: any) => {
      result.data.map((ele: any) => {
        temp["sr_no"] = ele.id + 1;
        temp["name"] = ele.first_name;
        temp["mobile_no"] = 1;
        temp["message"] = ele.last_name;
        console.log("temp ---", temp);
        this.ELEMENT_DATA.push(temp);
        console.log("The ELEMENT DATA: ", this.ELEMENT_DATA);
      });

      // res.data.forEach((ele: any) => {
      //   // temp["sr_no"] = ele.id;
      //   // temp["name"] = ele.first_name;
      //   // temp["mobile_no"] = 1;
      //   // temp["message"] = ele.last_name;

      //   // console.log("DATA before push---", this.ELEMENT_DATA);
      //   // if (ele.id === temp["sr_no"]) {
      //   //   alert("Inside if");
      //   //   console.log("Different: \n", this.ELEMENT_DATA);
      //   // }
      //   this.ELEMENT_DATA.push(temp);
      //   // console.log("DATA after push---", this.ELEMENT_DATA);
      // });
      // console.log("DATA ----------", this.ELEMENT_DATA);

      this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    });
  }

  sendMessage() {
    alert("Sending Message in progress...");
  }
}
