import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';

import { AuthenticationService, UserService } from './_services/index';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';

// used for fake backend
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions, RequestMethod } from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        AuthenticationService,
        UserService
    ],
    precompile: [
        LoginComponent,
        HomeComponent
    ]
})

export class AppComponent {
    constructor(private backend: MockBackend) {
        // setup fake backend for backend-less development
        this.backend.connections.subscribe((connection: MockConnection) => {
            let testUser = { username: 'test', password: 'test', firstName: 'Test', lastName: 'User' };

            // wrap in timeout to simulate server api call
            setTimeout(() => {

                // fake authenticate api end point
                if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
                    // get parameters from post request
                    let params = JSON.parse(connection.request.getBody());

                    // check user credentials and return fake jwt token if valid
                    if (params.username === testUser.username && params.password === testUser.password) {
                        connection.mockRespond(new Response(
                            new ResponseOptions({ status: 200, body: { token: 'fake-jwt-token' } })
                        ));
                    } else {
                        connection.mockRespond(new Response(
                            new ResponseOptions({ status: 200 })
                        ));
                    }
                }

                // fake users api end point
                if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return test users if valid, this security is implemented server side
                    // in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        connection.mockRespond(new Response(
                            new ResponseOptions({ status: 200, body: [testUser] })
                        ));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(
                            new ResponseOptions({ status: 401 })
                        ));
                    }
                }

            }, 500);

        });
    }}
