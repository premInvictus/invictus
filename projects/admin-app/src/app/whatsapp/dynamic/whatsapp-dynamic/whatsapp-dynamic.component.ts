import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup } from "@angular/forms";
import { WhatsappService, NotificationService } from "../../../_services/index";

type AOA = any[][];

@Component({
  selector: "app-whatsapp-dynamic",
  templateUrl: "./whatsapp-dynamic.component.html",
  styleUrls: ["./whatsapp-dynamic.component.css"],
})
export class WhatsappDynamicComponent implements OnInit {
  constructor(
    private whatsapp: WhatsappService,
    private fBuild: FormBuilder,
    private notif: NotificationService
  ) {}

  whatsappDynamicForm: FormGroup;

  @ViewChild("headers") headersElem: ElementRef;
  @ViewChild("d_message") dMessageElem: ElementRef;
  data: any;
  headers: any[] = [];
  tableHead: any[] = ["Mobile No.", "Message"];
  tableData: any[] = [];
  count: any = 0;
  msgFlag: any;

  ngOnInit(): void {
    this.whatsappDynamicForm = this.fBuild.group({
      phone: "",
      text_message: "",
    });
  }

  // When we Upload File
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1)
      this.notif.showSuccessErrorMessage("Cannot use multiple files", "error");
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

  // Get the header
  getHeaders(data: any) {
    for (const [key, value] of Object.entries(data[0])) {
      this.headers.push(value);
    }
    this.headersElem.nativeElement.value = this.headers;
  }

  // Compose the Message
  composeMessage(header: any) {
    this.dMessageElem.nativeElement.value += "{" + header + "}";
  }

  showPreview() {
    this.count += 1;
    let d_msg = "";
    this.tableData.length = 0;

    if (this.count > 0) {
      console.log("count!!");

      this.data.forEach((header: any, i: number) => {
        if (i !== 0 && this.data.length - 1) {
          console.log("The data is ", this.data, "the header is ", header);

          // Composing the message
          d_msg = this.whatsappDynamicForm.value.text_message;

          if (d_msg) {
            const sc_name = "{School Name}";
            const st_name = "{Student Name}";
            const mb_no = "{Mobile Number}";
            const id = "{Id}";

            if (sc_name)
              d_msg = d_msg.replace(new RegExp(sc_name, "g"), header[0]);
            if (st_name)
              d_msg = d_msg.replace(new RegExp(st_name, "g"), header[1]);
            if (mb_no) d_msg = d_msg.replace(new RegExp(mb_no, "g"), header[2]);
            if (id) d_msg = d_msg.replace(new RegExp(id, "g"), header[3]);
          }

          // Creating the table data
          if (this.tableData) {
            this.tableData.push({
              mobile_no: header[2],
              message: d_msg,
            });
          }
        }
      });
    }
  }

  showWhatsappChildPage = (msgFlag: any) => {
    this.whatsapp.showWhatsappChildPage(msgFlag);
  };

  sendToast() {
    this.notif.showSuccessErrorMessage("Dynamic Message Sent", "info");
  }

  sendMessage() {
    if (this.whatsappDynamicForm.valid) {
      this.whatsapp
        .sendDynamicMessage(this.tableData)
        .subscribe((result: any) => {
          console.log("RESULT FROM DYNAMIC:", result);
          if (result.length > 0) this.sendToast();
        });
    }
    this.whatsapp.resetForm(this.whatsappDynamicForm);
  }

  reset() {
    this.tableData = [];
    this.whatsapp.resetForm(this.whatsappDynamicForm);
  }
}
