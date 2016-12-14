import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { APIService } from './../../shared/api.service';
import { User } from './../model/user';

@Injectable()
export class AuthService {

    constructor(private api: APIService) { }

    isLoggedIn(): boolean {
        let token = this.getToken();
        return tokenNotExpired(null, token);
    }

    getToken(): string {
        return localStorage.getItem('token');
    }

    removeToken(): void {
        localStorage.removeItem('token');
    }

    login(user: User): Observable<boolean> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.api.request({
            uri: '/auth/token',
            method: 'POST',
            headers: headers,
            body: `grant_type=password&username=${user.email}&password=${user.password}`,
            withAuthorization: false,
        })
            .map(res => {
                let token = res['access_token'];
                if (!token) {
                    console.error("no token in response");
                    return false;
                }
                localStorage.setItem('token', token);
                return true;
            });
    }

    register(user: User): Observable<boolean> {
        return this.api.request({
            uri: '/users/register',
            method: 'POST',
            body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
            withAuthorization: false,
        })
            .map(res => {
                return true;
            });
    }
}