import { DynamicReportsModule } from './dynamic-reports.module';

describe('DynamicReportsModule', () => {
	let dynamicReportsModule: DynamicReportsModule;

	beforeEach(() => {
		dynamicReportsModule = new DynamicReportsModule();
	});

	it('should create an instance', () => {
		expect(dynamicReportsModule).toBeTruthy();
	});
});
