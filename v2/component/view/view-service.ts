import { Injectable } from '@angular/core';

@Injectable()
export class ViewService {

    hideContent = {};
    showEditComponent  = {};

    constructor() {

        console.log("I am View Service and now I am being construct");
     }
}