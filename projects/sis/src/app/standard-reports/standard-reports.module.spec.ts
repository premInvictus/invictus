import { StandardReportsModule } from './standard-reports.module';

describe('StandardReportsModule', () => {
	let standardReportsModule: StandardReportsModule;

	beforeEach(() => {
		standardReportsModule = new StandardReportsModule();
	});

	it('should create an instance', () => {
		expect(standardReportsModule).toBeTruthy();
	});
});
