import { Component } from '@angular/core';
import { Member, USER_LOGIN_DATA } from '../../v2/member';
import { SampleRegisterPage } from '../register/register';
import { SampleHomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class SampleLoginPage {

  process : { loader?; error?; } = {};
  loginData: USER_LOGIN_DATA = <USER_LOGIN_DATA> {};
  constructor(private member: Member) { }

  onClickLogin() {
    this.process = { 'loader' : true };
      this.member.login( this.loginData, ( login: USER_LOGIN_DATA ) => {
        alert('Login success !');
      },
      e => {
        this.process = { 'error' : e };
      });
  }
  onClickRegister() {
    alert('move page');
  }



}


