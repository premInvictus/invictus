import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopNavComponent } from './top-nav/top-nav.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FooterComponent } from './footer/footer.component';
import { ProjectComponent } from './project/project.component';
import { MatSidenavModule, MatTooltipModule, MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap';
import { IndianCurrency } from '../_pipes';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatTooltipModule,
		MatMenuModule,
		MatExpansionModule,
		MatSidenavModule,
		RouterModule,
		AccordionModule.forRoot(),
	],
	declarations: [TopNavComponent, SideNavComponent, FooterComponent, ProjectComponent,IndianCurrency],
	exports: [
		TopNavComponent,
		SideNavComponent,
		FooterComponent,
		FormsModule,
		ReactiveFormsModule,
		MatMenuModule,
		MatExpansionModule,
		MatSidenavModule,
		RouterModule,
	]
})
export class InvictusSharedModule { }
