import { enableProdMode, ApplicationRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';
import { enableDebugTools } from '@angular/platform-browser';

if (AppConfig.production) {
  enableProdMode();
}

// platformBrowserDynamic()
//   .bootstrapModule(AppModule, {
//     preserveWhitespaces: false,
//   })
//   .then((module): void => {
//     const applicationRef = module.injector.get(ApplicationRef);
//     const appComponent = applicationRef.components[0];
//     enableDebugTools(appComponent);
//   })
//   .catch(err => console.error(err));

async function main(): Promise<void> {
  try {
    await platformBrowserDynamic().bootstrapModule(AppModule);
  } catch (error) {
    console.log(error);
  }
}

main();
