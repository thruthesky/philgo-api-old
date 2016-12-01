import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Post } from './post';
import { Member } from './member';

import { SampleHomePage } from '../sample-pages/home/home';
import { SampleLoginPage } from '../sample-pages/login/login';
import { SampleRegisterPage } from '../sample-pages/register/register';
import { SamplePostPage } from '../sample-pages/post/post';

export let ROUTES = [
        { path: "test/philgo/home", component: SampleHomePage, name: 'philgoHome' },
        { path: "test/philgo/login", component: SampleLoginPage, name: 'philgoLogin' },
        { path: "test/philgo/register", component: SampleRegisterPage, name: 'philgoRegister' },
        { path: "test/philgo/post", component: SamplePostPage, name: 'philgoPost' }
];

@NgModule({
  declarations : [
    SampleHomePage,
    SampleLoginPage,
    SampleRegisterPage,
    SamplePostPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule
  ],
  providers : [ Member, Post ]
})


export class PhilgoApiModule {}