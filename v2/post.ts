import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { Api } from './api';




@Injectable()
export class Post extends Api {

    constructor( http: Http, private storage: Storage ) {
        super( http );
    }

    /**
     * Returns forum list
     * 
     * @code example code
        this.post.getForums( data => {
            console.log(data);
        }, e => {
            console.log('getForum() error: ', e);
        });
     * @code
     */
    getForums( successCallback: (data: any) => void, errorCallback?: (error: string) => void ) {
        console.log('getForums()');
        // check if it has cached data.
        let url = this.getUrl('forums');
        console.log('url:', url);
        this.http.get( url )
            .subscribe( re => {
                console.log('re: ', re);
                try {
                    let data = JSON.parse( re['_body'] );
                    successCallback( data );
                }
                catch( e ) {
                    errorCallback('json-parse-error');
                }
            });
    }

}