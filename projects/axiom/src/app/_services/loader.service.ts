import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class LoaderService {
showLoading = new Subject();

	constructor() { }
	startLoading() {
		this.showLoading.next(true);
	}

	stopLoading() {
			this.showLoading.next(false);
	}

}
