import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

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
import { PetService } from 'src/app/patient/pet.service';
import { AssetsService } from 'src/app/assets/components/assets.service';

@Component({
  selector: 'app-view-support-material',
  templateUrl: './view-support-material.component.html',
  styleUrls: ['./view-support-material.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewSupportMaterialComponent implements OnInit {
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

  statusFilter: any = '';
  studyfilterValue: any = '';

  pagination: any = {
    page: 1,
    totalElements: 10,
    noOfElements: 10
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
  @ViewChild('archiveContent4') archiveContent4: ElementRef;
  @ViewChild('deleteSupportMaterial') deleteSupportMaterial: ElementRef;
  spinnerFlag: boolean = false;
  paginationFlag: boolean;
  playVideoUrl: any = '';
  playImgUrl: any;
  materialType: string;
  supportMaterialId: string;
  supportMaterialDetails = [];
  viewFilterAray = [];
  viewForm: FormGroup;
  viewData: FormArray;
  selectedContent: any = '';
  materialTypeList: any = [];
  materialCategoryList: any = [];
  materialSubCategoryList: any = [];
  assetTypes: any = [];
  deviceModelList: any = [];
  categoryFilter = 0;
  subCategoryFilter = 0;
  assetFilter = '';
  assetModelFilter = '';
  isSubCategoryExist: boolean;
  headers: any;

  supportDetailsItem: any;

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
    private assetsService: AssetsService
  ) {
    this.rolesForm = this.fb.group(
      {
        // petName: [''],
        // petType: [''],
        // study: [''],
        // permission: [],
        permissionMap: this.fb.array([])
      });
    this.viewForm = this.fb.group(
      {
        viewData: this.fb.array([])
      });
  }

  async ngOnInit() {
    if (this.materialType == 'FAQs') {
      this.headers = [
        { key: "titleOrQuestion", label: "QUESTION", checked: true },
        { key: "urlOrAnswer", label: "ANSWER", checked: true },
        { key: "categoryName", label: "CATEGORY", checked: true },
        { key: "subCategoryName", label: "SUB CATEGORY", checked: true },
        { key: "assetType", label: "ASSET TYPE", checked: true },
        { key: "assetModel", label: "ASSET MODEL", checked: true },
      ];
    }

    this.supportMaterialDetails = [];
    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.materialType = str.split("view/")[1].split("/")[0];
      this.materialType = this.materialType.replace(/%20/g, " ");
      console.log("materialType", str.split("view/")[1].split("/")[0])
      this.supportMaterialId = str.split("view/")[1].split("/")[1];
    })



    this.filterTypeArr =
      [{
        name: "Material Type",
        id: "materialType"
      },
      {
        name: "Category",
        id: "category"
      },
      {
        name: "Asset Type",
        id: "assetType"
      },
      {
        name: "Asset Model",
        id: "assetModel"
      }
      ];

    this.assetsService.getAssetsService('/api/lookup/getMaterialTypeList').subscribe(res => {
      if (res.status.success === true) {
        this.materialTypeList = res.response.materialTypes;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

    this.assetsService.getAssetsService('/api/lookup/getMaterialCategoryList').subscribe(res => {
      if (res.status.success === true) {
        this.materialCategoryList = res.response.materialCategories;
        this.materialCategoryList = this.materialCategoryList.filter(data => data.parentId == 0);
        this.materialSubCategoryList = res.response.materialCategories.filter(data => data.parentId > 0);
        console.log(this.materialSubCategoryList);

      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });




    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "35") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    await this.loadAssetLookup();
    await this.loadViewData();
  }
  async loadAssetLookup() {
    this.assetsService.getAssetsService('/api/assets/getDeviceTypesAndModels').subscribe(res => {
      if (res.status.success === true) {
        this.assetTypes = res.response.deviceTypes;
        this.deviceModelList = res.response.deviceModels;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }


  createItem() {
    return this.fb.group({
      video: [''],
      checkBox: false,
      Url: "",
      thumbnail: "",
      fileSize: "",
      title: [''],
      category: [''],
      subcategory: [''],
      assetModel: [''],
      assetType: [''],
      fileName: [''],
      createdDate: [''],
      modifiedDate: [''],
      urlOrAnswer: [''],
      supportMaterialId: [''],
      supportDetailsId: [''],
      videoDuration: ''
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
      fileSize: ""
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

  loadViewData() {
    console.log(this.statusFilter)

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
    };
    //this.filterFlag = true;
    this.paginationFlag = true;

    let params = `?startIndex=${data.startIndex}&limit=${data.limit}&sort=name&order=DESC&searchText=${data.searchText}&filterType=${data.filterType}&filterValue=${data.filterValue}
    &categoryId=${this.categoryFilter}
    &subCategoryId=${this.subCategoryFilter}
    &assetType=${this.assetFilter.trim()}
    &assetModel=${this.assetModelFilter.trim()}
    `;
    if (this.categoryFilter > 0 || this.subCategoryFilter > 0 || this.assetFilter.trim() != '' || this.assetModelFilter.trim() != '') {
      this.filterFlag = true;
    } else {
      this.filterFlag = false;
    }
    this.spinner.show();
    this.lookupService.getCommon('/api/supportMaterial/getMaterialDetailsListById/' + this.supportMaterialId + params).subscribe(res => {
      console.log(res);
      this.supportMaterialDetails = res.response.rows;
      this.pagination.totalElements = res.response.totalElements;
      this.pagination.searchElments = res.response.searchElments;

      this.viewData = this.viewForm.get('viewData') as FormArray;
      this.viewData['controls'] = [];

      this.supportMaterialDetails.forEach((ele, i) => {
        this.viewData.push(this.createItem());

        ele.modifiedDate = this.customDatePipe.transform(ele.modifiedDate, 'MM/dd/yyyy');

        this.viewForm.controls.viewData['controls'][i].patchValue({
          title: ele.titleOrQuestion ? ele.titleOrQuestion : '',
          materialTypeName: ele.materialTypeName ? ele.materialTypeName : '',
          category: ele.categoryName ? ele.categoryName : '',
          subcategory: ele.subCategoryName ? ele.subCategoryName : '',
          thumbnail: ele.thumbnailUrl ? ele.thumbnailUrl : '',
          assetModel: ele.assetModel ? ele.assetModel : '',
          assetType: ele.assetType ? ele.assetType : '',
          fileSize: ele.size ? this.getSize(ele.size) : '',
          fileName: ele.uploadedFileName ? ele.uploadedFileName : '',
          createdDate: ele.createdDate ? ele.createdDate : '',
          modifiedDate: ele.modifiedDate ? ele.modifiedDate : '',
          urlOrAnswer: ele.urlOrAnswer ? ele.urlOrAnswer : '',
          supportMaterialId: ele.supportMaterialId ? ele.supportMaterialId : '',
          supportDetailsId: ele.supportDetailsId ? ele.supportDetailsId : '',
          videoDuration: ''
        });
      });

      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

  }
  reset() {
    this.categoryFilter = 0;
    this.subCategoryFilter = 0;
    this.assetFilter = '';
    this.assetModelFilter = '';
    this.loadAssetLookup();
    this.loadViewData();
  }
  searchText(query) {
    if (query == undefined) {
      this.query = "";
    }
    this.pagination.page = 1;
    this.loadViewData();

  }

  pageChanged() {
    // this.selectAll = false;
    this.loadViewData();
    $('.page-wrapper').scrollTop(0);
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

  downloadPop(value) {
    console.log(value);
    this.selectedContent = value;
    this.openPopup(this.archiveContent, 'xs');
  }
  downloadFile() {
    const a = document.createElement('a')
    a.href = this.selectedContent.urlOrAnswer;
    a.target = '_blank';
    a.download = this.selectedContent.fileName;
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
    }, 100);
  }

  downLoadBlob(data: any, type: string, fileName) {
    console.log("data", data);
    console.log("type", type);
    let blob = new Blob([data], { type: type });
    console.log("blob", blob);
    let url = window.URL.createObjectURL(blob);
    console.log("url", url);
    let a: any = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = this.selectedContent.fileName;
    a.click();
    let pwa = window.URL.revokeObjectURL(url);
  }

  playVideo(data) {
    console.log(data);
    this.selectedContent = data;
    this.openPopup(this.archiveContent3, 'xs');
  }

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
  edit(data) {
    console.log(data);
    this.router.navigate([`/user/support-material/edit/${data.supportDetailsId}`]);
  }
  delete(data: any) {
    this.supportDetailsItem = data;
    this.openPopup(this.deleteSupportMaterial, 'xs');
  }
  deleteSupportDetailsRec() {
    this.spinner.show();
    this.lookupService.deleteSupport(`/api/supportMaterial/${this.supportDetailsItem.supportDetailsId}`).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success(res.response.message);
        this.loadViewData();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
      this.modalRef2.close();
    }, err => {
      this.spinner.hide();
      this.modalRef2.close();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });
  }
  backToList() {
    this.router.navigate([`/user/support-material/`]);
  }
  onCategoryFilter() {
    this.subCategoryFilter = 0;
    this.assetFilter = '';
    this.assetModelFilter = '';
    this.loadAssetLookup();
  }
  onSubCategoryFilter() {
    this.assetFilter = '';
    this.assetModelFilter = '';
  }
  getDuration(e, data) {
    let duration = e.target.duration;
    duration = (Math.trunc(duration * 100000) / 100000).toFixed(1);
    console.log(duration);
    let h = Math.floor(duration / 3600).toString().padStart(2, '0'),
      m = Math.floor(duration % 3600 / 60).toString().padStart(2, '0'),
      s = Math.floor(duration % 60).toString().padStart(2, '0');
    console.log(h, m, s);
    h = (h == '00') ? '' : (h + 'h ');
    m = (m == '00') ? '' : (m + 'm ');
    s = (s == '00') ? '' : (s + 's');
    duration = h + m + s;
    data.patchValue({ videoDuration: duration });
    //data.videoDuration = duration;
  }

  getSize(bytes) {
    if (bytes && bytes === 0) return '';
    const k = 1024;
    const dm = 1 < 0 ? 0 : 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  changeDeviceType() {
    this.spinner.show();
    this.assetsService.getAssetsService(`/api/assets/getDeviceModelById/${this.assetFilter.trim()}`).subscribe(res => {
      if (res.status.success === true) {
        let deviceModalList = res.response.rows.filter(data => data.deviceModel != 'Other');
        if (deviceModalList && deviceModalList.length > 0) {
          let list = [];
          deviceModalList.forEach(element => {
            list.push(element.deviceModel);
          });
          this.deviceModelList = list;
          this.assetModelFilter = '';
        }
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
}
