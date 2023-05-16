import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SupportService } from 'src/app/support/support.service';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {
  dataArr: any = [];
  id: any;
  RWFlag: boolean;
  displayEdit: boolean = true;
  uploadArr: any[];
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private supportService: SupportService,
    private customDatePipe: CustomDateFormatPipe,
    private userDataService:UserDataService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
     //permission for the module
     let userProfileData = this.userDataService.getRoleDetails();
     console.log("userProfileData", userProfileData);
     let menuActionId = '';
     userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "37") {
        menuActionId = ele.menuActionId;
       }
     });
     if (menuActionId == "3" || menuActionId == "4") {
       this.RWFlag = true;
     }

    if (this.router.url.indexOf('/view') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      this.id = str.split("view/")[1].split("/")[0];
      this.spinner.show();
      this.supportService.getSupportService(`/api/support/details/${this.id}`).subscribe(res => {
        if (res.status.success) {
          this.dataArr = res.response.customerSupport;
         this.uploadArr = [];
              this.dataArr.uploadedFiles && this.dataArr.uploadedFiles.forEach(ele =>
                {
                  this.uploadArr.push({originalFileName:ele.originalFileName,gcFileName:ele.gcFileName,attachmentId:ele.attachmentId,url:ele.url});
                })
          this.dataArr.ticketCreatedDate = this.customDatePipe.transform(this.dataArr.ticketCreatedDate, 'MM/dd/yyyy HH:mm:ss');
          this.dataArr.studyStartDate = this.customDatePipe.transform(this.dataArr.studyStartDate, 'MM/dd/yyyy');
          this.dataArr.studyEndDate = this.customDatePipe.transform(this.dataArr.studyEndDate, 'MM/dd/yyyy');
          if (this.dataArr.status == 'Closed') {
            this.displayEdit = false;
          }
        } else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      },
        err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        }
      );
    }
  }

  next() {
    this.router.navigate([`/user/support/view/${this.id}/ticket-history`]);
  }
  backToList() {
    this.router.navigate(['/user/support']);
  }
  editCustomerSupport() {
    this.router.navigate([`/user/support/edit/${this.id}`]);
  }
  viewFile(list) {
    // let reqObject = Object.assign({});
    // reqObject["attachmentId"] = parseInt(list.attachmentId);
    let fileName = list.gcFileName.toString().split(".");
    this.supportService.getSupportService(`/api/fileUpload/getFileUrlByName/${fileName[0]}`).subscribe(res => {
      this.spinner.show();
      if (res.status.success === true) {
        this.spinner.hide();
        // this.toastr.success(`File ${this.id} updated successfully!`);
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }

  download(fileUrl, fileName, gcFileName) {
    // let headers = { "Content-Type": "application/json" };
    // this.supportService.get(`/api/pets/downloadPetMedia?mediaUrl=${fileUrl.toString()}`, {
    //   responseType: 'arraybuffer', headers: headers
    // }).subscribe(response => this.downLoadFile(response, "application/zip", fileName), err => {
    //   console.log(err);
    // })

    let headers = { "Content-Type": "application/json" };
    let body =  {"mediaUrl": fileUrl.toString()};
    this.spinner.show();
    this.http.post(environment.baseUrl + `/api/pets/downloadPetMedia`, body, {
      responseType: 'arraybuffer', headers
    }).subscribe(response => {
      // this.downLoadFile(response, "application/zip");
      let newFile = fileUrl.toString().split("?")[0].split("/");
      let fileName = newFile[newFile.length - 1];
      this.downLoadFile(response, "application/${extension}",fileName );
      this.spinner.hide()
    }, err => {
      console.log(err);
      this.spinner.hide()
    },)
  }

  downLoadFile(data: any, type: string, fileName: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let a: any = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = fileName;
    a.click();
    let pwa = window.URL.revokeObjectURL(url);
  }

 /* async download(fileUrl, fileName) {
    console.log('url', fileUrl);
    console.log('fileName', fileName);
    return await fetch('http://www.thewowstyle.com/wp-content/uploads/2015/01/nature-images.jpg',
    {
      method: 'GET', 
      mode: 'no-cors', // no-cors, *cors, same-origin
      //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        //'Content-Type': 'application/json',
        'Content-Type': "application/force-download",
        //"Content-Type": "application/octet-stream",
        //"Content-Type": "application/download",
        "Content-Disposition": `attachment; filename=${fileName}`,
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      //redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'unsafe-url' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    .then(res =>{
      debugger;
      return res.blob()
    })
    .then((blob) => {
        debugger;
        console.log(' blob size ',blob.size);
        saveAs(blob, fileName);
    });

    
    /*  const fileStream = streamSaver.createWriteStream(fileName.trim())

    fetch(fileUrl, {method: 'GET', mode: "no-cors"}).then(res => {
      const readableStream = res.body;
      console.log(readableStream);
      if (this.windowContext.WritableStream && readableStream.pipeTo) {
        return readableStream.pipeTo(fileStream)
          .then(() => console.log('done writing'))
      }
      this.windowContext.writer = fileStream.getWriter()
      const reader = res.body.getReader()
      const pump = () => reader.read().then(res => res.done ? this.windowContext.close() : this.windowContext.write(res.value).then(pump))
      pump()
    }) */
/*
  } */

}
