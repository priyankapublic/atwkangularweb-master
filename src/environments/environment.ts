// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  shareurl:'http://localhost:4200/public-qna/question/',
  url:'https://app.askthosewhoknow.org/',
  // url:'https://dapi.askthosewhoknow.org/',
  // url:'https://api.askthosewhoknow.org/',  
  qnaUrl:'https://www.askthosewhoknow.org/',
  firebase: {
    apiKey: "AIzaSyDGjAgM3sPX33tEFxouSBZf1JmsDtMuopE",
    authDomain: "ask-those-who-know-155117.firebaseapp.com",
    databaseURL: "https://ask-those-who-know-155117.firebaseio.com",
    projectId: "ask-those-who-know-155117",
    storageBucket: "ask-those-who-know-155117.appspot.com",
    messagingSenderId: "256446471226",
    appId: "1:256446471226:web:eab1d0182219973937a903",
    measurementId: "G-0QQRT8SP5R"
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
