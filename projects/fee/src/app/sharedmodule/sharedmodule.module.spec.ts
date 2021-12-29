import { SharedmoduleModule } from './sharedmodule.module';

describe('SharedmoduleModule', () => {
	let sharedmoduleModule: SharedmoduleModule;

	beforeEach(() => {
		sharedmoduleModule = new SharedmoduleModule();
	});

	it('should create an instance', () => {
		expect(sharedmoduleModule).toBeTruthy();
	});
});
