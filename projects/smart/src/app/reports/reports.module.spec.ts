import { SmartReportsModule } from './reports.module';

describe('SmartReportsModule', () => {
	let reportsModule: SmartReportsModule;

	beforeEach(() => {
		reportsModule = new SmartReportsModule();
	});

	it('should create an instance', () => {
		expect(reportsModule).toBeTruthy();
	});
});
