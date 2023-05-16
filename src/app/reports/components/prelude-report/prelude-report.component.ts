import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { environment } from 'src/environments/environment';
import { ReportsService } from '../../reports.service';

@Component({
  selector: 'app-prelude-report',
  templateUrl: './prelude-report.component.html',
  styleUrls: ['./prelude-report.component.scss']
})
export class PreludeReportComponent implements OnInit {

  headers: any;
  modalRef2: NgbModalRef;
  filterTypeArr: any[];
  showDataTable: boolean = false;
  downloadUrl: any = [];
  extractName: any = '';
  @ViewChild('archiveContent') archiveContent: ElementRef;

  constructor(
    public router: Router,
    public customDatePipe: CustomDateFormatPipe,
    private userDataService: UserDataService,
    private reportsService: ReportsService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.showDataTable = true;
    this.headers = this.getHeaders();
    this.filterTypeArr =
    [
      {
        name: "Study",
        id: "preludeStudy"
      },
      {
        name: "Category",
        id: "preludeCategory"
      }
    ];
  }

  getHeaders() {
    return [
      { key: "studyName", label: "Study", checked: true },
      // { key: "category", label: "Category", checked: true },
      { key: "extractName", label: "Extract Name", checked: true },
      { key: "extractDate", label: "Date", checked: true },
      { key: "static", label: "", clickable: true, checked: true, width: 150}
    ];
  }

  formatter($event) {
    console.log($event);
    $event.forEach(ele => {
      ele.extractDate = this.customDatePipe.transform(ele.extractDate, 'MM/dd/yyyy');
      ele.static = `<div class="btn btn-primary mt-1 mb-1 px-2 py-1" title="download">Download</div>`});
  }

  getNode($event) {
    console.log($event);
    let action : any = $event.event.target.title;

    this.extractName = $event.item.extractName;
    if(action == 'download'){
      // this.router.navigate(['', $event.item.extractFileUrl]);
      this.downloadUrl = $event.item.extractFileUrl;
      this.openPopup(this.archiveContent, 'xs');
    }
  }


  openPopup(div, size) {
    console.log('div :::: ', div);
    this.modalRef2 = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
    this.modalRef2.result.then((result) => {
      console.log(result);
    }, () => {
    });
  }

  downloadT() {
    /*
    // let pet = this.petName;
    // console.log("petName", pet);
    // console.log("this.rolesForm.value", this.rolesForm.value);
    this.downloadUrl.forEach(ele => {
     // if (ele.petName == pet) {
        //check the checkboxes ticked
        let checkBoxArr = [];
        // ele.permissionMap1.forEach(res => {
        //   if (res.checkBox == true) {
        //     checkBoxArr.push(res.Url)
        //   }
        // });
        // ele.permissionMap2.forEach(res => {
        //   if (res.checkBox == true) {
        //     checkBoxArr.push(res.Url)
        //   }
        // });
        // console.log("checkBoxArr", checkBoxArr);

        checkBoxArr.push(ele);
        
        if (checkBoxArr.length > 0) {
          let checkBoxlist = [];
          checkBoxArr.forEach(ele => {
            if (ele.includes("mp4")) {
              ele = 'https://storage.cloud.google.com/wearables-ap-prelude' + ele
              checkBoxlist.push(ele);
            }
            else {
              ele = 'https://storage.cloud.google.com/wearables-ap-prelude' + ele
              checkBoxlist.push(ele);
            }
          });
          this.download(checkBoxlist);
        
      }
    })
    */
    let fileURL: any = [];
    fileURL.push(this.downloadUrl);
    console.log(fileURL);
    this.download(fileURL);
  }

  download(fileUrl) {
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

  downLoadFile(data: any, type: string, fileName) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let a: any = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = fileName;
    a.click();
    let pwa = window.URL.revokeObjectURL(url);
  }

}
