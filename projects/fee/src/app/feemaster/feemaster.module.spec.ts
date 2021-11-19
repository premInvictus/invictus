import { FeemasterModule } from './feemaster.module';

describe('FeemasterModule', () => {
	let feemasterModule: FeemasterModule;

	beforeEach(() => {
		feemasterModule = new FeemasterModule();
	});

	it('should create an instance', () => {
		expect(feemasterModule).toBeTruthy();
	});
});
