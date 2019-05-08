import { Component, OnInit } from '@angular/core';
import { LoaderService } from './_services/loader.service';
import { CommonAPIService } from './_services';
import {
	Event,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router
} from '@angular/router';
import { CookieService } from 'ngx-cookie';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'Invictus DigiSoft';
	private currenturl = '';
	public options = {
		position: ['bottom', 'right'],
		timeOut: 3000,
		lastOnBottom: true
	};
	showLoadingFlag = false;
	constructor(private router: Router, private loaderService: LoaderService,
		private _cookieService: CookieService,
		private commonAPIService: CommonAPIService) {
		this.loaderService.showLoading.subscribe((flag: boolean) => {
			this.showLoadingFlag = flag;
		});
		this.router.events.subscribe((event: Event) => {
			switch (true) {
				case event instanceof NavigationStart: {
					this.showLoadingFlag = true;
					break;
				}

				case event instanceof NavigationEnd:
				case event instanceof NavigationCancel:
				case event instanceof NavigationError: {
					this.showLoadingFlag = false;
					break;
				}
				default: {
					break;
				}
			}
		});
	}

	ngOnInit() {
		this.getCurrentUrl();
	}

	getCurrentUrl() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.currenturl = event.url;
			}
		});
	}
}
