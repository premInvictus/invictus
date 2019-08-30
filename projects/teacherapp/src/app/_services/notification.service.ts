import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
@Injectable()
export class NotificationService {

	constructor(private _notificationService: NotificationsService) { }

	showSuccessErrorMessage(message, type) {
		if (type === 'success') {
			this._notificationService.success('Success', message, {
				timeout: 2000,
				showProgressBar: true,
				pauseOnHover: true
			});
		} else if (type === 'error') {
			this._notificationService.error('Error', message, {
				timeout: 2000,
				showProgressBar: true,
				pauseOnHover: true
			});
		} else if (type === 'info') {
			this._notificationService.info('Info', message, {
				timeout: 2000,
				showProgressBar: true,
				pauseOnHover: true
			});
		}
	}
}
