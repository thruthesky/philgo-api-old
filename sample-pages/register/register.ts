import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Member } from '../../member';
import{ LoginPage }from '../login/login';


export class User_Data{
  id : string;
  nickname : string;
  password : string;
  name : string;
  email: string;
  mobile : string;s
  gender : 'M';
  birth_year = '1916';
}

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})




export class RegisterPage {
   userData = <User_Data>{}
   urlPhoto = 'assets/img/anonymous.gif';
 
  constructor(public navCtrl: NavController,
              private member : Member) { }



  
    onClickRegister(){

         this.member.sets(this.userData);
         this.member.create(re=> {
           alert('You are now register');
           console.log(re);
         },
         e =>{
           console.log(e);
         })
        
    }
    onClickBack(){
        this.navCtrl.setRoot(LoginPage);
    }


    onClickPhoto(){

    }
 
    onClickDeletePhoto(){

    }

    onChangeFile($event){

        console.log($event);
        this.member.set('submit','1');
        this.member.set('module','ajax');
        this.member.set('action','file_upload_submit');
        this.member.set('page','register');
        this.member.set('gid','id'+Date.now);
        this.member.set('file', $event);

        this.member.methodPost(re=>{
          console.log(re);
        }, e =>{
          console.log(e);
        })
    }

}


