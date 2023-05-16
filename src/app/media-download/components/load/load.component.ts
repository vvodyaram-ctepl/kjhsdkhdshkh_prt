import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadComponent implements OnInit {
  imgUrl: any;
  VideoUrl: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    if (this.router.url.includes('/user/media/load?mediaType=')) {
      this.route.queryParams.subscribe(params => {
        if (params.mediaType && params.filePath) {
          this.downloadNew(params);
        }
        else {
          this.toastr.error("Please provide both file name and media type to download");
        }
      });
    }
  }

  downloadNew(fileParams) {
    this.spinner.show();
    let encodedFilePath = encodeURIComponent(fileParams.filePath);
    this.http.get(environment.baseUrl + `/api/analyticalReports/getPreludeMediaSignedUrl?mediaType=${fileParams.mediaType}&filePath=${encodedFilePath}`).subscribe((res: any) => {

      if (res.response.signedUrl) {
        let newFile = res.response.signedUrl.toString().split("?")[0].split("/");
        let fileName = newFile[newFile.length - 1];

        if (fileName.toString().includes("mp4")) {
          this.VideoUrl = res.response.signedUrl;
          this.imgUrl = '';
        }
        else {
          this.imgUrl = res.response.signedUrl;
          this.VideoUrl = '';
        }
        // let pwa = window.URL.revokeObjectURL(res.response.signedUrl);
      }
      else {
        this.toastr.error("Cannot Download the File", 'Error!')
      }

      this.spinner.hide()
    }, err => {
      console.log(err);
      this.spinner.hide()
    },)
  }

}