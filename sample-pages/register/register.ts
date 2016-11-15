import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SampleLoginPage } from '../login/login';
import { SampleHomePage } from '../home/home';
import { Member, USER_DATA } from '../../v2/member';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})


export class SampleRegisterPage {
   userData = <USER_DATA>{}
   urlPhoto = 'assets/img/anonymous.gif';
   process = {};
 
  constructor(public navCtrl: NavController, private member: Member) {

  }
    onClickRegister() {
      console.log('onClickRegister():', this.userData);
      this.process  = { 'loader': true };
      this.member.register( this.userData, () => {
        console.log('onClickRegister::sucess: ');
        this.navCtrl.setRoot( SampleHomePage );
        alert("Registration Success!");
      },
      e => {
        if ( e == 'json-parse-error' ) {
          this.process['error'] = 'Server Error. Please notify this to admin';
        }
        else this.process = { 'error': e };
      })
    }


    onClickBack(){
        this.navCtrl.setRoot(SampleLoginPage);
    }


    onClickPhoto(){

    }
 
    onClickDeletePhoto(){

    }

    onChangeFile($event){

    }

}


