import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Member } from '../../member';
import  {RegisterPage} from '../../sample-pages/register/register'





@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class LoginPage {

  id : string;
  password : string;
  constructor(public navCtrl: NavController,
              private member : Member) { }



  onClickLogin(){

        console.log('Login :');

        if(!this.id)  return alert('Id is required');
        if(!this.password)  return alert('Password is required');

        
        this.member.set('id', this.id);
        this.member.set('password', this.password)
        this.member
            .login(response => {  
              console.log(response)
              alert('Welcome to Philgo');
            }, e => {            
              console.error(e)
            });    
  }


  onClickRegister(){
    this.navCtrl.setRoot(RegisterPage);
  }


}


