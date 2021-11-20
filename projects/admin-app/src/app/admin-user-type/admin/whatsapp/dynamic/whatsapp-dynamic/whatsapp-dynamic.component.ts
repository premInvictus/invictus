import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { WhatsappService } from "../../../services/whatsapp.service";
import * as XLSX from "xlsx";

const excelToJson = require("convert-excel-to-json");

type AOA = any[][];

/**
 * TODO:
 *
 * - File Uploaded:
 *  - Get the data
 *  - Extract the headers from the sheet
 *  - Display column header in the left box
 *
 *  - Functionality of the Selector
 *    - When a header is clicked that header to be shown in a curly braces [as a variable] in the message body
 *
 *  - When Messge Preview is clicked
 *    - The dynamic table with mobile number, name and dynamic message to be shown
 *
 *  - Submit Button
 *    - When clicked it calls the backend API with POST route and sends the message to the respective numbers
 */

@Component({
  selector: "app-whatsapp-dynamic",
  templateUrl: "./whatsapp-dynamic.component.html",
  styleUrls: ["./whatsapp-dynamic.component.css"],
})
export class WhatsappDynamicComponent implements OnInit {
  ELEMENT_DATA: any[] = [];
  displayedColumns: string[] = ["sr_no", "name", "mobile_no", "message"];
  dataSource: MatTableDataSource<Element>;

  constructor(private whatsapp: WhatsappService) {}

  data: any;

  onFileChange(evt: any) {
    console.log("the EVENT ", evt.target.files[0].name);

    const fileName = evt.target.files[0].name;

    const result = excelToJson({
      sourceFile: fileName,
    });

    console.log(result);
    // ---------------------------------------------------------------------
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      // console.log("Result: ", wb);

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  ngOnInit() {}

  sendSelector() {
    console.log("Selector binding in progress...");
  }

  showPreview() {
    this.whatsapp.getMobileNumbers().subscribe((result: any) => {
      if (result) {
        result.data.forEach((ele: any) => {
          this.ELEMENT_DATA.push({
            name: ele.first_name,
            mobile_no: 1,
            message: ele.last_name,
          });
        });

        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
      } else {
        console.error("Error Occured !!");
      }
    });
  }

  sendMessage() {}
}
