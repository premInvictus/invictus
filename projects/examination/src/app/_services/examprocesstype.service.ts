import {Injectable} from '@angular/core';

@Injectable()
export class ProcesstypeExamService {
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
 