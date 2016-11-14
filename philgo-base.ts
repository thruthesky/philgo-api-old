

import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';




export class PhilgoBase
 {
     private http: Http;

     constructor(private base_http){
         this.http = base_http;
     }
    data = {};
    url = "http://www.philgo.com"; 
    headers  = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    options  = new RequestOptions({ headers: this.headers });   



    set( key, value ){
        this.data[key] = value;
    }  

    sets(data){
        this.data = data;
    }


    methodPost( successCallBack, failureCallBack ){

            let body = Object.keys(this.data).map( (e) => e + '=' + this.data[e] ).join('&');
                this.data = {};
                this.http.post( this.url, body, this.options )
                    .map(response => response.json())
                    .subscribe( re => {                 
                        successCallBack(re);
                    },e =>{
                       failureCallBack(e);
                    }); 
    }




  
          



}
