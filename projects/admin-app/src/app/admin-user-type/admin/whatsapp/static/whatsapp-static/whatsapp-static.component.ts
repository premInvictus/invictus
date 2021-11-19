import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-whatsapp-static",
  templateUrl: "./whatsapp-static.component.html",
  styleUrls: ["./whatsapp-static.component.css"],
})
export class WhatsappStaticComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  getNumbers() {
    alert("Fetching Numbers ....");
  }

  sendMessage() {
    alert("sending Message ..");
  }
}
