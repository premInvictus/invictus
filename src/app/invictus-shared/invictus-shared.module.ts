import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopNavComponent } from './top-nav/top-nav.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FooterComponent } from './footer/footer.component';
import { ProjectComponent } from './project/project.component';
import { MatSidenavModule, MatTooltipModule, MatButtonModule, MatTableModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap';
import { IndianCurrency } from '../_pipes';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
//import { TruncatetextPipe } from '../_pipes/truncatetext.pipe'
import { NotificationPageComponent } from '../login/notification-page/notification-page.component';
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
		MatInputModule,
		MatTabsModule,
		MatCardModule,
		MatIconModule,
		MatTableModule
	],
	declarations: [TopNavComponent, SideNavComponent, FooterComponent, ProjectComponent, IndianCurrency, UserCredentialComponent, NotificationPageComponent
	], 
	exports: [
		TopNavComponent,
		SideNavComponent,
		FooterComponent,
		FormsModule,
		ReactiveFormsModule,
		MatMenuModule,
		MatExpansionModule,
		MatSidenavModule,
		RouterModule
	]
})
export class InvictusSharedModule { }
