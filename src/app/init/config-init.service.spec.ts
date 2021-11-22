import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import ConfigInitService from './config-init.service';
import { environment } from '../../environments/environment';

describe('ConfigInitService', () => {
  let configInitService: ConfigInitService;
  let httpClientGetSpy: jasmine.Spy;

  const configMock: any = {
    KEYCLOAK_URL: 'http://localhost:8100/auth',
    KEYCLOAK_REALM: 'ssi-am-accreditation',
    KEYCLOAK_CLIENT_ID: 'accreditation-ui',
    ACCREDITATION_CONTROLLER_BASE_URL: 'http://localhost:8082',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [],
    });

    configInitService = TestBed.inject(ConfigInitService);
    // eslint-disable-next-line dot-notation
    httpClientGetSpy = spyOn(configInitService['httpClient'], 'get');
  });

  it('instance should be successfully created', () => {
    expect(configInitService).toBeTruthy();
  });

  it('if the getConfigStatic function is called, it should return the config object', () => {
    // eslint-disable-next-line dot-notation
    configInitService['config'] = configMock;

    const config = configInitService.getConfigStatic();

    expect(config).toEqual(configMock);
  });

  it('if the getConfigFile function is called, the cofigFile value should be returned from the environment', () => {
    // eslint-disable-next-line dot-notation
    const configFile = configInitService['getConfigFile']();

    expect(configFile).toEqual(environment.configFile);
  });

  it('if the getConfig function is successfully called, the get function from httpClient should also be called', () => {
    httpClientGetSpy.and.returnValue(of({}));

    configInitService.getConfig();

    expect(httpClientGetSpy).toHaveBeenCalled();
  });

  it('if the get function returns a valid response, the config should gain the value of the body of the response', fakeAsync(async () => {
    httpClientGetSpy.and.returnValue(of({ body: '123' }));

    await configInitService.getConfig().toPromise();

    tick();

    // eslint-disable-next-line dot-notation
    expect(configInitService['config']).toEqual('123');
  }));

  it('if the get function returns an invalid response, the config should remain undefined', fakeAsync(async () => {
    httpClientGetSpy.and.returnValue(of({}));

    await configInitService.getConfig().toPromise();

    tick();

    // eslint-disable-next-line dot-notation
    expect(configInitService['config']).toBeUndefined();
  }));
});
