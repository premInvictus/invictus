import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { loginrouting } from './login.routing';
import { CookieModule } from 'ngx-cookie';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatRadioModule, MatCheckboxModule, MatCardModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
	],
	declarations: [LoginComponent],
	providers: []
})
export class LoginModule { }
