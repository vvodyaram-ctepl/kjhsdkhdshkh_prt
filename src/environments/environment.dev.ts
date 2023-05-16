// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


 
//let vmname = $(curl -H Metadata-Flavor:Google http://metadata/computeMetadata/v1/instance/hostname | cut -d. -f1)
//let zone  = $(curl -H Metadata-Flavor:Google http://metadata/computeMetadata/v1/instance/zone | cut -d/ -f4)
//let pip =$(gcloud compute instances describe $vmname --zone=$zone --format='get(networkInterfaces[0].accessConfigs[0].natIP)')


export const environment = {
  production: false,
 //baseUrl:'http://35.208.6.100:8080/wearables_service',
 //baseUrl:'https://35.209.223.199/wearables_service',
// baseUrl:'https://portal.dev.wearablesclinicaltrials.com/wearables_service',  
 baseUrl:'https://10.81.1.66/wearables_service',
 
  // baseUrl:'http://10.81.25.70:8080/wearables_service',
  baseUrl2: '',
  gcpStoragePath: 'https://storage.googleapis.com/wearables-sensor-data-pr/DEV/GCloud/WPortal/',
  grantType: 'password',
  clientId: 'adminClientId',
  clientSecret: 'wearablesAdmin',
  tokenString: 'userToken',
  userId: 'userId',
  refreshTokenString: 'userRefreshToken'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
