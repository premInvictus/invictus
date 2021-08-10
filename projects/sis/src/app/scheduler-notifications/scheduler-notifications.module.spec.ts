import { SchedulerNotificationsModule } from './scheduler-notifications.module';

describe('SchedulerNotificationsModule', () => {
	let schedulerNotificationsModule: SchedulerNotificationsModule;

	beforeEach(() => {
		schedulerNotificationsModule = new SchedulerNotificationsModule();
	});

	it('should create an instance', () => {
		expect(schedulerNotificationsModule).toBeTruthy();
	});
});
