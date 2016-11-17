import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Member, USER_LOGIN_DATA } from '../../v3/member';
import { SampleRegisterPage } from '../register/register';
import { SampleHomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class SampleFaceBookLoginPage {

  process = Object();
  loginData: USER_LOGIN_DATA = <USER_LOGIN_DATA> {};
  constructor(public navCtrl: NavController, private member: Member) { }

  onClickLogin() {
    this.process = { 'loader' : true };
      this.member.login_To_facebook( () => {
        this.navCtrl.setRoot( SampleHomePage );
        alert('Login success !');
      },
      e => {
        this.process = { 'error' : e };
      });
  }
 



}


