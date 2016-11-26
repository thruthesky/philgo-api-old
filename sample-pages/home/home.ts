import { Component } from '@angular/core';
import { Member, USER_LOGIN_DATA } from '../../v2/member';
import { SampleLoginPage } from '../login/login';
import { SampleRegisterPage } from '../register/register'
@Component({
  templateUrl: 'home.html'
})

export class SampleHomePage {
  login: USER_LOGIN_DATA = <USER_LOGIN_DATA> {};
  constructor( private member: Member ) {
    console.log(member);
    member.version( v => console.log('version: ', v) );
    this.checkLogin();
  }

  checkLogin() {
    this.login = this.member.logged();
  }

  onClickRegister() {
  }

  onClickLogin() {
  }

  onClickLogout() {
    this.member.logout();
    this.checkLogin();
  }
  onClickProfile() {
  }

}
