
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
//\import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HomePage } from './sample-pages/home/home';
import { LoginPage } from './sample-pages/login/login';
import { PhilgoBase } from './philgo-base';


@NgModule({
  declarations : [
    HomePage,
    LoginPage
  ],
  imports: [ 
    HttpModule,
  IonicModule  ],

  entryComponents: [
   HomePage,
   LoginPage
  ],
  providers : [ 
    PhilgoBase
     ]
})


export class PhilgoModule {}
