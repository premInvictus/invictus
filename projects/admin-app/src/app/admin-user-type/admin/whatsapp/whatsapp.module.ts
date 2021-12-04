import { NgModule } from "@angular/core";

import { WhatsappRoutingModule } from "./whatsapp-routing.module";
import { WhatsappStaticComponent } from "./static/whatsapp-static/whatsapp-static.component";

@NgModule({
  imports: [WhatsappRoutingModule],
  declarations: [WhatsappStaticComponent],
})
export class WhatsappModule {}
