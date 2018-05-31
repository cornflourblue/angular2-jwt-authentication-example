import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/first';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    users: User[] = [];

    constructor(private userService: UserService) { }

    ngOnInit() {
        // get users from secure api end point
        this.userService.getAll()
            .first()
            .subscribe(users => {
                this.users = users;
            });
    }

}