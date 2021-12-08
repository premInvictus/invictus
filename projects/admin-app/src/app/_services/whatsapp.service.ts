import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoaderService } from "projects/axiom/src/app/_services/index";
import { environment } from "src/environments/environment";
import { io, Socket } from "socket.io-client";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class WhatsappService {
  socket: Socket;
  msgFlag: any;

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private route: Router
  ) {
    this.socket = io(environment.apiWhatsappBackendURl, {
      withCredentials: true,
    });
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        console.log("SOCKET : ", data, "\n", eventName);

        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  showQrCode() {
    return this.http.get(environment.apiWhatsappBackendURl + "/qrCode", {
      responseType: "text",
    });
  }

  sendStaticMessage(message: any, phone: any) {
    this.loaderService.startLoading();
    return this.http.post(environment.apiWhatsappBackendURl + "/static", {
      message: message,
      number: phone,
    });
  }

  sendDynamicMessage(value: any[]) {
    this.loaderService.startLoading();
    return this.http.post(
      environment.apiWhatsappBackendURl + "/dynamic",
      value
    );
  }

  resetForm(form: any) {
    return form.reset();
  }

  showWhatsappChildPage = (msgFlag: any) => {
    if (msgFlag === 1) this.route.navigate(["admin/whatsapp_static"]);
    else if (msgFlag === 2) this.route.navigate(["admin/whatsapp_dynamic"]);
  };
}
