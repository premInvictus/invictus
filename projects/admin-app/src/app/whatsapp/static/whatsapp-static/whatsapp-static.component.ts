import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup } from "@angular/forms";
import { WhatsappService, NotificationService } from "../../../_services/index";

type AOA = any[][];

@Component({
  selector: "app-whatsapp-static",
  templateUrl: "./whatsapp-static.component.html",
  styleUrls: ["./whatsapp-static.component.css"],
})
export class WhatsappStaticComponent implements OnInit {
  constructor(
    private whatsapp: WhatsappService,
    private fbuild: FormBuilder,
    private notif: NotificationService
  ) {}

  whatsappStaticForm: FormGroup;

  @ViewChild("number") myNameElem: ElementRef;
  data: any;
  phone: any[] = [];
  temp: any[] = [];
  msgFlag: any;

  ngOnInit() {
    this.buildForm();
    this.getNumbersCount;
  }

  buildForm() {
    this.whatsappStaticForm = this.fbuild.group({
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

      for (let i = 1; i < this.data.length; i++) {
        if (this.data.length > 1) {
          this.temp.push(this.data[i][2]);
          this.phone.push(this.data[i][2]);
        }
      }
      this.myNameElem.nativeElement.value = this.phone.toString();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // TODO:
  getNumbersCount() {
    alert(`line 74: ${this.phone.length}`);
  }

  showWhatsappChildPage = (msgFlag: any) => {
    this.whatsapp.showWhatsappChildPage(msgFlag);
  };

  sendMessage() {
    if (this.whatsappStaticForm.valid) {
      var message = this.whatsappStaticForm.value.text_message;

      this.phone.forEach((number: any) => {
        this.whatsapp
          .sendStaticMessage(message, number)
          .subscribe((result: any) => {
            console.log("RESULT FROM STATIC:", result);
          });
      });
      if (message && this.phone) {
        this.notif.showSuccessErrorMessage("Static Message Sent", "info");
      }
      this.reset();
    }
  }

  reset() {
    this.whatsapp.resetForm(this.whatsappStaticForm);
  }
}
