import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                result => this.handleResponse(result),
                error => this.handleError(error)
            );
    }

    handleResponse(result: boolean) {
        if (result === true) {
            this.router.navigate(['/']);
        } else {
            this.error = 'Username or password is incorrect';
            this.loading = false;
        }
    }

    handleError(error: string) {
        this.error = 'Error caught during authentication: ' + error;
        this.loading = false;
    }
}
