import { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthenticationService {

    //private url = 'http://localhost:8000/api-token-auth/';  // FOR REMOTE TESTING (also remove fake backend in app.module.ts)
    private url = '/api/authenticate';                        // FOR LOCAL TESTING

    private options: RequestOptions;

    public token: string;

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;

        let headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: headers });
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(this.url, JSON.stringify({ username: username, password: password }), this.options)
            .map((response: Response) => {

                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch(this.handleError);
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}