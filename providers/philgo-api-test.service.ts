import { Injectable } from '@angular/core';
import { PhilGoApiService, ApiCurrencyResponse, ApiCurrencyRequest } from './philgo-api.service';


@Injectable()
export class PhilGoApiTestService {
    constructor(
        public api: PhilGoApiService
    ) {
        console.log('* PhilGoApiTestService::constructor()');
        console.log('* url: ', this.api.getServerUrl());
    }
    run() {
        console.log('** run()');
        // this.testQuery();
        this.testRegisterLoginUpdate();
    }
    setUrl(url: string) {
        this.api.setServerUrl(url);
        return this;
    }
    good(msg?) {
        console.log(' ----> GOOD: ', msg);
    }
    bad(msg?) {
        console.log(' ====> BAD: ', msg);
    }
    test(re, msg) {
        if (re) {
            this.good(msg);
        } else {
            this.bad(msg);
        }
    }
    testQuery() {
        console.log('*** testQuery()');
        this.api.query<ApiCurrencyRequest, ApiCurrencyResponse>('exchangeRate', { currency: 'php' })
            .subscribe(re => {
                this.test(re.php, 'Got PHP currency');
                this.test(re.usd === void 0, 'No USD currency');
            }, e => console.log(e));
    }

    testRegisterLoginUpdate() {
        console.log('*** testRegisterLoginUpdate()');
        const id = 'test' + Math.round((new Date).getTime() / 1000);
        const email = id + '@test.com';
        const password = email + ',*';
        this.api.register({
            email: email,
            password: password,
            name: 'NameB',
            nickname: 'Nick' + id,
            mobile: '0123456789'
        })
            .subscribe(user => {
                // console.log('user: ', user);
                this.api.getSessionId();
                this.test(user.session_id, `User session id is truty. sessionId: ${user.session_id}`);
                this.test(user.session_id === this.api.getSessionId(), 'register success');

                this.api.profile().subscribe(profile => {
                    // console.log('profile: ', profile);
                    this.test(parseInt(profile.idx, 10), 'Profile idx: ' + profile.idx);
                    const newName = 'NewName' + Math.round((new Date).getTime() / 1000);
                    this.api.profileUpdate({ name: newName, mobile: '0102343232' }).subscribe(newProfile => {
                        console.log('profileUpdate: newProfile: ', newProfile);
                        this.api.logout();
                        this.test(this.api.getSessionId() === null, 'logged out');
                        this.api.login({ email: email, password: password }).subscribe(login => {
                            console.log('login: ', login);
                            this.test(login.idx, 'Login success');
                            this.api.profile().subscribe(updateProfile => {
                                console.log('profile: ', updateProfile);
                                this.test(updateProfile.name === newName, `name is updated: ${updateProfile.name}`);
                            });
                        }, e => this.bad(e.message));
                    });
                });


            });
    }

}
