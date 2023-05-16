import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
 
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetsService } from 'src/app/assets/components/assets.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService } from 'src/app/support/support.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-edit-support-material',
  templateUrl: './edit-support-material.component.html',
  styleUrls: ['./edit-support-material.component.scss']
})
export class EditSupportMaterialComponent implements OnInit {

  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  submitFlag: boolean = false;
  headers: any;
  validType:any;
  file:any;
  filterTypeArr: any[];
  RWFlag: boolean;
  selectedItem: any = '';
  selectedFile: any = [];
  public showDataTable: boolean = false;
  
  selectedRecordsEvent: any;
  isUpload: boolean;
  supportForm: FormGroup;
  assetTypes: any;
  deviceModelList: any;
  materialTypeList: any;
  materialCategoryList: any;
  materialSubCategoryList: any;
  arr: any;
  supportMaterialId: string;
  editSupportData: any = [];
  deleteAttachPopData: any = {};
  deletedQuestions: any = [];
  constructor(
    public router: Router,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private assetsService: AssetsService,
    private spinner: NgxSpinnerService,
    private fb : FormBuilder,
    private supportservice: SupportService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private afStorage: AngularFireStorage
  ) { }

  async ngOnInit() {
    await this.loadLookupData();
    
    
    this.supportForm = this.fb.group({
      assetType : ['', [Validators.required]],
      assetModel : ['', [Validators.required]],
      materialType : ['', [Validators.required]],
      title : ['', [Validators.required, ValidationService.exceptSpecialChar]],
      file : ['', [Validators.required]],
      fileNames :  [''],
      category : ['', [Validators.required]],
      subcategory : [''],
      arr: this.fb.array([])
  });

    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.supportMaterialId = str.split("edit/")[1];
    })
    this.editSupportData = {};
    this.spinner.show();
    this.supportservice.getEditData('/api/supportMaterial/getSupportMaterialDetailsById/'+this.supportMaterialId).subscribe(res => {
      if (res.status.success === true) {
        console.log(res);
        this.editSupportData = res.response.detailsList;
        this.supportForm.patchValue({
          assetType : this.editSupportData[0].assetType,
          assetModel : this.editSupportData[0].assetModel,
          materialType : this.editSupportData[0].materialTypeId,
          title : this.editSupportData[0].titleOrQuestion,
          category : this.editSupportData[0].categoryId,
          subcategory : this.editSupportData[0].subCategoryId
        });
        console.log(this.editSupportData[0]);
        if(this.editSupportData[0].assetType){
          this.changeDeviceType(this.editSupportData[0].assetType);
        }
        this.updateValidations();

        if(this.editSupportData[0].materialTypeId == 2){ //FAQ
          this.editSupportData.forEach((element,index) => {
           
            this.arr = this.supportForm.get('arr') as FormArray;
            this.arr.push(this.createItem());

            this.supportForm.controls.arr['controls'][index].patchValue({
              faqQuestion: element.titleOrQuestion ?  element.titleOrQuestion : '',
              faqAnswer: element.urlOrAnswer ? element.urlOrAnswer : '',
              faqId : element.supportDetailsId
            });
          });
        }else if(this.editSupportData[0].materialTypeId == 3 || this.editSupportData[0].materialTypeId == 1){ //Guide
          let fileNames = [];
          this.editSupportData.forEach((element,index) => {
              fileNames.push({uploadedFileName :  element.uploadedFileName , gcpName : element.urlOrAnswer});
          });
          this.supportForm.patchValue({ fileNames : fileNames});

          if(this.editSupportData[0].uploadedFileName != ''){
            this.supportForm.controls['file'].setValidators([]);
          }
        }
        this.spinner.hide();
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
    userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "17") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
      
  }

  createItem() {
    // moment().format("MM-DD-YYYY")
    return this.fb.group({
      faqQuestion : ['', [Validators.required]],
      faqAnswer : ['', [Validators.required]],
      faqId : ['']
      // faqQuestion : [''],
      // faqAnswer : [''],
    })
  }

  addItem() {
    this.arr = this.supportForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i: number) {
    this.arr = this.supportForm.get('arr') as FormArray;
    this.arr.removeAt(i);
    console.log(this.supportForm.value.arr[i]);
  }
  
  async loadLookupData() {
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
        this.materialCategoryList = this.materialCategoryList.filter( data => data.parentId == 0);
        this.materialSubCategoryList = res.response.materialCategories.filter( data => data.parentId > 0);
        console.log(this.materialSubCategoryList );

      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
    await this.getAssetTypes();
  }

  formatter($event) {
    console.log($event);
    if($event.length == 0){
      this.showDataTable = false;
    }
    $event.forEach(ele => {
      ele.id = ele.rnum;
      if(ele.exceptionMsg && ele.exceptionMsg.trim() !=''){
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
    this.router.navigate([`/user/support-material/view/${this.editSupportData[0].materialTypeName}/${this.editSupportData[0].materialTypeId}`]);
    //this.router.navigate(['/user/support-material/view']);
  }
  selectFileResult(event) {
    console.log("event fired for",event);
    if(event.length == 0){
      console.log("sghdshd");
      return false;
    }
    this.selectedFile = [];
    if(event.length > 0){
      this.selectedFile = event
    }
    else {
      this.selectedFile = '';
      this.file = '';
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
    this.spinner.hide();
    if (data.response && data.response.length > 0) {
      return data.response;
    } else {
      return [];
    }
  }
  
  reloadDataTable(){
    this.showDataTable = false;
    setTimeout(()=>{
      this.showDataTable = true;
    },500);
  }
  back(){
    this.router.navigate(['/user/assets/management']);
  }
 
  async getAssetTypes() {
    this.assetsService.getAssetsService('/api/assets/getDeviceTypesAndModels').subscribe(res => {
      if (res.status.success === true) {
        this.assetTypes = res.response.deviceTypes;
        let tempArray = [];
        res.response.deviceModels.forEach(element => {
          tempArray.push({deviceModel :  element});
        });
        this.deviceModelList = tempArray;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
 
  async update() {
    console.log(this.supportForm);
    this.formUpdate();
    if (!this.supportForm.valid) {
      return false;
    }
    this.submitFlag = true;
 
    let titleArray = [];
    let obj = Object.assign({});
    obj['materialTypeId'] = this.supportForm.value.materialType;
    obj['title'] = this.supportForm.value.title;
    obj['supportMaterialId'] = this.editSupportData[0].supportMaterialId || '';
    titleArray.push(obj);
    let result = await this.validateTitle(titleArray);
    if(result && result.error && result.error != ''){
      this.toastr.error(result.error);
      return;
    }
    let reqObject = Object.assign({});
    let materialType = this.supportForm.value.materialType;
    reqObject['supportMaterialDetailsId'] = this.supportMaterialId;
    reqObject['supportMaterialId'] = this.editSupportData[0].supportMaterialId;
    reqObject['materialTypeId'] = this.supportForm.value.materialType ? this.supportForm.value.materialType : '';
    reqObject['categoryId'] = this.supportForm.value.category ? this.supportForm.value.category : '';
    reqObject['subCategoryId'] = this.supportForm.value.subcategory ? this.supportForm.value.subcategory : '';
    reqObject['assetType'] = this.supportForm.value.assetType ? this.supportForm.value.assetType : '';
    reqObject['assetModel'] = this.supportForm.value.assetModel ? this.supportForm.value.assetModel : '';
    reqObject['title'] = this.supportForm.value.title ? this.supportForm.value.title : '';
    
    if(materialType == 1 || materialType == 3){
      let fileResultArray= [];
      if(this.deleteAttachPopData && Object.keys(this.deleteAttachPopData).length > 0){
        fileResultArray.push({ fileName : this.deleteAttachPopData.uploadedFileName ,  gcpFileName :  this.deleteAttachPopData.gcpName ,isUpdated : -1}); //Deleted file.
      }
      reqObject["uploadedFileNames"] = fileResultArray;

      for (let index = 0; index < this.selectedFile.length; index++) {
        const elem = this.selectedFile[index];

        const materialTypeName = this.materialTypeList.find(x => x.materialTypeId === this.supportForm.value['materialType']).materialTypeName;
        const timestamp = Math.floor(Date.now() / 1000);
        const filePath = `SupportMaterial/${materialTypeName}/${timestamp}-${index}-${elem.name}`;
       
        let thumbnail:any = '';
        if(materialTypeName == 'Videos'){
          const thumbnailFilePath = `SupportMaterial/${materialTypeName}/Thumbnail/${timestamp}-${index}-${elem.name.replace('mp4','png')}`;

          thumbnail =  await this.generateUploadVideoThumbnail(elem, thumbnailFilePath);
          console.log(thumbnail);
        }

        let completed = false;
        let uploadTask = this.afStorage.ref(filePath);
        await this.uploadFile(uploadTask, elem, completed, filePath , fileResultArray, thumbnail);
        if (index == (this.selectedFile.length - 1)) { 
          reqObject["uploadedFileNames"] = fileResultArray;
        }
      }
      
    }else{
      let questions = [];
      this.supportForm.value.arr.forEach((data) => {
        if(((data.faqQuestion != this.editSupportData[0].titleOrQuestion) || (data.faqAnswer != this.editSupportData[0].urlOrAnswer)) && data.faqId == ''){
          data.isUpdated = 1;
        }else{
          data.isUpdated = 0;
        }
        questions.push(data);
      });
      reqObject['faqList'] = questions;
      
    }
    this.updateSupportMaterial(reqObject);
    console.log(reqObject);
  }

  async uploadFile(uploadTask, elem, completed, filePath, fileResultArray , thumbnail){
    this.spinner.show();
    return new Promise<void>(resolve => {
      uploadTask.put(elem).snapshotChanges().pipe(
        finalize(() => {
        })).subscribe((res) => {
          console.log("uploaded file totalBytes" + res.totalBytes + " bytesTransferred" + res.bytesTransferred);
          if (res.totalBytes == res.bytesTransferred && !completed) {
            completed = true;
            //Upload completed
            fileResultArray.push({ gcpFileName: filePath, fileName: elem.name , isUpdated :  1, thumnailUrl : thumbnail});
            this.spinner.hide();
            resolve();
          }
        }, (err) => {
          console.log("error while uploading file.");
          resolve();
        });
    });
  }

  updateSupportMaterial(reqObject){
    this.spinner.show();
    this.supportservice.addSupportService('/api/supportMaterial/updateSupportMaterial', reqObject).subscribe(res => {
      if (res.status.success === true) {
        this.spinner.hide();
        this.toastr.success('Support Material updated successfully!');
        this.supportForm.markAsPristine();
        this.backToList();
      }
      else {
        this.spinner.hide();
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }
  confirmDeleteAttachment(data){
    console.log(data);
    this.deleteAttachPopData = data;
    this.openPopup(this.archiveContent, 'xs');
  }
  deleteAttachment() {
    let fileName = [];
    let currentFiles = this.supportForm.value.fileNames;
    console.log(currentFiles);
    let files = currentFiles.filter( data => data.gcpName != this.deleteAttachPopData.gcpName);
    this.supportForm.patchValue({ fileNames : files});
    this.modalRef2.close();

    this.supportForm.controls['file'].setValidators([Validators.required]);
    this.formUpdate();
  }
  openPopup(div, size) {
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
  onCategoryChange(){
    this.supportForm.patchValue({ assetType : '', assetModel  : '' , subcategory : ''});
    if(this.supportForm.value.category == 1){
      this.supportForm.controls['subcategory'].setValidators([Validators.required]);
      this.supportForm.controls['assetType'].setValidators([]);
      this.supportForm.controls['assetModel'].setValidators([]);
    }else{
      this.supportForm.controls['subcategory'].setValidators([]);
      this.supportForm.controls['assetType'].setValidators([Validators.required]);
      this.supportForm.controls['assetModel'].setValidators([Validators.required]);
      this.getAssetTypes();
    }
    this.supportForm.markAsUntouched();
    this.formUpdate();
  }
  onMatChange(){
     if(this.supportForm.value.materialType == 1 || this.supportForm.value.materialType == 3){
        //videos,Guide
        this.supportForm.controls['title'].setValidators([Validators.required,ValidationService.exceptSpecialChar]);
        this.supportForm.controls['file'].setValidators([Validators.required]);
     }else{
       //FAQ
       this.supportForm.controls['title'].setValidators([]);
       this.supportForm.controls['file'].setValidators([]);
     }
     this.supportForm.patchValue({ assetType : '', assetModel  : '' , subcategory : '' , category : ''});
     this.supportForm.get('arr').patchValue({ faqQuestion : '', faqAnswer : ''});
     this.formUpdate();
  }
  formUpdate(){
    Object.keys(this.supportForm.controls).forEach((field: any) => {
      this.supportForm.get(field).updateValueAndValidity();
    });
  }
  updateValidations(){
    if(this.supportForm.value.category == 1){
      this.supportForm.controls['subcategory'].setValidators([Validators.required]);
      this.supportForm.controls['assetType'].setValidators([]);
      this.supportForm.controls['assetModel'].setValidators([]);
    }else{
      this.supportForm.controls['subcategory'].setValidators([]);
      this.supportForm.controls['assetType'].setValidators([Validators.required]);
      this.supportForm.controls['assetModel'].setValidators([Validators.required]);
    }
    if(this.supportForm.value.materialType == 1 || this.supportForm.value.materialType == 3){
      //videos,Guide
      this.supportForm.controls['title'].setValidators([Validators.required,ValidationService.exceptSpecialChar]);
        this.supportForm.controls['file'].setValidators([Validators.required]);
    }else{
      //FAQ
      this.supportForm.controls['title'].setValidators([]);
      this.supportForm.controls['file'].setValidators([]);
    }
    
    this.formUpdate();
  }
  changeDeviceType(value) {
    this.spinner.show();
    this.assetsService.getAssetsService(`/api/assets/getDeviceModelById/${value}`).subscribe(res => {
      if (res.status.success === true) {
        this.deviceModelList = res.response.rows.filter(data => data.deviceModel != 'Other');
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
  canDeactivate(component, route, state, next) {	
    if (next.url.indexOf('/auth/login') > -1) {	
      return true;	
    }	
    if (next.url.indexOf('/user/support-material') > -1 && this.submitFlag) {	
      return true;	
    }	
    if (this.supportForm.touched) {	//this.supportForm.pristine == false || this.supportForm.dirty == false
      return this.alertService.confirm();	
    }	
    else {	
      return true;	
    }	
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

