import { Component, OnInit } from '@angular/core';
import {
	Event,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router
} from '@angular/router';
import { CommonAPIService } from './_services/commonAPI.service';
import { HttpRequest } from '@angular/common/http';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	request: HttpRequest<any>;
	title = 'Invictus DigiSoft';
	private currenturl = '';
	public options = {
		position: ['bottom', 'right'],
		timeOut: 3000,
		lastOnBottom: true
	};
	showLoadingFlag;
	constructor(private router: Router, private loaderService: CommonAPIService) {
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
		let prefix: any = '';
		const xhr = new XMLHttpRequest();
		const load: any = this.loaderService;
		if (!localStorage.getItem('Prefix')) {
			const method = 'head';
			const url: any = window.location.href;
			xhr.open(method, url, true);
			xhr.send(null);
			xhr.onreadystatechange = function () {
				if (xhr.readyState) {
					prefix = xhr.getResponseHeader('prefix');
					if (prefix) {
						load.setUserPrefix(prefix);
						localStorage.setItem('Prefix', JSON.stringify({ pre: prefix }));
					}
				}
			};
		} else {
			load.setUserPrefix((JSON.parse(localStorage.getItem('Prefix')).pre));
		}
	}
	getCurrentUrl() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.currenturl = event.url;
			}
		});
	}
}
