import { Component, OnInit } from "@angular/core";
import { WhatsappService } from "../services/whatsapp.service";
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
  }

  setTabValue(value: number) {
    this.tabSelectedIndex = value;
  }
}
