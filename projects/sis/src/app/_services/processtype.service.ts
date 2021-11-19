import {Injectable} from '@angular/core';

@Injectable()
export class ProcesstypeService {
		private processType;
		constructor() {

		}
		setProcesstype(value) {
				this.processType = value;
		}
		getProcesstype() {
				if (this.processType) {
						return this.processType;
				}
		}
		resetProcesstype() {
				this.processType = null;
		}
}
