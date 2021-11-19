import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-whatsapp",
  templateUrl: "./whatsapp.component.html",
  styleUrls: ["./whatsapp.component.css"],
})
export class WhatsappComponent implements OnInit {
  tabSelectedIndex = 0;
  tabIndex: any;

  constructor() {}

  ngOnInit() {}

  setTabValue(value) {
    this.tabSelectedIndex = value;
  }
}
