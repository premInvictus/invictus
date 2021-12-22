import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { SmartconfigurationRoutingModule } from './smartconfiguration-routing.module';
import { SystemInfoComponent } from './system-info/system-info.component';
import { SmartToAxiomComponent } from './smart-to-axiom/smart-to-axiom.component';
import { ClassMapComponent } from './smart-to-axiom/class-map/class-map.component';
import { SubjectsMapComponent } from './smart-to-axiom/subjects-map/subjects-map.component';
import { TopicMapComponent } from './smart-to-axiom/topic-map/topic-map.component';
import { SubtopicMapComponent } from './smart-to-axiom/subtopic-map/subtopic-map.component';

@NgModule({
	imports: [
		CommonModule,
		LoadingModule,
		SmartconfigurationRoutingModule,
		SmartSharedModule
	],
	declarations: [SystemInfoComponent, SmartToAxiomComponent, ClassMapComponent, SubjectsMapComponent, TopicMapComponent, SubtopicMapComponent]
})
export class SmartconfigurationModule { }
 