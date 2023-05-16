import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { PetService } from '../../pet.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-view-patient-cards',
  templateUrl: './view-patient-cards.component.html',
  styleUrls: ['./view-patient-cards.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewPatientCardsComponent implements OnInit {
  RWFlag: boolean = false;
  public gcpStoragePath = environment.gcpStoragePath;
  @Output() showTabs = new EventEmitter();
  @Output() showSlider = new EventEmitter();
  @Input() petId: any;
  @Input() studyId: any;
  petParents: any;
  petDevices: any;
  petNotes: any;
  petObservations: any;
  externalPetArr: any;
  // pagination: any = {
  //pagination for pet parent info
  parentPage = 1;
  parentpageSize = 1;
  //pagination for devices
  devPage = 1;
  devpageSize = 1;
  petCampaignPoints: any;

  obsVideopath: any = {};
  playVideoUrl: any = '';
  playImgUrl: any = '';
  modalRef2: NgbModalRef;
  @ViewChild('observationElement') observationElement: ElementRef;
  @ViewChild('observationImageEle') observationImageEle: ElementRef;
  
  
  // };
  constructor(
    public router: Router,
    private userDataService: UserDataService,
    private petService: PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private tabService: TabserviceService,
    private modalService: NgbModal,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == 21 && ele.menuActionId == 3) {
        this.RWFlag = true;
      }
    });
    this.getInitialData();
    this.spinner.hide();
  }

  addNotesPage() {
    this.router.navigate([`/user/patients/pet-notes-info/${this.petId}/${this.studyId}`]);
  }

  tabsView($event) {
    console.log("$event", $event);
    let res = Object.assign({});
    res.show = true;
    if ($event == 'petparentInfo') {
      res.tab = 'petparentInfo'
      res.tabId = 1;
      this.showTabs.emit(res);
      this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}/patient-client-info`]);
    }
    else if ($event == 'devices') {
      res.tab = 'devices'
      res.tabId = 2;
      this.showTabs.emit(res);
      this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}/patient-device-details`]);
    }
    else if ($event == 'reports') {
      res.tab = 'reports'
      res.tabId = 3;
      this.showTabs.emit(res);
      this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}/patient-charts`]);
    }
    else if ($event == 'observations') {
      res.tab = 'observations'
      res.tabId = 3;
      this.showTabs.emit(res);
      this.showSlider.emit(res);
      this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}/patient-observations`]);
    }
    else if ($event == 'notes') {
      res.tab = 'notes'
      res.tabId = 4;
      this.showTabs.emit(res);
      this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}/patient-notes`]);
    }
    else if ($event == 'campaign') {
      res.tab = 'campaign'
      res.tabId = 4;
      this.showTabs.emit(res);
      this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}/campaign-points`]);
    }
  }

  formatUSPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '+1 ');
      return [intlCode, ' ', '(', match[2], ')', match[3], '-', match[4]].join('');
    }
    return null;
  }
  formatUKPhoneNumber(phoneNumber) {
    let phoneNumberArr = phoneNumber.toString().split(/44(.+)/);
    let genPh = phoneNumberArr[1]
    // return phoneNumberArr[1].replace(/\s+/g, '').replace(/(.)(\d{4})(\d)/, '+44 $1 - $2 - $3');
    let newString = '+44' + ' ' + genPh.substr(0, 2) + '-' + genPh.substr(2, 4) + '-' + genPh.substr(6, 4);
    return newString
}

  getInitialData() {
    this.spinner.show();
    //  Get Pet Parents
    this.petService.getPet(`/api/pets/getPetDetailsById/${this.petId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.petParents = res.response.petDTO.petParents;
        //format mobile number
        this.petParents && this.petParents.forEach(ele => {
          let phoneNumber = ele.phoneNumber;
          if(phoneNumber) {
            phoneNumber = phoneNumber.replace(/ /g, "");
            let desired = phoneNumber.replace(/[^\w\s]/gi, '');
            phoneNumber = desired;
            
          if(desired.startsWith("44")) {
            phoneNumber = this.formatUKPhoneNumber(phoneNumber);
          }
          else {
            phoneNumber = this.formatUSPhoneNumber(phoneNumber);
          }
          ele.phoneNumber = phoneNumber;
          }
        

        })
        // Get Notes
        this.petNotes = res.response.petDTO.petNotes;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
    //  Get Asset details
    this.petService.getPet(`/api/pets/getPetDevicesByStudy/${this.petId}/${this.studyId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.petDevices = res.response.rows;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });

    // Get pet observations
    this.petService.getPet(`/api/pets/getPetObservations?petId=${this.petId}&studyId=${this.studyId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.petObservations = res.response.rows;
        
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });

    //get campaign points
    this.petService.getPet(`/api/pets/getPetCampaignPoints/${this.petId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.petCampaignPoints = res.response;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });



    this.petService.getPet(`/api/pets/getExternalPetInfo?petId=${this.petId}&studyId=${this.studyId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.externalPetArr = res.response.externalPetInfoListDTOList;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });

  }

  playVideo(obsVideo){
    this.obsVideopath = obsVideo;
    this.tabService.setModelData2(this.obsVideopath);
    let evt = document.createEvent("Event");
      evt.initEvent("isAmObsClick", true, true);
      window.dispatchEvent(evt);
  }
  playObservation(data){
    if(data.videoList && data.videoList.length > 0){
      this.openPopup(this.observationElement, 'xs');
      this.playVideoUrl = data.videoList[0];
    }else{
      this.openPopup(this.observationImageEle, 'xs');
      this.playImgUrl = data.imageList[0];
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
  }
  downloadvideo(url){
    this.download(url);
  }
  videoPath(videoPath: any) {
    throw new Error('Method not implemented.');
  }

  download(fileUrl) {
    let headers = { "Content-Type": "application/json" };
    let body =  {"mediaUrl": fileUrl.toString()};
    let newFile = fileUrl.toString().split("?")[0].split("%2F");
    
    this.spinner.show();
    this.http.post(environment.baseUrl + `/api/pets/downloadPetMedia`, body, {
      responseType: 'arraybuffer', headers
    }).subscribe(response => {
      let newFile = fileUrl.toString().split("?")[0].split("%2F");
      let fileName = newFile[newFile.length - 1];
      let fileNameArr = fileName.split("/");
      let newFileName = fileNameArr[fileNameArr.length - 1]
      this.downLoadFile(response, "application/${extension}",newFileName );
      this.spinner.hide()
    }, err => {
      console.log(err);
      this.spinner.hide()
    })
     
  }

  downLoadFile(data: any, type: string , fileName) {
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
