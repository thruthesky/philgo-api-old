
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
//\import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { HomePage } from './sample-pages/home/home';
import { LoginPage } from './sample-pages/login/login';
import { Member } from './member';
import { RegisterPage } from './sample-pages/register/register';
import { Query } from './query';

@NgModule({
  declarations : [
    HomePage,
    LoginPage,
    RegisterPage
  ],
  imports: [ 
    HttpModule,
    JsonpModule,
    
  IonicModule  ],

  entryComponents: [
   HomePage,
   LoginPage,
   RegisterPage
  ],
  providers : [ 
    Member,
    Query
     ]
})


export class PhilgoModule {}
