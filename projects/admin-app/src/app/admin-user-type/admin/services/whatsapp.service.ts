import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoaderService } from "projects/axiom/src/app/_services/index";
import { environment } from "src/environments/environment";

@Injectable()
export class WhatsappService {
  constructor(private http: HttpClient, private loaderService: LoaderService) {}

  sendStaticMessage(message, phone) {
    this.loaderService.startLoading();
    return this.http.post(environment.apiWhatsappStaticUrl, {
      message: message,
      phone: phone,
    });
  }

  sendDynamicMessage(value) {
    console.log(value);

    this.loaderService.startLoading();
    return this.http.post(environment.apiWhatsappDynamicUrl, value);
  }

  getMobileNumbers() {
    this.loaderService.startLoading();
    return this.http.get("apiWhatsappDynamcicUrl");
  }

  resetForm(form: any) {
    return form.reset();
  }
}
