import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Member } from './member';
import { SampleHomePage } from '../sample-pages/home/home';
import { SampleLoginPage } from '../sample-pages/login/login';
import { SampleRegisterPage } from '../sample-pages/register/register';


export let ROUTES = [
        { path: "test/philgo/home", component: SampleHomePage, name: 'philgoHome' },
        { path: "test/philgo/login", component: SampleLoginPage, name: 'philgoLogin' },
        { path: "test/philgo/register", component: SampleRegisterPage, name: 'philgoRegister' }
];


@NgModule({
  declarations : [
    SampleHomePage,
    SampleLoginPage,
    SampleRegisterPage
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule
  ],

  entryComponents: [
   SampleHomePage,
   SampleLoginPage,
   SampleRegisterPage
  ],
  providers : [ Member ]
})


export class PhilgoApiModule {}