import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { loginrouting } from './login.routing';
import { CookieModule } from 'ngx-cookie';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatRadioModule, MatCheckboxModule, MatCardModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvictusSharedModule } from '../invictus-shared/invictus-shared.module';


@NgModule({
	imports: [
		CommonModule,
		CookieModule,
		loginrouting,
		MatInputModule,
		MatRadioModule,
		MatCheckboxModule,
		FormsModule,
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		InvictusSharedModule
	],
	declarations: [LoginComponent],
	providers: []
})
export class LoginModule { }
