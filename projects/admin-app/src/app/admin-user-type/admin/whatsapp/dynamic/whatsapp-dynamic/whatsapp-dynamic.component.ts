import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { WhatsappService } from "../../../services/whatsapp.service";
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup } from "@angular/forms";

type AOA = any[][];

@Component({
  selector: "app-whatsapp-dynamic",
  templateUrl: "./whatsapp-dynamic.component.html",
  styleUrls: ["./whatsapp-dynamic.component.css"],
})
export class WhatsappDynamicComponent implements OnInit {
  // ELEMENT_DATA: any[] = [];
  // displayedColumns: string[] = ["sr_no", "name", "mobile_no", "message"];
  // dataSource: MatTableDataSource<Element>;

  constructor(private whatsapp: WhatsappService, private fBuild: FormBuilder) {}

  whatsappDynamicForm: FormGroup;

  @ViewChild("headers") headersElem: ElementRef;
  @ViewChild("d_message") dMessageElem: ElementRef;
  data: any;
  headers: any[] = [];
  dMessage: any = [];

  // From Static

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      this.getHeaders(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  getHeaderValue(e: any) {
    console.log(typeof e.target.value);
    console.log("The Event value is :", e.target.value);
  }

  /**
   * 1. Function -> Get the header
   */
  getHeaders(data) {
    let something = Object.entries(data[0]);

    something.forEach((e) => {
      this.headers.push(e);
    });

    this.headersElem.nativeElement.value = this.headers;
  }

  showVal(items: any) {
    const msgDiv = document.getElementById("message");
    msgDiv.innerHTML = items;
  }

  /**
   * 2. Function -> Compose the Message
   */
  composeMessage(value: any) {
    this.dMessageElem.nativeElement.value += "{" + value[1] + "}";
  }

  ngOnInit() {}

  showPreview() {
    /**
     * The dynamic table with mobile number, name and dynamic message to be shown
     */
    const messageDiv = document.getElementById("message");
    //
    // this.whatsapp.getMobileNumbers().subscribe((result: any) => {
    //   if (result) {
    //     result.data.forEach((ele: any) => {
    //       this.ELEMENT_DATA.push({
    //         name: ele.first_name,
    //         mobile_no: 1,
    //         message: ele.last_name,
    //       });
    //     });
    //     this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    //   } else {
    //     console.error("Error Occured !!");
    //   }
    // });
  }

  sendMessage() {
    // - When clicked it calls the backend API with POST route and sends the message to the respective numbers
  }
}
