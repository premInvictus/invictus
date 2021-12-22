import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { mergeMapTo } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonAPIService } from './commonAPI.service';
@Injectable()
export class MessagingService {
	currentMessage = new BehaviorSubject(null);
	webDeviceToken: any = {};
	device_id: any;
	constructor(private angularFireMessaging: AngularFireMessaging,
		private common: CommonAPIService) {
		this.angularFireMessaging.messaging.subscribe(
			(_messaging) => {
				_messaging.onMessage = _messaging.onMessage.bind(_messaging);
				_messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
			}
		);
	}
	requestPermission() {
		if (localStorage.getItem("web-token")) {
			if (localStorage.getItem("web-token")) {
			this.webDeviceToken = JSON.parse(localStorage.getItem("web-token"));
			this.angularFireMessaging.deleteToken(this.webDeviceToken['web-token']);
			}

		}
		this.angularFireMessaging.requestToken.pipe(mergeMapTo(this.angularFireMessaging.tokenChanges)).subscribe(
			(token) => {
				console.log(token);
				localStorage.setItem("web-token", JSON.stringify({ "web-token": token }));
			},
			(err) => {
				console.error('Unable to get permission to notify.', err);
			}
		);
	}
	receiveMessage() {
		this.angularFireMessaging.messages.subscribe(
			(payload) => {
				console.log("new message received. ", payload);
				this.currentMessage.next(payload);
				this.common.messageSub.next({ message: "Sent" })
			});
	}
}
