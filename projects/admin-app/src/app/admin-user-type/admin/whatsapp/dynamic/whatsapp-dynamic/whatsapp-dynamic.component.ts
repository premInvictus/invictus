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
  finalMessage: any = "";
  tableHead: any = ["Mobile No.", "Message"];
  tableData: any = [];
  count: any = 0;

  ngOnInit() {
    this.whatsappDynamicForm = this.fBuild.group({
      phone: "",
      text_message: "",
    });
  }

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
  yemerafunction(e) {
    // console.log(e);

    console.log(this.whatsappDynamicForm.value.text_message);
  }
  /**
   * 1. Function -> Get the header
   */
  getHeaders(data: any) {
    for (const [key, value] of Object.entries(data[0])) {
      this.headers.push(value);
    }
    this.headersElem.nativeElement.value = this.headers;
  }

  /**
   * 2. Function -> Compose the Message
   */
  composeMessage(header: any) {
    this.dMessageElem.nativeElement.value += "{" + header + "}";
  }

  showPreview() {
    /**
     * Create the finalMessage
     */
    this.count += 1;
    let example = "hello mr how are {you}";
    let temp = "";
    if (this.count > 0) {
      this.tableData.length = 0;
      this.data.forEach((item: any, i: number) => {
        if (i !== 0 && i < this.data.length - 1) {
          // console.log(item);

          // Composing the message
          temp = this.whatsappDynamicForm.value.text_message;
          // console.log(temp);

          // TODO: Remove the hardcoded values
          // get the values of the left array -> this.headers

          //order same rakna hoga left right dono ka : WHY ?
          if (temp) {
            // this.headers.forEach((item, index) => {
            //   var rpl_str = "{" + item + "}";
            //   temp = temp.replace(rpl_str, item[index]);
            // });
            temp = temp.replace("{School Name}", item[0]);
            temp = temp.replace("{Student Name}", item[1]);
            temp = temp.replace("{Mobile Number}", item[2]);
            temp = temp.replace("{Id}", item[3]);
          } else {
            alert("message cant be empty");
          }

          // Creating the table data [Done]
          if (this.tableData) {
            this.tableData.unshift({
              mobile_no: item[2],
              message: temp,
            });
          }
        }
        // call the api now
        // but it is not dynamic, it's hardcoded !! as of now lets build
      });
    }

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

    // have some delay while sending the message 1 - 5s

    //sending vai static route

    // if (this.whatsappDynamicForm.valid) {
    //   this.tableData.forEach((e: any) => {
    //     this.whatsapp
    //       .sendStaticMessage(e.message, e.mobile_no)
    //       .subscribe((result: any) => {
    //         console.log("message sent", result);
    //       });
    //   });
    // }

    // Sending via dynamic route
    if (this.whatsappDynamicForm.valid) {
      this.whatsapp
        .sendDynamicMessage(this.tableData)
        .subscribe((result: any) => {
          console.log("message sent", result);
        });
    }
  }
}
