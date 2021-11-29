import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoaderService } from "projects/axiom/src/app/_services/index";
import { environment } from "src/environments/environment";

const qrcode = require('qrcode-terminal');

@Injectable()
export class WhatsappService {
  constructor(private http: HttpClient, private loaderService: LoaderService) {}

  showQrCode() {
    // qrcode.generate(qr)
    
    // console.log(this.http.get('http://localhost:8000/qr')); 
   return  this.http.get('http://localhost:8000/qrCode')
  }

  sendStaticMessage(message, phone) {
    this.loaderService.startLoading();
    return this.http.post(environment.apiWhatsappStaticUrl, {
      message: message,
      number: phone,
    });
  }

  sendDynamicMessage(value) {
    console.log(value);

    this.loaderService.startLoading();
    return this.http.post(environment.apiWhatsappDynamicUrl, value);
  }

  resetForm(form: any) {
    return form.reset();
  }
}
