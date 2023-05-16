import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { PetService } from '../../pet.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbCarouselConfig, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from 'src/app/services/util/lookup.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUserService } from 'src/app/clinical-users/components/add-user.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.scss'],
  providers: [NgbCarouselConfig]
})

export class ViewPatientComponent implements OnInit {
  public gcpStoragePath = environment.gcpStoragePath;

  @ViewChild('archiveContent') archiveContent: ElementRef;
  @ViewChild('archiveContent2') archiveContent2: ElementRef;
  @ViewChild('archiveContent3') archiveContent3: ElementRef;
  selectedRecordPet: any;
  selectedRecordStudy: any;
  showTabsPage: boolean;
  showNextSlide:boolean;
  addStudyForm: FormGroup;
  activeTab: any;
  patientInfo: boolean = false;
  selectInfo: boolean = false;
  RWFlag: boolean;
  petId: any;
  studyId: any;
  petDetails: any;
  data: any = [];
  dataArchive: any = [];
  pets: any = [];
  list: any = [];
  archList: any = [];
  showPanelist: boolean = true;
  searchText = '';

  // @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  @ViewChild('carouselMain') carouselMain: NgbCarousel;
  @ViewChild('carousel1') carousel1: NgbCarousel;
  @ViewChild('tabset') tabset;
  selectedRow1: any;
  modalRef2: NgbModalRef;
  studyDeName: any;
  studyArr: any;
  isExternalPet: boolean;

  videoPath: any;
  paneUrl: string;
  startIndex: number;
  limit: number;
  count: any;
  ViewPaneSelctedForTabChange: boolean;
  petSelectedFlag: any;
  // private list = [
  //   {
  //     "studyName": "Hill's Team Marvin1",
  //     "startDate": "08/28/2019",
  //     "endDate": "09/28/2019",
  //     "currentstudy": "true"
  //   },
  //   {
  //     "studyName": "Hill's Team Marvin2",
  //     "startDate": "08/28/2019",
  //     "endDate": "09/28/2019"
  //   },
  //   {
  //     "studyName": "Hill's Team Marvin3",
  //     "startDate": "08/28/2019",
  //     "endDate": "09/28/2019"
  //   },
  //   {
  //     "studyName": "Hill's Team Marvin4",
  //     "startDate": "08/28/2019",
  //     "endDate": "09/28/2019"
  //   },
  //   {
  //     "studyName": "Hill's Team Marvin5",
  //     "startDate": "08/28/2019",
  //     "endDate": "09/28/2019"
  //   },
  //   {
  //     "studyName": "Hill's Team Marvin6",
  //     "startDate": "08/28/2019",
  //     "endDate": "09/28/2019"
  //   }
  // ];
 
  ngAfterViewChecked(): void {
    // this.tabset.select('ngb-tab-0');
    // if(this.ViewPaneSelctedForTabChange) {
    //   this.tabset.select('ngb-tab-0');
    // }
    // else {
    //   this.tabset.select('ngb-tab-1');
    // }
}

ngAfterContentChecked() {
  // if(this.petSelectedFlag) {
  // this.tabset.select('ngb-tab-0');
  // this.cdref.detectChanges();
  
  //  }
  }

  backToList() {
    this.router.navigate(['/user/patients']);
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

  disassociate(studyId, studyName) {
    console.log(studyId, studyName);
    this.studyDeName = studyName;
    this.studyId = studyId;
    this.openPopup(this.archiveContent, 'xs');

  }
  deleteStudy() {
    this.spinner.show();
    this.petService.updatePet(`/api/pets/disassociateStudy/${this.petId}/${this.studyId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Study disassociated successfully!');
        // this.router.navigate(['/user/patients']);
        this.modalRef2.close();
        this.ngOnInit();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.modalRef2.close();
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      console.log(err);
      this.errorMsg(err);
      this.modalRef2.close();
    });
  }
  getListOfArchStudies() {
    this.spinner.show();
    //Get Pet details
    this.petService.getPet(`/api/pets/getArchiveStudies/${this.petId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.archList = res.response.petStudy;
        if (this.archList) {
          this.archiveArray(4, this.archList);
        }
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }


  menuId: any;
  isFav: boolean = false;


  constructor(public router: Router,
    private userDataService: UserDataService,
    private petService: PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private cdref: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    config: NgbCarouselConfig,
    private lookupService: LookupService,
    private modalService: NgbModal,
    private tabService: TabserviceService,
    private customDatePipe: CustomDateFormatPipe,
    private adduserservice: AddUserService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    config.interval = 0;
    config.wrap = false;
    sessionStorage.removeItem('viewPetName');
  }


  async ngOnInit() {

    window.addEventListener("isAmObsClick", (event) => {
      this.getObsVideoFromchild();
    });

    window.addEventListener("isAmMedicationClicked", (event) => {
      this.getPetDetailsById();
     });


    //permission for the module
    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.petId = str.split("view/")[1].split("/")[0];
      this.studyId = str.split("view/")[1].split("/")[1];
    })
    await this.getInitialData();
    this.addStudyForm = this.fb.group({
      'studyName': ['', [Validators.required]],
      'studyassDate': [''],
      'isExternalArr': '',
      'isExternal': '',
      'externalPet': '',
      'startDate': '',
      'endDate': '',
      'studyId': ''
    })

    let userProfileData = this.userDataService.getRoleDetails();
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "14") {
        menuActionId = ele.menuActionId;
        this.menuId = ele.menuId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.cardView();
    this.checkFav();
  }

  studyArray(numberOfChunks, inputList) {
    this.data = [];
    var result = inputList.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / numberOfChunks)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item);
      resultArray.forEach(ele => {
        ele.forEach(res => {
          res.startDate = res.startDate ? this.customDatePipe.transform(res.startDate, 'MM-dd-yyyy') : '';
          res.endDate = res.endDate ? this.customDatePipe.transform(res.endDate, 'MM-dd-yyyy') : '';
        })
      })
      this.data = resultArray;
      return resultArray
    }, [])

  }
  archiveArray(numberOfChunks, inputList) {
    this.dataArchive = [];
    var result = inputList.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / numberOfChunks)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      resultArray.forEach(ele => {
        ele.forEach(res => {
          res.startDate = res.startDate ? this.customDatePipe.transform(res.startDate, 'MM-dd-yyyy') : '';
          res.endDate = res.endDate ? this.customDatePipe.transform(res.endDate, 'MM-dd-yyyy') : '';
        })
      })
      this.dataArchive = resultArray;
      return resultArray
    }, [])

  }

  clearSearch() {
    this.searchText = '';
    this.getInitialData();
  }
  searchTextFn(quee) {
    let queryText = quee ? quee : '';
    this.startIndex = 0;
    this.limit = 20;
      
      if(this.startIndex < this.count) {
      this.paneUrl = `/api/pets/getPetViewPane?startIndex=${this.startIndex}&limit=${this.limit}&searchText=${queryText}`;
     // /api/pets/getPetViewPane
     this.spinner.show();
     this.petService.getPet(this.paneUrl, '').subscribe(res => {
      if (res.status.success === true) {
        // this.pets = res.response.pets;
        // this.pets = this.pets.concat(res.response.rows);
        this.pets = res.response.rows;
        this.count = res.response.searchElments;

        
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }


  }

  async getInitialData() {
    await this.getStudy();
    this.spinner.show();
    // get pets pane
    this.startIndex = 0;
    this.limit = 20;
    this.paneUrl = `/api/pets/getPetViewPane?startIndex=${this.startIndex}&limit=${this.limit}&searchText=${this.searchText}`;


    // /api/pets/getPetViewPane
    this.petService.getPet(this.paneUrl, '').subscribe(res => {
      if (res.status.success === true) {
        // this.pets = res.response.pets;
        this.pets = [];
        this.pets = this.pets.concat(res.response.rows);
        this.count = res.response.searchElments;

        // this.getPetDetails();
        this.getPetDetailsById();
        this.getListOfCurrStudies();
        this.getListOfArchStudies();
        this.selectedStudy(this.studyId);
        this.petSelected(this.petId, this.studyId);
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }
  studyCarousel() {

  }
  activeStudy(petStudyId) {
    this.selectedRow1 = petStudyId;
  }
  fetchNews(evt: any) {
    console.log("fetcchh",evt); // has nextId that you can check to invoke the desired function
    

    let active = evt.activeId;
    this.tabset.select(active)
    if(active == 'ngb-tab-0') {
      let selectionStudyId:any;
      if(this.archList && this.archList.length > 0) {
        selectionStudyId = this.archList[0].petStudyId;
        this.selectedStudy(selectionStudyId);
        this.activeStudy(selectionStudyId);
      }
   
    }
    else if(active == 'ngb-tab-1') {
      let selectionStudyId:any;
      if(this.list && this.list.length > 0) {
        selectionStudyId = this.list[0].petStudyId;
        this.selectedStudy(selectionStudyId);
        this.activeStudy(selectionStudyId);
      }
     
    }
  }
  selectedStudy(studyId) {
    console.log("studyId", studyId);
    
    // this.router.navigate(['/user/patients/view', this.petId, studyId]);
    //@@@@@ router for pet charts
    this.router.navigate([`/user/patients/view/${this.petId}/${studyId}/patient-charts`]);
    // this.getPetDetails();
    this.spinner.show();
    // this.getPetDetailsById();
    this.petService.getPet(`/api/pets/getPetDetailsById/${this.petId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.petDetails = res.response.petDTO;
        sessionStorage.setItem('viewPetName', this.petDetails.petName);
        //found this 2 lines out of order
        // this.getListOfCurrStudies();
        // this.getListOfArchStudies();
          //found this 2 lines out of order

        this.reloadData();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }

  getListOfCurrStudies() {
    this.spinner.show();
    //Get Pet details
    this.petService.getPet(`/api/pets/getCurrentStudies/${this.petId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.list = res.response.petStudy;
        if (this.list) {
          this.studyArray(4, this.list);
        }
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }

  async getPetDetailsById() {
    this.spinner.show();
    //Get Pet details
    this.petService.getPet(`/api/pets/getPetDetailsById/${this.petId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.petDetails = res.response.petDTO;
        this.isExternalPet = res.response.petDTO.isExternalPet;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }
  getPetDetails() {
    this.spinner.show();
    //Get Pet details
    this.petService.getPet(`/api/pets/${this.petId}/${this.studyId}`, '').subscribe(res => {
      if (res.status.success === true) {
        this.petDetails = res.response.petDTO;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }

  async petSelected(petId, studyId) {
    console.log("petId", petId, studyId);
    this.selectedRecordPet = petId;
    // this.selectedRecordStudy = studyId;
    this.petId = petId;
    this.studyId = studyId ? studyId : 0;
    this.spinner.show();
    await this.checkFav();
    this.getListOfCurrStudies();
    this.getListOfArchStudies();
  
    // this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}`]);
    this.selectedStudy(this.studyId);
    this.activeStudy(this.studyId);
    this.spinner.hide();
    //for tab to be changed to current studies tab
    // this.tabset.select('ngb-tab-0')
  }

  tabSelection() {
    this.tabset.select('ngb-tab-0');
 //for tab to be changed to current studies tab
    // this.tabset.select('ngb-tab-0')
  }

  private async getStudy() {
    this.spinner.show();
    let res: any = await (
      this.petService.getPet('/api/study/getStudyListByUser', '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (res.status.success === true) {
      this.studyArr = res.response.studyList;
      this.studyArr = this.studyArr.filter(ele => ele.studyId != 2901);
      // this.spinner.hide();
    }
  }
  associatStudy() {
    this.addStudyForm.markAllAsTouched();
    if (this.addStudyForm.valid) {
      let form = this.addStudyForm.value;
      form.studyassDate = this.customDatePipe.transform(form.studyassDate, 'yyyy-MM-dd');

      let res = Object.assign({});
      res["studyId"] = form.studyId;
      res["petId"] = this.petId;
      res["externalPetInfoId"] = form.externalPet ? form.externalPet.externalPetId : '';
      res["assignedOnDate"] = form.studyassDate; 

      this.spinner.show();
      this.petService.addPet('/api/pets/associateNewStudy', res).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Study associated successfully!');
          this.modalRef2.close();
          this.ngOnInit();
          // this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}/patient-client-info`]);
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
        this.errorMsg(err);
      });
    }

  }
  clearStudy() {
    this.addStudyForm.controls.studyassDate.setValidators([]);
    this.addStudyForm.controls.studyassDate.updateValueAndValidity();
    this.addStudyForm.patchValue({
      'studyassDate': ''
    })
  }
  studySelected($event) {
    console.log('event', $event);
    console.log('event.isExternal', $event.isExternal);
    let selectedExternal = false;
    if($event.isExternal == 1) {
      selectedExternal = true;
    }
    this.addStudyForm.patchValue({
      'startDate': $event.startDate ? this.customDatePipe.transform($event.startDate, 'MM-dd-yyyy') : '',
      'endDate': $event.endDate ? this.customDatePipe.transform($event.endDate, 'MM-dd-yyyy') : '',
      'studyId': $event.studyId ? $event.studyId : ''
    })
    this.spinner.show();

    this.adduserservice.getStudy(`/api/pets/getExternalPetInfoList/${$event.studyId}`, '').subscribe(res => {
      let externalPetArr = [];
      let isExternal: boolean = false;
      if (res.response) {
        externalPetArr = res.response;
        isExternal = true
      }
      else {
        externalPetArr = [];
        isExternal = false
      }
      if (externalPetArr.length > 0) {
        this.addStudyForm.patchValue({
          "isExternalArr": externalPetArr,
          "isExternal": isExternal
        })
      }else{
        this.addStudyForm.patchValue({
          "isExternalArr": [],
          "isExternal": false
        })
      }

      let isExternalStudyExist = this.list.filter((v, i, a) => a.findIndex(t => (t.externalStudy === true)) === i);

      const isVirtualStudyExist  = this.list.some(value => value['studyName'] === 'Virtual Study');
        
        if(this.list.length > 0){
           if(!isVirtualStudyExist){
            if(this.list.length > 0 && (
              ( !selectedExternal && isExternalStudyExist.length > 0 ) 
              || (selectedExternal && isExternalStudyExist.length == 0 ))) {
    
                this.toastr.error("A pet cannot be associated with internal and external studies simultaneously.");
                this.addStudyForm.patchValue({
                  "studyName": '',
                  "isExternalArr":'',
                  "isExternal": false
                }); 
            }
           }
        }
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );
  }
  addPet() {
    this.addStudyForm.patchValue({
      'studyName': '',
      'studyassDate': '',
      'isExternalArr': '',
      'isExternal': '',
      'externalPet': '',
      'startDate': '',
      'endDate': '',
      'studyId': ''
    });
    this.addStudyForm.markAsUntouched();
    if (this.petDetails.petStatus != "Deceased") {
      this.openPopup(this.archiveContent2, 'lg');
    }
    else {
      this.toastr.error("Cannot associate study for a deceased pet.");
    }
  }
  removeStudy() {
    this.tabService.clearDataModel();
    this.router.navigate([`/user/patients/edit-patient/${this.petId}/pet-study`]);
  }
  showTabs($event) {
    console.log("$event", $event);
    this.showTabsPage = $event.show;
    this.activeTab = $event.tabId;
  }
  showSlider($event) {
    console.log("$event in slider", $event.tab);
    if($event.tab == "observations") {
      this.showNextSlide = true
    }
   else {
    this.showNextSlide = false
   }
    // this.showSliderPage = $event.show;
    // this.activeTab = $event.tabId;
  }
  back() {
    this.showTabsPage = false;
  }
  tabView() {
    this.showTabsPage = true;
  }
  cardView() {
    this.showTabsPage = false;
  }

  showPatientInfo() {
    if (this.patientInfo == true) {
      this.patientInfo = false;
    } else {
      this.patientInfo = true;
    }
  }

  showSelectPatient() {
    if (this.selectInfo == true) {
      this.selectInfo = false;
    } else {
      this.selectInfo = true;
    }
  }

  public reloadData() {
    this.showPanelist = false;
    setTimeout(() => {
      this.showPanelist = true;
    }, 1);
  }

  editPetPage() {
    this.tabService.clearDataModel();
    this.router.navigate([`/user/patients/edit-patient/${this.petId}/pet-info`]);
  }
  async checkFav() {
    //check favorite
    this.isFav = false
    this.lookupService.getFavInfo(`/api/favourites/isFavourite/${this.menuId}/${this.petId}`).subscribe(res => {
      if (res.response.favourite.isFavourite)
        this.isFav = true;
    });
  }
  makeFav() {
    this.spinner.show();
    this.lookupService.addasFav(`/api/favourites/${this.menuId}/${this.petId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.isFav = true;
        this.toastr.success('Added to Favorites');
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    },
      err => {
        this.errorMsg(err);
      }
    );
  }

  removeFav() {
    this.spinner.show();
    this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.petId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.isFav = false;
        this.toastr.success('Removed from Favorites');
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    },
      err => {
        this.errorMsg(err);
      }
    );
  }
  errorMsg(err) {
    this.spinner.hide();
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
  }

  getObsVideoFromchild() {
    let observationData = this.tabService.getModelData2();
    this.videoPath = observationData.videoURL;
    this.openPopup(this.archiveContent3, 'xs');
  }

  download(fileUrl) {
    let headers = { "Content-Type": "application/json" };
    let file = fileUrl;
    if(fileUrl.split(",").length > 0){
      file =  fileUrl.split(",")[0];
    }
    let body =  {"mediaUrl": file.toString()};
    
    
    this.spinner.show();
    this.http.post(environment.baseUrl + `/api/pets/downloadPetMedia`, body, {
      responseType: 'arraybuffer', headers
    }).subscribe(response => {
      let newFile = file.toString().split("?")[0].split("%2F");
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

  // downLoadFile(data: any, type: string) {
  //   let blob = new Blob([data], { type: type });
  //   let url = window.URL.createObjectURL(blob);
  //   let a: any = document.createElement("a");
  //   a.style = "display: none";
  //   a.href = url;
  //   a.download = "observation_media.zip";
  //   a.click();
  //   let pwa = window.URL.revokeObjectURL(url);
  // }
  

  downloadvideo($event){
    this.download(this.videoPath);
  }

  currentIndex(index) {
    console.log('currentIndex', index);
  }

  myFunction() {
   
    let myDiv= document.getElementById("content")
  
    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
    
      console.log("end reached ");
      this.startIndex = this.startIndex + 20;
      this.limit = 20;
      
      if(this.startIndex < this.count) {
      this.paneUrl = `/api/pets/getPetViewPane?startIndex=${this.startIndex}&limit=${this.limit}&searchText=${this.searchText}`;
     // /api/pets/getPetViewPane
     this.spinner.show();
     this.petService.getPet(this.paneUrl, '').subscribe(res => {
      if (res.status.success === true) {
        // this.pets = res.response.pets;
        this.pets = this.pets.concat(res.response.rows);
        this.count = res.response.searchElments;

      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }

    }
  }

}
