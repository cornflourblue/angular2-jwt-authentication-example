import { bootstrap }    from '@angular/platform-browser-dynamic';
import { provide }    from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS, Http, BaseRequestOptions } from '@angular/http';

// provider used to create fake backend
import { MockBackend } from '@angular/http/testing';

import { AppComponent } from './app.component';
import { appRouterProviders } from './app.routes';
import { AuthGuard } from './_guards/auth.guard';

bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms(),
    HTTP_PROVIDERS,
    BaseRequestOptions,
    appRouterProviders,
    AuthGuard,

    // use fake backend in place of Http service for backend-less development
    MockBackend,
    provide(Http, {
        useFactory: (backend, options) => {
            return new Http(backend, options);
        },
        deps: [MockBackend, BaseRequestOptions]
    })
])
.catch(err => console.error(err));
