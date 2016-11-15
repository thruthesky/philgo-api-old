import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Member, USER_LOGIN_DATA } from '../../v2/member';
import { SampleLoginPage } from '../login/login';
import { SampleRegisterPage } from '../register/register'
@Component({
  templateUrl: 'home.html'
})



export class SampleHomePage {
  login: USER_LOGIN_DATA = <USER_LOGIN_DATA> {};
  constructor( public navCtrl: NavController, private member: Member ) {
    console.log(member);
    member.version( v => console.log('version: ', v) );
    //navCtrl.setRoot(LoginPage);
    // this.navCtrl.setRoot( SampleRegisterPage );
    this.checkLogin();
  }

  checkLogin() {
    this.member.logged( x => this.login = x, () => this.login = null );
  }

  onClickRegister() {
    this.navCtrl.setRoot( SampleRegisterPage );
  }

  onClickLogout() {
    this.member.logout( () => this.checkLogin() );
  }

}
