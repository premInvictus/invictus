import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonAPIService } from './_services/index';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'Invictus DigiSoft';
	public options = {
		position: ['bottom', 'right'],
		timeOut: 3000,
		lastOnBottom: true
	};
	constructor() {
	}

	ngOnInit() {
	}
}
