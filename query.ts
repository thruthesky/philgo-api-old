/**
 * @file query.ts
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';

@Injectable()
export class Query  {
   
    private data = {};
    private url = "http://www.philgo.com"; 
    private body = '';
    
    headers  = new Headers({'Content-Type':'application / x-www-form-urlencoded', "Accept" : "application/json"});  
    options  = new RequestOptions({ headers: this.headers });   

    constructor(private http : Http){}
    
    
    setUrl(url){
        this.url = url;     
    }

    set( key, value ){
        this.data[key] = value;
    }

    post(){
         Object.keys(this.data).map( (e) => e + '=' + this.data[e] ).join('&');
         return this.http.post( this.url, this.body, this.options)
    }

    get(){
        if(this.body){
          Object.keys(this.data).map( (e) => e + '=' + this.data[e] ).join('&');
          return this.http.get( this.url +'?' + this.body);   
        } 
        return this.http.get( this.url + this.body);
    }


}
