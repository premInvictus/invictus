import { Component, OnInit } from "@angular/core";
import QRCode from "qrcode";
import { Router } from "@angular/router";
import { WhatsappService, NotificationService } from "../_services/index";

@Component({
  selector: "app-whatsapp",
  templateUrl: "./whatsapp.component.html",
  styleUrls: ["./whatsapp.component.css"],
})
export class WhatsappComponent implements OnInit {
  tabSelectedIndex = 0;
  tabIndex: any;
  socket: any;
  msgFlag: any;

  constructor(
    private whatsapp: WhatsappService,
    private route: Router,
    private notif: NotificationService
  ) {}

  ngOnInit() {
    // Here we want to listen to an event from the socket.io server
    this.whatsapp.listen("connect event").subscribe((result: any) => {
      console.log(`DATA FROM SERVICE FILE: ${result}`);

      if (result) {
        console.log("THE RESULT IS: ", result);
        this.notif.showSuccessErrorMessage(`Welcome ${result}`, "info");
        this.showWhatsappChildPage(1);
      }
    });

    this.whatsapp.listen("disconnect event").subscribe((result: any) => {
      console.log("SOCKET DISCONNECT: ", result);
      if (result) {
        this.route.navigate(["admin/whatsapp_qr"]);
      }
    });

    this.showQr();
  }

  setTabValue(value: number) {
    this.tabSelectedIndex = value;
  }

  showQr: any = async () => {
    console.log("ShowQr Called!");

    this.whatsapp.showQrCode().subscribe((result) => {
      if (result) {
        console.log("THE FE RESULT: ", result);

        var opts = {
          errorCorrectionLevel: "M",
          type: "image/jpeg",
          quality: 0.3,
          margin: 1,
          color: {
            dark: "#808080",
            light: "#0000",
          },
        };

        QRCode.toCanvas(result, opts, function (err: any, canvas: any) {
          if (err)
            this.notif.showSuccessErrorMessage("No Qr string found", "error");

          document.getElementById("placeholder").appendChild(canvas);
        });
      }
    });
  };

  showWhatsappChildPage = (msgFlag: any) => {
    if (msgFlag === 1) this.route.navigate(["admin/whatsapp_static"]);
    else if (msgFlag === 2) this.route.navigate(["admin/whatsapp_dynamic"]);
  };
}
