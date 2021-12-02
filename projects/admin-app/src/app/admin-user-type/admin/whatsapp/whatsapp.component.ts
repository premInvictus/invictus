import { Component, OnInit } from "@angular/core";
import { WhatsappService } from "../services/whatsapp.service";
import QRCode from "qrcode";

@Component({
  selector: "app-whatsapp",
  templateUrl: "./whatsapp.component.html",
  styleUrls: ["./whatsapp.component.css"],
})
export class WhatsappComponent implements OnInit {
  tabSelectedIndex = 0;
  tabIndex: any;

  constructor(private whatsapp: WhatsappService) {}

  ngOnInit() {
    this.showQr();
  }

  setTabValue(value: number) {
    this.tabSelectedIndex = value;
  }

  showQr: any = async () => {
    console.log("ShowQr Called!");

    this.whatsapp.showQrCode().subscribe((data) => {
      if (data) {
        console.log("THE FE DATA: ", data);

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

        QRCode.toCanvas(data, opts, function (err: any, canvas: any) {
          if (err) throw err;

          document.getElementById("placeholder").appendChild(canvas);
        });
      }
    });
  };
}
