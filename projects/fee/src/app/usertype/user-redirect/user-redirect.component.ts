import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { CommonAPIService, SisService } from '../../_services/index';
import { environment } from '../../../environments/environment';
@Component({
	selector: 'app-user-redirect',
	templateUrl: './user-redirect.component.html',
	styleUrls: ['./user-redirect.component.scss']
})
export class UserRedirectComponent implements OnInit {
	userData = [];
	returnUrl: string;
	currentDate = new Date();
	sessionArray: any[] = [];
	currentSessionId: any;
	schoolInfo: any = {};
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private _cookieService: CookieService,
		private sisService: SisService) { }

	ngOnInit() {
	}

}
