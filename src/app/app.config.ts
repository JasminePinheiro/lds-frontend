import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideHttpClient(withFetch()), provideFirebaseApp(() => initializeApp({"projectId":"taskzen-3b6ba","appId":"1:958294556707:web:d5a677195f02e05215b196","storageBucket":"taskzen-3b6ba.appspot.com","apiKey":"AIzaSyCBlQZY05cJORKtZIZ-6UUgWw9VwsB45XM","authDomain":"taskzen-3b6ba.firebaseapp.com","messagingSenderId":"958294556707","measurementId":"G-PW7EE0G4L8"})), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideFirestore(() => getFirestore()), providePerformance(() => getPerformance()), provideStorage(() => getStorage()),]
};
