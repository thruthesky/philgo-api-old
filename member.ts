
import { Injectable } from '@angular/core';
import { PhilgoBase }from './philgo-base';
import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class Member extends PhilgoBase
 {
     id:string;
     password:string;


    constructor(private child_http : Http){
        super(child_http);
    }


    login( yesCallback, noCallback? )
    {  
     
            this.set('module','ajax');
            this.set('action','login');
            this.set('submit','1');       
            this.set('id', this.id);
            this.set('password', this.password);
        
         
            this.methodPost( response =>{
                yesCallback(response);    
            }, e =>{
                noCallback(e);
            });
                   
  
     }



     create(successCallBack, failureCallBack?){
       
        

       

       
            /**These are important for posting to register on Philgo server */
            this.set('module','ajax');
            this.set('action','member_register_submit');
            this.set('submit','1');       
          
          
        
             this.methodPost( response =>{
                successCallBack(response);    
            }, e =>{
                failureCallBack(e);
            });
                    
     }



}
