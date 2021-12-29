import { environment } from '../environments/environment';
export const appConfig = {
	apiUrl: environment.apiAxiomUrl,
	apiSisUrl: environment.apiSisUrl,
	apiFeeUrl: environment.apiFeeUrl,
	logoutUrl: environment.logoutUrl,
	socketUrl: environment.socketUrl,
	testInitiateCode: environment.testInitiateCode,
	testStartCode: environment.testStartCode,
	testOngoingCode: environment.testOngoingCode,
	testSubmitCode: environment.testSubmitCode,
	testInternetErrorCode: environment.testInternetErrorCode,
	testSuspiciousErrorCode: environment.testSuspiciousErrorCode,
	testExtendCode: environment.testExtendCode,
	testEndCode: environment.testEndCode
};
