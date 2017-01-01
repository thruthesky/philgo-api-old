import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';



@Injectable()
export class Philgo extends Api {
    constructor( http: Http ) {
        super( http );
    }

}