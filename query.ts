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
    private headers  = new Headers({'Content-Type':'application / x-www-form-urlencoded', "Accept" : "application/json"});  
    private options  = new RequestOptions({ headers: this.headers });   


    constructor(private http : Http){}
    
    
    getBody(){
        return this.body;
    }

    setUrl(url){
        this.url = url;     
    }

    set( key, value ){
        this.data[key] = value;
    }


    post(){         
         this.body =  Object.keys(this.data).map( (e) => e + '=' + this.data[e] ).join('&');
         this.data = {};
         return this.http.post( this.url, this.body, this.options)
    }


  

    get(){       
        this.body = Object.keys(this.data).map( (e) => e + '=' + this.data[e] ).join('&');  
        this.data = {};     
        if(this.body){  
          return this.http.get( this.url +'?' + this.body);   
        } 
        return this.http.get( this.url);
    }


}
