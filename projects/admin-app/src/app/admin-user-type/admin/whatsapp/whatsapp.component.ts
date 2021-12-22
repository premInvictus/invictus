import { Component, OnInit } from "@angular/core";
import { WhatsappService } from "../services/whatsapp.service";
import QRCode from "qrcode";
import { Router } from "@angular/router";

@Component({
  selector: "app-whatsapp",
  templateUrl: "./whatsapp.component.html",
  styleUrls: ["./whatsapp.component.css"],
})
export class WhatsappComponent implements OnInit {
  tabSelectedIndex = 0;
  tabIndex: any;
  socket: any;

  constructor(private whatsapp: WhatsappService, private route: Router) {}

  ngOnInit() {
    // Here we want to listen to an event from the socket.io server
    this.whatsapp.listen("test event").subscribe((data) => {
      console.log("DATA FROM SERVICE FILE: ", data);
      if (data) {
        alert("Now change the route!");
        console.log("THE DATA: ", data);
        // this.showWhatsappChildPage();
      }
    });

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

  showWhatsappChildPage = () => {
    this.route.navigate(["whatsapp/whatsapp_static"]);
  };
}
