import { Component, OnInit } from '@angular/core';
import {
	Event,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router
} from '@angular/router';
import { CommonAPIService } from 'src/app/_services';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'Invictus DigiSoft';
	private currenturl = '';
	public options = {
		position: ['bottom', 'right'],
		timeOut: 3000,
		lastOnBottom: true
	};
	showLoadingFlag = true;
	constructor(private router: Router, private loaderService: CommonAPIService) {
		this.loaderService.showLoading.subscribe((flag: boolean) => {
			setTimeout(() => this.showLoadingFlag = flag, 0);
		});
		this.router.events.subscribe((event: Event) => {
			console.error(event);
			switch (true) {
				case event instanceof NavigationStart: {
					// this.showLoadingFlag = true;
					break;
				}

				case event instanceof NavigationEnd:
				case event instanceof NavigationCancel:
				case event instanceof NavigationError: {
					// this.showLoadingFlag = false;
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
