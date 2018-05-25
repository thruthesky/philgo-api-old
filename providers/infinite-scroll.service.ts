/**
 * @file inifite-scroll.service.ts
 * @desc 이 파일을 복사해서 사용하면 된다.
 * @example 다음은 사용 예제이다.

 export class PostListComponent implements AfterViewInit, OnDestroy {

    // 페이지가 로딩 중인지 아닌지 표시.
    loader = {
        page: false
    };

    // inifite scroll subscription
    subscription: Subscription = null;

    //
    constructor(  public scroll: InfiniteScrollService ) { ... }

    // section.post-list 는 원하는 데로 변경하면 된다.
    ngAfterViewInit() {
        this.subscription = this.scroll.watch('section.post-list', 400).subscribe(e => this.loadPage());
    }

    // subscription 해제
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // 페이지를 로드. 현재 로딩 중이면, 그냥 리턴한다.
    loadPage() {
        console.log('loadPage()', this.option);
        if (this.loader.page) {
            return;
        }
        this.loader.page = true;
        this.api.postList(this.option).subscribe(res => {
            this.loader.page = false;
            this.option.page_no++;
            console.log('postList(): res: ', res);
            if (res.posts && res.posts.length) {
                for (const post of res.posts) {
                    this.re.idxes.push(post.idx);
                    this.re.posts[post.idx] = post;
                }
            }
        }, e => {
            this.loader.page = false;
            console.log(e);
        });
    }
 *
 *
 */
import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, filter } from 'rxjs/operators';

@Injectable()
export class InfiniteScrollService {
    scrollCount = 0;
    scrollCountOnDistance = 0;
    constructor() {

    }
    /**
     *
     * @attention - distance 거리에서는 이벤트가 계속 발생하므로, 이 함수를 사용하는 코드에서 적절히 사용해야 한다.
     *      예를 들면, 게시판 글을 무한 로딩한다면, 아래와 같이 하면 된다.
     *          (1) 로딩 중이 아니면,
     *          (2) 로딩 중이라고 표시하고, (페이지를 1 증가하고,) 다음 페이지를 로딩한다.
     *          (3) 로딩이 끝나면, 로딩 중이 아니라고 표시한다.
     *
     *
     * @param selector - 어떤 element 를 스크롤 할 지 선택한다.
     * @param distance - bottom 으로 부터 얼마나 거리를 둘지, 그 거리 내에 들어가면 scroll 이벤트를 발생 시킬지를 결정한다.
     *
     *
     * @return Observable
     */
    watch(selector: string, distance: number = 300): Observable<any> {

        const element = document.querySelector(selector);
        if (element === void 0 || !element) {
            console.log('element: ', element);
            console.error('No element to watch on scrolling. Wrong query selector.');
            return;
        }

        return fromEvent(document, 'scroll')        // 스크롤은 window 또는 document 에서 발생.
            .pipe(
                debounceTime(100),
                map(e => {
                    this.scrollCount++;
                }),
                filter(x => {
                    if (element['offsetTop'] === void 0) {
                        // @attention this is error handling for some reason,
                        // especially on first loading of each forum,
                        // it creates "'offsetTop' of undefined" error.
                        return false;
                    }
                    const elementHeight = element['offsetTop'] + element['clientHeight'];
                    const windowYPosition = window.pageYOffset + window.innerHeight;
                    // console.log("page scroll reaches at bottom: windowYPosition="
                    // + windowYPosition + ", elementHeight-distance=" + (elementHeight-distance));

                    if (windowYPosition > elementHeight - distance) { // page scrolled. the distance to the bottom is within 200 px from
                        this.scrollCountOnDistance++;
                        // console.log( "scrollCountOnDistance", this.scrollCountOnDistance );

                        return true;
                    }
                    return false;
                })
            );
    }
}

