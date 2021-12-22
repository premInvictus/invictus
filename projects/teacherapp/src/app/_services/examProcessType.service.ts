import {Injectable} from '@angular/core';

@Injectable()
export class ProcessTypeExamService {
		private ProcessType;
		constructor() {}
		setProcessType(value) {
				this.ProcessType = value;
		}
		getProcessType() {
				if (this.ProcessType) {
						return this.ProcessType;
				}
		}
		resetProcessType() {
				this.ProcessType = null;
		}
}
 