// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { urlSettings } from '../core/settings/urlSettings';

export const environment = {
  production: false,
};

urlSettings.Settings = {
  apiProtocol: 'https',
  apiHost: 'data.fixer.io',
  apiEndPoint: 'api/latest',
  language: 'ar',

  // apiProtocol: "https",
  // apiHost: "e1a6-197-58-190-85.ngrok-free.app",
  // apiEndPoint: "api",
  // language: "ar",

  // apiPort: 5000,
  // apiProtocol: "http",
  // apiHost: "192.168.1.11",
  // apiEndPoint: "api",
  // language: "ar",
};
