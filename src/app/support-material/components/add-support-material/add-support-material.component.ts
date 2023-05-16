import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgxSpinnerService } from 'ngx-spinner';
import { AssetsService } from 'src/app/assets/components/assets.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService } from 'src/app/support/support.service';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-add-support-material',
  templateUrl: './add-support-material.component.html',
  styleUrls: ['./add-support-material.component.scss']
})
export class AddSupportMaterialComponent implements OnInit {

  headers: any;
  validType: any;
  submitFlag: boolean = false;
  file: any;
  filterTypeArr: any[];
  RWFlag: boolean;
  selectedItem: any = '';
  selectedFile: any;
  public showDataTable: boolean = false;
  selectable: object = {
    title: '',
    selectAll: true
  };
  selectedRecordsEvent: any;
  isUpload: boolean;
  supportForm: FormGroup;
  assetTypes: any;
  deviceModelList: any;
  materialTypeList: any;
  materialCategoryList: any;
  materialSubCategoryList: any;
  arr: any;
  modelList: any;
  form: FormArray;
  uploadedFiles: any = [];
  allFiles: any = [];
  fileFormat: string = '';
  fileResultArray: any = [];

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private assetsService: AssetsService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private supportservice: SupportService,
    private alertService: AlertService,
    private afStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.supportForm = this.fb.group({
      form: this.fb.array([this.createMainItem()])
    });
    this.supportForm.patchValue({ category: '', materialType: 1 });
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "17") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "assetType", label: "Asset Type", checked: true },
      { key: "assetModel", label: "Asset Model", checked: true },
      { key: "materialType", label: "Document Type", checked: true },
      { key: "documentDescription", label: "Asset Location", checked: true },
      { key: "uploadedFileNames", label: "Manufacturer Serial Number", checked: true }
    ];
    this.filterTypeArr =
      [{
        name: "Study",
        id: "Study"
      },
      {
        name: "Device Type",
        id: "deviceType"
      }
      ];
    this.loadLookupData();

  }

  createItem() {
    // moment().format("MM-DD-YYYY")
    return this.fb.group({
      // faqQuestion: [''],
      // faqAnswer: ['']
      faqQuestion: ['', [Validators.required]],
      faqAnswer: ['', [Validators.required]],
    })
  }
  createMainItem() {
    // moment().format("MM-DD-YYYY")
    return this.fb.group({
      assetType: [''],
      assetModel: [''],
      materialType: ['', [Validators.required]],
      title: ['',[ValidationService.exceptSpecialChar]],
      file: [''],
      category: ['', [Validators.required]],
      subcategory: [''],
      arr: this.fb.array([this.createItem()])
    })
  }

  addItem(mainINdex) {
    // supportForm.get('form')['controls'][i].get('arr')['controls']
    this.arr = this.supportForm.get('form')['controls'][mainINdex].get('arr') as FormArray;
    this.arr.push(this.createItem());
  }
  // this.arr = this.pointForm.get('pointTrackerSubscribed')['controls'][i].get('arr') as FormArray;
  // this.arr.push(this.createSub());

  // removeItem(i: number) {
  //   this.arr = this.supportForm.get('arr') as FormArray;
  //   this.arr.removeAt(i);
  //   console.log(this.supportForm.value.arr[i]);

  // }

  removeItem(i, j) {
    this.arr = this.supportForm.get('form')['controls'][i].get('arr') as FormArray;
    this.arr.removeAt(j);
  }

  addMainItem() {
    this.form = this.supportForm.get('form') as FormArray;
    console.log(this.form);
    if(this.form.value && this.form.value.length >= 10){
      this.toastr.error('Cannot add more than 10 Materials at a time.');
       return;
    }
    this.form.push(this.createMainItem());

    this.arr = this.supportForm.get('arr') as FormArray;
    console.log(this.arr)

  }

  removeMainItem(i: number) {
    this.arr = this.supportForm.get('form') as FormArray;
    this.arr.removeAt(i);
  }


  loadLookupData() {
    this.spinner.show();

    this.assetsService.getAssetsService('/api/lookup/getMaterialTypeList').subscribe(res => {
      if (res.status.success === true) {
        this.materialTypeList = res.response.materialTypes;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.spinner.hide();
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

    this.assetsService.getAssetsService('/api/assets/getAllAssetTypes').subscribe(res => {
      if (res.status.success === true) {
        this.assetTypes = res.response.assetTypeList.filter(data => data.deviceType != 'Other');
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

    this.spinner.hide();
  }

  formatter($event) {
    console.log($event);
    if ($event.length == 0) {
      this.showDataTable = false;
    }
    $event.forEach(ele => {
      ele.id = ele.rnum;
      if (ele.exceptionMsg && ele.exceptionMsg.trim() != '') {
        ele.exceptionMsg = ele.exceptionMsg.replace(/ *, */g, ',<br>')
        ele.disabled = true;
      }
      if (ele.isActive == true) {
        ele.isActive = "Active";
        ele['columnCssClass']['isActive'] = "active-status";
      } else {
        ele.isActive = "Inactive";
        ele['columnCssClass']['isActive'] = "inactive-status";
      }
    });
  }

  selectedRecords($event) {
    console.log("$event", $event);
    this.selectedRecordsEvent = $event;
  }
  backToList() {
    this.router.navigate(['/user/support-material']);
  }
  async selectFileResult(event, index) {
    console.log("event fired for", event);
    if (event.length == 0) {
      console.log("sghdshd");
      return false;
    }
    this.allFiles.length = this.supportForm.value.form.length;

    if (event.length > 0) {
      this.allFiles.splice(index, 1, event);
    }
  }
  async uploadTemplate() {
    if (this.selectedFile && this.selectedFile.length == 0) {
      this.toastr.error('Please select a valid file for uploading.', 'Error!');
      return;
    }
    let formData = new FormData();
    this.selectedFile && this.selectedFile.forEach(element => {
      formData.append("file", element);
    });
    formData.append("moduleName", 'SupportMaterial');
    this.spinner.show();
    let data = await this.assetsService.bulkUpload('/api/fileUpload/bulkUpload', formData).toPromise();
    if (data.response && data.response.length > 0) {
      return data.response;
    } else {
      return [];
    }
    
  }

  reloadDataTable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 500);
  }
  back() {
    this.router.navigate(['/user/assets/management']);
  }

  changeDeviceType(value) {
    this.spinner.show();
    this.assetsService.getAssetsService(`/api/assets/getDeviceModelById/${value}`).subscribe(res => {
      if (res.status.success === true) {
        this.modelList = res.response.rows.filter(data => data.deviceModel != 'Other');
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

  async addSupportMaterial() {

    console.log(this.supportForm)


    console.log(this.allFiles);
    this.supportForm.markAllAsTouched();
    if (this.supportForm.invalid) {
      return;
    }
    this.submitFlag = true;

    let titleArray = [];
    this.supportForm.value.form.forEach((element, index) => {
      if(element.materialType == 1 || element.materialType == 3){
        let reqObject = Object.assign({});
        reqObject['materialTypeId'] = element.materialType ? element.materialType : '';
        reqObject['title'] = element.title ? element.title : '';
        titleArray.push(reqObject);
      }
    });
    if(titleArray.length > 0){
      const uniqueValues = new Set(titleArray.map(v => v.title));
      if(uniqueValues.size < titleArray.length){
        this.toastr.error('Duplicate title cannot be allowed.');
        return; 
      }
      this.spinner.show();
      let result = await this.validateTitle(titleArray);
      if(result && result.error && result.error != ''){
        this.spinner.hide();
        this.toastr.error(result.error);
        return;
      }
    }
    console.log(this.supportForm);
    this.spinner.show();
    if(this.allFiles.length > 0){
      for (let index = 0; index < this.allFiles.length; index++) { //All files comes here in single array
        const files = this.allFiles[index];
        let fileResultArray = [];
        for (let index2 = 0; index2 < files.length; index2++) { //each section wise uploaded files comes here.
          const elem = files[index2];
          const materialTypeName = this.materialTypeList.find(x => x.materialTypeId === this.supportForm.value.form[index]['materialType']).materialTypeName;

          const timestamp = Math.floor(Date.now() / 1000);

          const filePath = `SupportMaterial/${materialTypeName}/${timestamp}-${index2}-${elem.name}`;
          console.log('filePath', filePath);

          let thumbnail:any = '';
          if(materialTypeName == 'Videos'){
            const thumbnailFilePath = `SupportMaterial/${materialTypeName}/Thumbnail/${timestamp}-${index2}-${elem.name.replace('mp4','png')}`;

            thumbnail =  await this.generateUploadVideoThumbnail(elem, thumbnailFilePath);
            console.log(thumbnail);
          }

          await this.uploadFile(elem, filePath , fileResultArray , thumbnail);
          
          if (index2 == (files.length - 1)) {
            this.supportForm.value.form[index]['uploadedFileNames'] = fileResultArray;
            //save
            if (index == (this.allFiles.length - 1)) {
              this.save();
            }
          }
          console.log("wait after.")
        }
      }
      console.log(this.fileResultArray)
    }else{
      this.save();
    }
  }
  async uploadFile(elem, filePath, fileResultArray, thumbnail){
    let uploadTask = this.afStorage.ref(filePath);
    let completed = false;
    return new Promise<void>(resolve => {
      uploadTask.put(elem).snapshotChanges().pipe(
        finalize(() => {
        })).subscribe((res) => {
          console.log("uploaded file totalBytes" + res.totalBytes + " bytesTransferred" + res.bytesTransferred);
          if (res.totalBytes == res.bytesTransferred && !completed) {
            completed = true;
            //Upload completed
            fileResultArray.push({ gcpFileName: filePath, fileName: elem.name , thumnailUrl : thumbnail});
            resolve();
          }
        }, (err) => {
          console.log("error while uploading file.");
          resolve();
        });
    });
  }

  save() {

    console.log(this.supportForm)

    this.spinner.show();
    let submitForm = [];
    this.supportForm.value.form.forEach((element, index) => {
      let reqObject = Object.assign({});
      reqObject['materialTypeId'] = element.materialType ? element.materialType : '';
      reqObject['categoryId'] = element.category ? element.category : '';
      reqObject['subCategoryId'] = element.subcategory ? element.subcategory : null;
      reqObject['assetType'] = element.assetType ? element.assetType : '';
      reqObject['assetModel'] = element.assetModel ? element.assetModel : '';
      reqObject['title'] = element.title ? element.title : '';

      if(element.materialType == 1 || element.materialType == 3){
        reqObject['uploadedFileNames'] = element.uploadedFileNames;
      }else{
        reqObject['faqList'] = element.arr;
        
      }
      submitForm.push(reqObject);
    });
    console.log(submitForm);

    this.supportservice.addSupportService('/api/supportMaterial/addSupportMaterial', submitForm).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Support Material added successfully!');
        this.supportForm.markAsPristine();
        this.backToList();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.errorMsg(err);
    });
  }

  async validateTitle(submitForm){
    this.spinner.show();
    let data = await this.supportservice.validateTitle('/api/supportMaterial/validateTitle', submitForm).toPromise();
    this.spinner.hide();
    if (data.response && data.response.error.length > 0) {
      return data.response;
    } else {
      return [];
    }
  }

  addMatTypeValidations(data, i) {
    /* this.arr = this.supportForm.get('form')['controls'][i].get('arr') as FormArray;
    this.arr.controls = [];
    this.arr.push(this.createItem()); */

    if (data.value.materialType == 1 || data.value.materialType == 3) {
      //videos,Guide
      data.controls['title'].setValidators([Validators.required, ValidationService.exceptSpecialChar]);
      data.controls['file'].setValidators([Validators.required]);

      //FAQ remove validation.
      data.controls.arr.controls[0].controls['faqQuestion'].setValidators([]);
      data.controls.arr.controls[0].controls['faqAnswer'].setValidators([]);

      data.controls.arr.controls[0].controls['faqQuestion'].updateValueAndValidity();
      data.controls.arr.controls[0].controls['faqAnswer'].updateValueAndValidity();
    } else {
      //FAQ
      data.controls['title'].setValidators([]);
      data.controls['file'].setValidators([]);
    }
    Object.keys(data.controls).forEach((field: any) => {
      data.get(field).updateValueAndValidity();
    });
    this.formUpdate();
    data.patchValue({ assetType: '', assetModel: '', subcategory: '', category: '', title: '' });
    data.markAsUntouched();

    console.log(data);
    console.log(this.supportForm.get('form')['controls']);
  }
  addCategoryValidations(data, index) {
    console.log(data);

    if (data.value.category == 1) {
      data.controls['subcategory'].setValidators([Validators.required]);
      data.controls['assetType'].setValidators([]);
      data.controls['assetModel'].setValidators([]);
    } else {
      data.controls['subcategory'].setValidators([]);
      data.controls['assetType'].setValidators([Validators.required]);
      data.controls['assetModel'].setValidators([Validators.required]);
    }
    this.formUpdate();
    data.patchValue({ assetType: '', assetModel: '', subcategory: '' });
    data.markAsUntouched();
  }
  formUpdate() {
    let form: any = this.supportForm.get('form');
    Object.keys(form.controls).forEach((field: any) => {
      form.get(field).updateValueAndValidity();
    });
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/support-material') > -1 && this.submitFlag) {
      return true;
    }
    if (this.supportForm.pristine == false ) { //|| this.supportForm.dirty == false
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }

  errorMsg(err) {
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
    this.spinner.hide();
  }

  generateUploadVideoThumbnail(file, filePath){
    let uploadCompleted = false;
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");
  
      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
      let ctx = canvas.getContext("2d");
      video.onloadeddata = (res) => {
        console.log(video.videoWidth ,video.videoHeight,res )
        canvas.width = 250;
        canvas.height = 250;
        video.pause();
        ctx.drawImage(video, 0, 0, 250, 250);
        
        let thumbnail = canvas.toDataURL("image/png");
        console.log('filePath', filePath);

        let uploadTask = this.afStorage.ref(filePath);
        uploadTask.putString(thumbnail.split(',')[1], 'base64', {contentType:'image/png'})
        .snapshotChanges().pipe(
          finalize(() => {
          })).subscribe((res) => {
            console.log("uploaded file totalBytes" + res.totalBytes + " bytesTransferred" + res.bytesTransferred);
            if (res.totalBytes == res.bytesTransferred && !uploadCompleted) {
              uploadCompleted = true;
              //Upload completed
              return resolve(filePath);
            }
          }, (err) => {
            console.log("error while uploading file.");
            return resolve(null);
          });
      };
    });
  }


}
