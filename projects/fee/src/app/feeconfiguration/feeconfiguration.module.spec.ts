import { FeeconfigurationModule } from './feeconfiguration.module';

describe('FeeconfigurationModule', () => {
	let feeconfigurationModule: FeeconfigurationModule;

	beforeEach(() => {
		feeconfigurationModule = new FeeconfigurationModule();
	});

	it('should create an instance', () => {
		expect(feeconfigurationModule).toBeTruthy();
	});
});
