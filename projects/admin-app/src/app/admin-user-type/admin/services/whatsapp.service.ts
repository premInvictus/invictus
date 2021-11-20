import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoaderService } from "projects/axiom/src/app/_services/index";
// import { environment } from "src/environments/environment";

@Injectable()
export class WhatsappService {
  constructor(private http: HttpClient, private loaderService: LoaderService) {}

  getMobileNumbers() {
    this.loaderService.startLoading();
    return this.http.get("https://reqres.in/api/users");
  }
}
