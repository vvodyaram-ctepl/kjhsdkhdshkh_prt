import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PetService } from '../../pet.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { saveAs } from 'file-saver';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService } from 'src/app/services/util/lookup.service';
import * as moment from 'moment';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-observations',
  templateUrl: './patient-observations.component.html',
  styleUrls: ['./patient-observations.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PatientObservationsComponent implements OnInit {
  public baseurl = environment.baseUrl;
  public gcpStoragePath = environment.gcpStoragePath;
  barcodeScr: string;
  modalRef2: NgbModalRef;
  petId: any;
  studyId: any;
  petObservations: any = [];
  RWFlag: boolean = false;
  checkBox: any;
  public rolesForm: FormGroup;
  permissionMap: FormArray;
  imageMap: FormArray;
  videoMap: FormArray;
  showNavigationArrow:boolean = false;

  statusFilter: any = '';
  studyfilterValue: any = '';

   //pagination for pet parent info
   parentPage = 1;
   parentpageSize = 1;

  pagination: any = {
    page: 1,
    totalElements: 10,
    noOfElements: 5
  };
  sortByColumn: any;
  sortDirection: any;
  defaultColumn: any;
  query: any;
  filterType: string = '';
  filterValue: any = '';
  filterTypeArr: { name: string; id: string; }[];
  filterdrop: boolean;
  FilterFlag: boolean = false;//filtering
  filterDropdown: boolean = true;
  filterValArr: any[];
  filterStatusArr: any[];
  endDate: any;
  startDate: any;
  studyList: any;
  filterFlag: boolean = false;
  petName: any;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  @ViewChild('archiveContent3') archiveContent3: ElementRef;
  @ViewChild('observationImageEle') archiveContent4: ElementRef;
  spinnerFlag: boolean = false;
  paginationFlag: boolean;
  playVideoUrl: any = '';
  playImgUrl: any;
  showNavigationArrowsM: boolean= false;

  constructor(
    private petService: PetService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private userDataService: UserDataService,
    private fb: FormBuilder,
    private lookupService: LookupService,
    private customDatePipe: CustomDateFormatPipe,
    private http: HttpClient,
  ) {
    this.rolesForm = this.fb.group(
      {
        // petName: [''],
        // petType: [''],
        // study: [''],
        // permission: [],
        permissionMap: this.fb.array([])
      })
  }

  async ngOnInit() {

    this.filterTypeArr =
      [{
        name: "Study",
        id: "Study"
      },
      {
        name: "Status",
        id: "Status"
      },
      {
        name: "Observation Date",
        id: "dateType"
      }
      ];

    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "27") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    let url = 'https://storage.cloud.google.com/wearables-sensor-data-pr/PROD/GCloud/WPortal/MPPhoto/riverdale-veterinary-dermatology-annual-plan.jpg';
    this.barcodeScr = url;

    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      if (str.split("user/patients/view/")[1] != undefined) {
        this.petId = str.split("user/patients/view/")[1].split("/")[0];
        this.studyId = str.split("user/patients/view/")[1].split("/")[1];
      }
      // this.petId = str.split("view/")[1].split("/")[0];
      // this.studyId = str.split("view/")[1].split("/")[1];
    })

    await this.getInitialData();
    // await this.addItem();
  }

  // createItem() {
  //   return this.fb.group({
  //     // parentMenuName: [''],
  //     // parentMenuId: [''],
  //     ImgMenu: this.fb.array([]),
  //     VidMenu: this.fb.array([])
  //   })
  // }
  onCheckboxChange($event, i, pet) {
    console.log("$event", $event);
    console.log("$event", i);
    // if($event.target.checked == true) {
    this.rolesForm.value.permissionMap.forEach(ele => {
      if (ele.petName == pet) {
        //check the checkboxes ticked
        let checkBoxArr = [];
        ele.imageMap.forEach(res => {
          if (res.checkBox == true) {
            checkBoxArr.push(res.fileSize)
          }
        });
        ele.videoMap.forEach(res => {
          if (res.checkBox == true) {
            checkBoxArr.push(res.fileSize)
          }
        });
        console.log("checkBoxArr", checkBoxArr);
        let sumOfCheck = 0;
        if (checkBoxArr) {
          checkBoxArr.forEach(ele => {
            sumOfCheck = sumOfCheck + ele;
          })
        }
        let fileType = "Kb"
        if (sumOfCheck > 1024) {
          fileType = "Mb"
        }
        else {
          fileType = "Kb"
        }
        this.rolesForm.controls.permissionMap['controls'][i].patchValue({
          "display": sumOfCheck > 0 ? true : false,
          "filSizeArr": sumOfCheck + " " + fileType
        });

      }
    })
    // }
  }
  createItem() {
    return this.fb.group({
      //not rqured
      petName: [''],
      photoName: [''],
      petType: [''],
      study: [''],
      petStatus:[''],
      petStatusId:[''],
      filSizeArr: 0,
      display: false,
        //not rqured
      activityType:[''],
      observationText:[''],
      observationTime:[''],
      imageMap: this.fb.array([]),
      videoMap: this.fb.array([])
    })
  }

  createSubMenuVid() {
    return this.fb.group({
      checkBox: false,
      Url: "",
      thumbnail: "",
      fileSize: ""
    })
  }
  createSubMenuImg() {
    return this.fb.group({
      checkBox: false,
      Url: "",
      fileSize: "",
      videoUrl:""
    })
  }

  async addItem() {

  }

  startdateSelect() {
    console.log("sdsdsd");
    if (moment(this.endDate) < moment(this.startDate)) {
      this.endDate = "";
    }
  }

  getInitialData() {
    this.spinner.show();


      this.filterStatusArr = [
        {
          name: "Off Study",
          id: "1"
        },
        {
          name: "On Study",
          id: "2"
        },
        {
          name: "Deceased",
          id: "3"
        }
      ]

    // Get pet observations
    if (this.petId) {
      this.loadResults();
      // this.petService.getPet(`/api/pets/getPetObservationMedia/${this.petId}`, '').subscribe(res => {
      //   if (res.status.success === true) {
      //     this.petObservations = res.response.rows;
      //     let imgArr = [];
      //     let vidArr = [];
      //     this.petObservations.forEach(ele => {
      //       //for images
      //       let imgs = ele.imagePath;
      //      imgArr = imgs.toString().split(",");
      //      ele['imageList'] = imgArr;
      //      //for videos
      //      let videos = ele.videoURL;
      //      vidArr = videos.toString().split(",");
      //      ele['videoMap'] = vidArr;
      //     })


      //     console.log("this.petObservations", this.petObservations);
      //     this.petObservations.forEach((ele, i) => {
      //       this.permissionMap = this.rolesForm.get('permissionMap') as FormArray;
      //       this.permissionMap.push(this.createItem());

      //       this.rolesForm.controls.permissionMap['controls'][i].patchValue({
      //         "petName": ele.petName ? ele.petName : '',
      //         "petType": ele.breedName ? ele.breedName : '',
      //         "study": ele.studyNames ? ele.studyNames : ''
      //       });

      //       // img map loop
      //       ele.imageList.forEach((res, j) => {

      //         this.imageMap = this.rolesForm.get('permissionMap')['controls'][i].get('imageMap') as FormArray;
      //         this.imageMap.push(this.createSubMenuImg());
      //         this.rolesForm.get('permissionMap')['controls'][i].get('imageMap')['controls'][j].patchValue({
      //           'checkBox': false,
      //           'Url': res
      //         });
      //       });

      //       //video map loop
      //       ele.videoMap.forEach((res, j) => {
      //         this.videoMap = this.rolesForm.get('permissionMap')['controls'][i].get('videoMap') as FormArray;
      //         this.videoMap.push(this.createSubMenuVid());
      //         this.rolesForm.get('permissionMap')['controls'][i].get('videoMap')['controls'][j].patchValue({
      //           'checkBox': false,
      //           'Url': res
      //         });
      //       });


      //     });

      //   }
      //   else {
      //     this.toastr.error(res.errors[0].message);
      //   }
      //   this.spinner.hide();
      // }, err => {
      //   this.spinner.hide();
      //   this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      // });
    }
    else {

      // Get pet observations
      this.loadResults()
    }
  }
  reset() {
    this.query = '';
    this.filterType = '';
    this.filterValue = '';
    this.studyfilterValue = '';
    this.statusFilter = '';
    this.startDate = '';
    this.endDate = '';
    this.FilterFlag = false;
    this.pagination.page = 1;
    this.pagination.noOfElements = 5;
    this.loadResults();
  }
  searchText(query) {
    if (query == undefined) {
      this.query = "";
    }
    this.pagination.page = 1;
    this.loadResults();

  }
  changeField($event) {
    console.log($event);
    this.filterValArr = [];
    this.filterValue = "";
    this.startDate = "";
    this.endDate = "";

    if (this.filterType == "") {
      this.filterValArr = [];
      this.FilterFlag = false;
      this.filterValue = "";
    }
    else {
      this.FilterFlag = true;
      if (this.filterType == "Status") {
        this.filterdrop = true;
        this.filterValue = "";
        this.filterValArr = [
          {
            name: "Off Study",
            id: "1"
          },
          {
            name: "On Study",
            id: "2"
          },
          {
            name: "Deceased",
            id: "3"
          }
        ]
      }
      else if (this.filterType == "Study") {
        // this.filterdrop = true;
        // this.filterValue = "";
        this.filterdrop = false;
        this.filterValArr = this.studyList;
      }
      else if (this.filterType == "dateType") {
        this.filterdrop = false;
        this.filterValue = "";
      }
    }
  }
  changedInput($event) {
    console.log("You entered: ", $event.target.value);
    this.pagination.page = 1;
    this.loadResults();
  }
  loadResults() {
    this.spinner.show();
    this.lookupService.getCommon('/api/study/getAllStudyList').subscribe(res => {
      if (res.status.success === true) {
        this.studyList = res.response.studyList;
      } else {
        this.toastr.error(res.errors[0].message);
      }
      // this.spinner.hide();
    }, err => {
      // this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

    if (this.filterType == 'dateType' || this.filterType == 'questionnaireDate') {
      if (this.endDate === '' || this.startDate === '') {
        this.toastr.error("Please select start and end dates.");
        return false;
      }
    }
    // this.spinner.show();
    this.spinnerFlag = true;
    this.petObservations = [];
    this.rolesForm.reset();
    console.log("this.rolesForm", this.rolesForm.value)
    this.permissionMap = this.rolesForm.get('permissionMap') as FormArray;

    this.permissionMap.controls = [];

    let startIndex =
      this.pagination.page === 1
        ? 0
        : this.pagination.page * this.pagination.noOfElements -
        this.pagination.noOfElements;
    this.pagination.noOfElements = this.pagination.noOfElements
      ? this.pagination.noOfElements
      : 5;

    var data = {
      startIndex: startIndex,
      endIndex: this.pagination.totalItems
        ? this.pagination.totalItems <
          Number(startIndex) + Number(this.pagination.noOfElements)
          ? this.pagination.totalItems
          : Number(startIndex) + Number(this.pagination.noOfElements)
        : Number(startIndex) + Number(this.pagination.noOfElements),
      limit: this.pagination.noOfElements,
      sortByColumn: this.sortByColumn ? this.sortByColumn : this.defaultColumn,
      // sortDirection: this.sortDirection ? this.sortDirection : this.dir,
      searchText: this.query ? this.query.trim() : '',
      filterType: this.filterType ? this.filterType : '',
      filterValue: this.filterValue ? this.filterValue : '',
      status: this.statusFilter ? this.statusFilter : '',
      study: this.studyfilterValue ? this.studyfilterValue.studyName : '',
      startDate: this.startDate ? this.customDatePipe.transform(this.startDate, 'yyyy-MM-dd') : '',
      endDate: this.endDate ? this.customDatePipe.transform(this.endDate, 'yyyy-MM-dd') : ''
    };

    if (data.startDate || data.searchText || data.filterValue) {
      this.filterFlag = true;
    }
    else {
      this.filterFlag = false;
    }
    if (this.filterType == "Study") {
      data.filterValue = this.filterValue ? this.filterValue.studyName : '';
    }
    let observationUrl = '';
    if (this.petId) {
      // this.paginationFlag = false;
      this.paginationFlag = true;
      // /api/pets/${this.petId}/${this.studyId}/getPetObservations
      observationUrl = `/api/pets/getPetObservations`;
    }
    else {
      this.paginationFlag = true;
      observationUrl = `/api/pets/getPetObservations`;
    }
    if(this.query || this.statusFilter || this.studyfilterValue || this.startDate || this.endDate) {
      this.filterFlag = true;
    }
    else {
      this.filterFlag = false;
    }

  let userId = this.userDataService.getUserId();

    


    this.petService.getPet(`${observationUrl}?startIndex=${data.startIndex}&limit=${data.limit}&sortBy=&order=DESC&searchText=${data.searchText}&filterType=${data.filterType}&filterValue=${data.filterValue}&startDate=${data.startDate}&endDate=${data.endDate}&status=${data.status}&study=${data.study}&petId=${this.petId}&studyId=${this.studyId}&roleTypeId=1&isSuper=true&userId=${userId}
    `, '').subscribe(res => {

      if (res.status.success === true) {
        this.pagination.totalElements = res.response.totalElements;
        this.pagination.searchElments = res.response.searchElments;

        this.petObservations = res.response.rows;

        this.petObservations.forEach(ele => {
          let imgArr = [];
          let vidArr = [];
          let vthumbnailArr = [];
          let imagePath = []; //main
        
        if (ele.imagePath) {
          let imgs = ele.imagePath;
          console.log("imgs", imgs.toString().split(","))
          // imgArr = imgs.toString().split(",");
          imgArr = ele.imageList;
        }
        if (ele.videoURL) {
          // let videos = ele.videoURL;
          // let videoThumbnail = ele.videoThumbnailURL ? ele.videoThumbnailURL :'';
          // vidArr = videos.toString().split(",");
          
        }

       
        ele.videoThumbnailList ? ele.videoThumbnailList.forEach((element, index) => {
          // if(element == ' ') {
          ele.videoThumbnailList[index] =  element;//['assets/images/no-video.png'];
          // }
        }) : [];
      
        // vthumbnailArr = ele.videoThumbnailList ? ele.videoThumbnailList : [];

        // vthumbnailArr =   ['assets/images/no-video.png']

        // let newimgArr = imgArr.concat(['assets/images/no-video.png']); //this one should be used // devi 

        // let newimgArr = imgArr.concat(ele.videoThumbnailList);
        let newimgArr = imgArr;


imagePath.push({"imageUrl": newimgArr , "videoURL": ele.videoList})


ele['imagePath']= imagePath;

// ele.imagePath.forEach(res => {
  console.log("errerer",ele['imagePath'])
  console.log("petObservations",this.petObservations)
// })
// alert(imgArr)
if(imgArr.length > 0)
ele['showNavigationArrow'] = true;
else 
ele['showNavigationArrow'] = false;
        })

        

      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinnerFlag = false;
      this.spinner.hide();
    }, err => {
      this.spinnerFlag = false;
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  pageChanged() {
    // this.selectAll = false;
    this.loadResults();
    $('.page-wrapper').scrollTop(0);
  }

  download(fileUrl) {
    let headers = { "Content-Type": "application/json" };
    let body =  {"mediaUrl": fileUrl.toString()};
    
console.log("fileUrl",fileUrl)
let newData = fileUrl.toString().split("?")[0].split(".");
let extension = newData[newData.length - 1];
console.log("extension",extension);

    this.spinner.show();
    this.http.post(environment.baseUrl + `/api/pets/downloadPetMedia`, body, {
      responseType: 'arraybuffer', headers
    }).subscribe(response => {
      if(fileUrl.length > 1) {
      this.downLoadFile(response, "application/zip", 'observation_media.zip');
    }
    else {
      let newFile = fileUrl.toString().split("?")[0].split("%2F");
      console.log("newFile",newFile);
      let fileName = newFile[newFile.length - 1];
      console.log("fileName",fileName);
      let fileNameArr = fileName.split("/");
      let newFileName = fileNameArr[fileNameArr.length - 1]
      this.downLoadFile(response, "application/${extension}",newFileName );
    }
      this.spinner.hide()
    }, err => {
      console.log(err);
      this.spinner.hide()
    })
  }

  downLoadFile(data: any, type: string , fileName) {
    console.log("data",data);
    console.log("type",type);
    let blob = new Blob([data], { type: type });
    console.log("blob",blob);
    let url = window.URL.createObjectURL(blob);
    console.log("url",url);
    let a: any = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = fileName;
    a.click();
    let pwa = window.URL.revokeObjectURL(url);
  }

  downloadSingleFile(data, fileNames) {
console.log("data[0]",data[0])
let str =  data[0]
let newData = str.split("?")[0].split("%2F");
let newDatalast = newData[newData.length - 1];
console.log("newDatalast",newDatalast)

    fetch(data[0])
      .then(function (response) {
        return response.blob();
      })
      .then(function (blob) {
        let url = window.URL.createObjectURL(blob);
        let a: any = document.createElement("a");
        a.style = "display: none";
        console.log("url",url);
        console.log("fileNames[0]",newDatalast);

        a.href = url;
        a.download = newDatalast;
        a.click();
        window.URL.revokeObjectURL(url);
      });
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

  downloadPop(pet, fileSize) {
    this.petName = pet;
    if (fileSize == '0Kb' || fileSize == '0') {
      this.toastr.error("Please select a file to download");
    }
    else if (fileSize == '300Mb') {
      this.toastr.error("Please select files less than 300 Mb");
    }
    else {
      this.openPopup(this.archiveContent, 'xs');
    }
    console.log("fileSize", fileSize)

  }
  downloadT() {
    let pet = this.petName;
    console.log("petName", pet);
    console.log("this.rolesForm.value", this.rolesForm.value);
    this.rolesForm.value.permissionMap.forEach(ele => {
      if (ele.petName == pet) {
        //check the checkboxes ticked
        let checkBoxArr = [];
        ele.imageMap.forEach(res => {
          if (res.checkBox == true) {
            checkBoxArr.push(res.Url)
          }
        });
        ele.videoMap.forEach(res => {
          if (res.checkBox == true) {
            checkBoxArr.push(res.Url)
          }
        });
        console.log("checkBoxArr", checkBoxArr);
        if (checkBoxArr.length > 0) {
          let checkBoxlist = [];
          checkBoxArr.forEach(ele => {
            if (ele.includes("mp4")) {
              checkBoxlist.push(ele);
            }
            else {
              // ele = this.gcpStoragePath + 'ObservationPhoto/' + ele
              checkBoxlist.push(ele);
            }
          });
          if (checkBoxlist.length == 1) {
            this.download(checkBoxlist);
          }
          else
            this.download(checkBoxlist);
        }
      }
    })
  }

  playVideo(videoPath) {
    console.log(videoPath);
    // if(videoPath) {
    this.openPopup(this.archiveContent3, 'xs');
    this.playVideoUrl = videoPath;
  // }
  }

  playImg(videoPath) {
    console.log(videoPath);
    this.openPopup(this.archiveContent4, 'xs');
    this.playImgUrl = videoPath;
  }

  
  downloadvideo() {
    let downloadfile = this.playVideoUrl;
    this.download([downloadfile]);
  }
  downloadImage() {
    let downloadfile = this.playImgUrl;
    // this.download(downloadfile);
    fetch(downloadfile)
    .then(function (response) {
      return response.blob();
    })
    .then(function (blob) {
      let url = window.URL.createObjectURL(blob);
      let a: any = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = downloadfile;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}

