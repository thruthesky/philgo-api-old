
import { Injectable } from '@angular/core';
import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class PhilgoBase
 {
     id:string;
     password:string;


     private data = {};
     private url = "http://www.philgo.com"; 
     private headers  = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
     private options  = new RequestOptions({ headers: this.headers });   


   
    constructor(private http: Http) {}

    
    set( key, value ){
        this.data[key] = value;
    }  


    login( yesCallback?, noCallback? )
    {  
 
        let id = "user1401";
        let pw = "abcd9999";  
      
            this.set('module','ajax');
            this.set('action','login');
            this.set('submit','1');       
            this.set('id', this.id);
            this.set('password', this.password);
        
            let body = Object.keys(this.data).map( (e) => e + '=' + this.data[e] ).join('&');
                this.data = {};
                this.http.post( this.url, body, this.options )
                    .map(response => response.json())
                    .subscribe( re => {                 
                        yesCallback(re);
                    },e =>{
                        noCallback(e);
                    }); 
  
     }


     register(successCallBack, failureCallBack){
       
       

     


     }



}
