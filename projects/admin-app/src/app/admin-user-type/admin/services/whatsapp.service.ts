import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoaderService } from "projects/axiom/src/app/_services/index";
import { environment } from "src/environments/environment";
import io from "socket.io-client";
import { Observable } from "rxjs";

@Injectable()
export class WhatsappService {
  socket: any;

  constructor(private http: HttpClient, private loaderService: LoaderService) {
    this.socket = io(environment.apiWhatsappBackendURl, {
      withCredentials: true,
    });
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  showQrCode() {
    return this.http.get(environment.apiWhatsappQrCodeUrl, {
      responseType: "text",
    });
  }

  sendStaticMessage(message: any, phone: any) {
    this.loaderService.startLoading();
    return this.http.post(environment.apiWhatsappStaticUrl, {
      message: message,
      number: phone,
    });
  }

  sendDynamicMessage(value: any[]) {
    console.log(value);

    this.loaderService.startLoading();
    return this.http.post(environment.apiWhatsappDynamicUrl, value);
  }

  resetForm(form: any) {
    return form.reset();
  }
}
