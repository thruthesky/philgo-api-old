import { Component, OnInit, Input } from '@angular/core';
import {
    ApiPhoto, PhilGoApiService, ApiFileUploadOptions,
    ApiErrorFileNotSelected, ApiErrorFileUploadError
} from '../../../providers/philgo-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-data-component',
    templateUrl: 'data.component.html',
    styles: [`
    .files { display: flex; flex-wrap: wrap; }
    .files .file { position: relative; width: 33.33%; max-width: 150px; max-height: 150px; overflow: hidden; }
    .files .file img { width: 100%; height: auto; }
    .files .file .delete {
        position: absolute;
        top: 4px;
        right: 4px;
        padding: 4px;
        border-radius: 2px;
        background-color: rgba(255, 255, 255, .8);
        color: black;
        font-size: 8pt;
        cursor: pointer;
    }
    `]
})

export class DataComponent implements OnInit {
    @Input() files: Array<ApiPhoto>;
    @Input() editable = false;
    @Input() percentage = 0;
    constructor(
        public api: PhilGoApiService
    ) { }

    ngOnInit() { }

    onClickDelete(idx) {
        console.log('delete: ', idx);
        this.api.deleteFile(parseInt(idx, 10)).subscribe(res => {
            console.log('res: ', res);
            const i = this.files.findIndex(file => file.idx === idx);
            this.files.splice(i, 1);
        }, e => alert(e.message));
    }

    fileUploadOnWeb(options: ApiFileUploadOptions) {
        this.api.fileUploadOnWeb(event.target['files'], options).subscribe(re => {
            // console.log(event);
            if (typeof re === 'number') {
                // console.log(`File is ${re}% uploaded.`);()
                this.percentage = re;
            } else if (re['code'] && re['idx'] === void 0) {
                console.log('error: ', re);
                alert('file upload error');
            } else if (re['idx'] !== void 0 && re['idx']) {
                // console.log('file upload success: ', re);
                this.files.push(re);
                this.percentage = 0;
            }
        }, (e: HttpErrorResponse) => {
            // console.log('error subscribe: ', e);
            if (e.error instanceof Error) {
                alert('Client-side error occurred.');
            } else {
                // console.log(err);
                if (e.message === ApiErrorFileNotSelected) {
                    console.log('file is not selected');
                } else if (e['code'] !== void 0 && e['code'] === ApiErrorFileUploadError) {
                    console.log('File upload error:', e.message);
                } else {
                    console.log('FILE TOO LARGE' + e.message);
                }
            }
            console.log('file upload failed');
        });
    }
}


