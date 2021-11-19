import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../_models/message';
import { Event } from '../_models/event';
import * as socketIo from 'socket.io-client';
import {environment} from 'src/environments/environment';
import { Subject } from 'rxjs';

const SERVER_URL = environment.socketUrl;

@Injectable()
export class SocketService {
	private socket;

	userTestInformation = new Subject();
	constructor() { }

	public initSocket(): void {
		this.socket = socketIo(SERVER_URL);
	}

	public send(message: Message): void {
		this.socket.emit('message', message);
	}

	public onMessage(): Observable<Message> {
		return new Observable<Message>(observer => {
			this.socket.on('message', (data: Message) => observer.next(data));
		});
	}

	public onEvent(event: Event): Observable<any> {
		return new Observable<Event>(observer => {
			this.socket.on(event, () => observer.next());
		});
	}

	checkSocketConnection() {

		return this.socket ? true : false;
	}

	sendUserInformation(userData) {
		const userDetail = {
			examId: userData.examId,
			userId: userData.userId,
			paperId: userData.paperId,
			schoolId: userData.schoolId,
			userType: userData.userType
		};
		this.socket.emit('userDetail', userDetail);
	}

	getUserInfo() {
		this.socket.on('message', (response: any) => {
			console.log('userTestInfo', response);
		});
	}

	getUserTestInformation() {
		this.socket.on('testinformation', (response: any) => {
			console.log('testinformation', response);
			this.userTestInformation.next(JSON.parse(response));
		});
	}

	sendUserTestActionDetail(userDetail) {
		this.socket.emit('teststatus', {
			userId: userDetail.userId,
			paperId: userDetail.paperId,
			schoolId: userDetail.schoolId,
			action: userDetail.action,
			examId: userDetail.examId,
			suspiciousCount: userDetail.suspiciousCount,
			networkErrorCount: userDetail.networkErrorCount
		});
	}

	extendSession(userDetail) {
		this.socket.emit('extendSession', {
			userId: userDetail.userId,
			paperId: userDetail.paperId,
			schoolId: userDetail.schoolId,
			action: userDetail.action,
			examId: userDetail.examId
		});
	}

	endSession(userDetail) {
		this.socket.emit('endSession', {
			userId: userDetail.userId,
			paperId: userDetail.paperId,
			schoolId: userDetail.schoolId,
			action: userDetail.action,
			examId: userDetail.examId
		});
	}



}
