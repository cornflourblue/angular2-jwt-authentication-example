import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AuthGuard } from './_guards/index';
import { JwtInterceptor } from './_helpers/index';
import { AuthenticationService, UserService } from './_services/index';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        
        // providers used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }