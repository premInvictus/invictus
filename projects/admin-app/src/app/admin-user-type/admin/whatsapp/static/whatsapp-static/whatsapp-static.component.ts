import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { WhatsappService } from "../../../services/whatsapp.service";
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

type AOA = any[][];

/**
 * TODO:
 *
 * - Get Numbers:
 *  - Get all the numbers from the file
 *
 *  - Submit Button
 *    - When clicked it calls the backend API with POST route and sends the static message to the respective numbers
 */

@Component({
  selector: "app-whatsapp-static",
  templateUrl: "./whatsapp-static.component.html",
  styleUrls: ["./whatsapp-static.component.css"],
})
export class WhatsappStaticComponent implements OnInit {
  constructor(private whatsapp: WhatsappService, private fbuild: FormBuilder) {}

  whatsappStaticForm: FormGroup;

  @ViewChild("number") myNameElem: ElementRef;
  data: any;
  phone: any[] = [];

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

      let temp = [];
      for (let i = 1; i < this.data.length - 1; i++) {
        if (this.data[i].length > 1) {
          temp.push(this.data[i][2]);
          this.phone.push(this.data[i][2]);
        }
      }

      this.myNameElem.nativeElement.value = temp.toString();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  ngOnInit() {
    this.buildForm();
  }

  getNumbers() {
    const data = this.whatsapp.getMobileNumbers();
  }

  buildForm() {
    this.whatsappStaticForm = this.fbuild.group({
      phone: "",
      text_message: "",
    });
  }

  sendMessage() {
    console.log(this.whatsappStaticForm);

    if (this.whatsappStaticForm.valid) {
      var message = this.whatsappStaticForm.value.text_message;
      var numbers = this.whatsappStaticForm.value.phone;
      this.phone.forEach((element: any) => {
        this.whatsapp
          .sendStaticMessage(message, element)
          .subscribe((result: any) => {
            console.log("message sent", result);
          });
      });
    }
  }
}
