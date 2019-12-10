import { StoreMasterModule } from './store-master.module';

describe('StoreMasterModule', () => {
	let storeMasterModule: StoreMasterModule;

	beforeEach(() => {
		storeMasterModule = new StoreMasterModule();
	});

	it('should create an instance', () => {
		expect(storeMasterModule).toBeTruthy();
	});
});
