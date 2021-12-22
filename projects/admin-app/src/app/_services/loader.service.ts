import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonAPIService } from 'src/app/_services';
@Injectable()
export class LoaderService {
	constructor(private common: CommonAPIService) { }
	startLoading() {
		this.common.showLoading.next(true);
	}

	stopLoading() {
		this.common.showLoading.next(false);
	}

}
