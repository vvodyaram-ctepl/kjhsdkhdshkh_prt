// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`. 

export const environment = {
  production: true,
  baseUrl: 'https://wpservices.wearablesclinicaltrials.com/wearables',
  gcpStoragePath: 'https://storage.googleapis.com/pr-wearables-portal-media-prod/PROD/GCloud/WPortal/',
  baseUrl2:'',
  grantType: 'password',
  clientId: 'adminClientId',
  clientSecret: 'wearablesAdmin',
  tokenString: 'userToken',
  userId: 'userId',
  refreshTokenString: 'userRefreshToken',
  firebase:{
    apiKey: "AIzaSyDNzx5zkMgX6eMIFdPx-YMtbLac0pDBG_8",
    authDomain: "ct-wearables-portal-pf.firebaseapp.com",
    projectId: "ct-wearables-portal-prod",
    storageBucket: "pr-wearables-portal-appspot-com-prod"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
