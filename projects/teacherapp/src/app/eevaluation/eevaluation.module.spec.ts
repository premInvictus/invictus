import { EevaluationModule } from './eevaluation.module';

describe('EevaluationModule', () => {
	let eevaluationModule: EevaluationModule;

	beforeEach(() => {
		eevaluationModule = new EevaluationModule();
	});

	it('should create an instance', () => {
		expect(eevaluationModule).toBeTruthy();
	});
});
