import { urlSettings } from '../core/settings/urlSettings';

export const environment = {
  production: true,
};

urlSettings.Settings = {
  apiProtocol: 'https',
  apiHost: 'data.fixer.io',
  apiEndPoint: 'api/latest',
  language: 'ar',
};
