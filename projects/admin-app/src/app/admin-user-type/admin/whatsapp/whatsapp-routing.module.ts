import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WhatsappComponent } from "./whatsapp.component";
import { WhatsappStaticComponent } from "./static/whatsapp-static/whatsapp-static.component";

const routes: Routes = [
  { path: "", component: WhatsappComponent },
  { path: "/whatspp_static", component: WhatsappStaticComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhatsappRoutingModule {}
