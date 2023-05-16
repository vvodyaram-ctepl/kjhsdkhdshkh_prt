import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { ImgScoreService } from '../img-score.service';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-add-image-score',
  templateUrl: './add-image-score.component.html',
  styleUrls: ['./add-image-score.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddImageScoreComponent implements OnInit {
  public imgForm: FormGroup;
  editProd: boolean = false;
  permissionMap: FormArray;
  id: any = '';
  // studyId: any = '';
  // planId: any = '';
  // studyNames: any = [];
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;
  submitFlag: boolean = false;
  imageScoringTypes: any;
  imgDtlts: any;
  disableSubmit: boolean = true;
  StatusArr: { name: string; id: string; }[];
  speciesArr: any;
  publishFlag: boolean = false;
  imageScoringTypeFilter: any = [];

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private imgService: ImgScoreService,
    private toastr: ToastrService,
    private userService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private alertService: AlertService,
    public customDatePipe: CustomDateFormatPipe
  ) { }

 async ngOnInit() {
    this.buildForm();
    this.StatusArr =  [
      {
        name: "Draft",
        id: "1"
      },
      {
        name: "Published",
        id: "2"
      }
      // {
      //   name: "Inactive",
      //   id: "0"
      // }
    ];
   
    
    this.activatedRoute.params.subscribe(async params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      await this.getImgScoreList();
      await this.getSpecies();

      if (path === 'edit') {
        this.spinner.show();
        this.editProd = true;
        let str = this.router.url;
        this.id = str.split("edit/")[1].split("/")[0];
        this.disableSubmit = false;
    
      }
      else {
        this.editProd = false;
      }
      this.patchData(params, path);

    });
  }

  getImgScoreList() {
    this.imgService.getImgScore(`/api/lookup/getImageScoringTypes/`).subscribe(res => {
      console.log(res);
      if (res.status.success === true) {
        this.imageScoringTypes = res.response.imageScoringTypes;
        this.imageScoringTypeFilter = this.imageScoringTypes.filter(ele => ele.imageScoringTypeId !=  4);
        // this.studyNames = this.planDetails.studyAssociatedObject;
        // this.studyNames && this.studyNames.forEach(ele => {
        //   ele.associatedDate = this.customDatePipe.transform(ele.associatedDate, 'MM/dd/yyyy');
        // })
        // this.spinner.hide();
      } else {
        // this.spinner.hide();
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      // this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    })
  }

  getSpecies() {
    this.imgService.getImgScore(`/api/lookup/getPetSpecies/`).subscribe(res => {
      console.log(res);
      if (res.status.success === true) {
        this.speciesArr = res.response.species;
      
      } else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    })
  }

  deleteRecord(studyId, planId) {
    // this.studyId = studyId;
    // this.planId = planId;
    this.openPopup(this.archiveContent, 'xs');
  }

  
  removeItem(i) {
    this.permissionMap = this.imgForm.get('permissionMap') as FormArray;
    this.permissionMap.removeAt(i);
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

  UpdateStudyRecord() {
    // this.imgService.deleteImgScore(`/api/study/disassociatePlan/${this.studyId}/${this.planId}`, {}).subscribe(res => {
    //   if (res.status.success === true) {
    //     this.toastr.success("Disassociated the plan with study");
    //     this.getAllPlans();
    //     this.modalRef2.close();
    //   }
    //   else {
    //     this.toastr.error(res.errors[0].message);
    //     this.modalRef2.close();
    //   }
    // }, err => {
    //   this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    //   this.modalRef2.close();
    // });
  }

  patchData(params, path): void {
    if (params.prodId) {
      this.imgService.getImgScore(`/api/imageScoringScales/${params.prodId}`).subscribe(res => {
        if (res.status.success === true) {
          this.spinner.hide();
          this.imgDtlts = res.response.imageScoringScale;
          if (path === 'edit') {
           
            //statusarr setting 
            if(this.imgDtlts.statusId == 2) {
              this.StatusArr.splice(this.StatusArr.findIndex(o => o.id == '1'),1)
              this.StatusArr.push({  name: "Inactive", id: "0"})
            }
            else {
              this.StatusArr.push({  name: "Inactive", id: "0"})
            }

            if(this.imgDtlts.isPublished)
            this.publishFlag = true;
            else 
            this.publishFlag = false;
            // this.imgForm.get('planName').setValue(this.planDetails.planName);
            // this.imgForm.get('planDescription').setValue(this.planDetails.planDescription);
            this.imgForm.patchValue({
              "imgScaleName": this.imgDtlts.imageScaleName,
              // "noOfScales": this.imgDtlts.noOfScales, //need to change
              "scoreType": this.imgDtlts.scoringTypeId,
              "classification": this.imgDtlts.classificationId,
              "species": this.imgDtlts.speciesId ? this.imgDtlts.speciesId : null,
              "status": this.imgDtlts.statusId
              
            })
           
            let value = this.imgForm.value.classification;
            if(value == 1) {
              this.imageScoringTypeFilter = this.imageScoringTypes.filter(ele => ele.imageScoringTypeId !=  4);
       
            }
            else {
              this.imageScoringTypeFilter = this.imageScoringTypes.filter(ele => ele.imageScoringTypeId ==  4);
             
            }


            this.imgDtlts.imageScoringScaleDetails.forEach((resEle,i) => {
              if (i < (this.imgDtlts.imageScoringScaleDetails.length - 1)) {
               this.permissionMap = this.imgForm.get('permissionMap') as FormArray;
              this.permissionMap.push(this.createItem());
            }
                this.imgForm.controls.permissionMap['controls'][i].patchValue({
                  "labelName": resEle.imageLabel,
                  "scoreName": resEle.score,
                  "unitsOfMeas": resEle.uom,
                  "imgDesc": resEle.description,
                  "petImage": resEle.imageName,
                  "petImageFileName": resEle.imageName,
                  "imageScoringDetailsId": resEle.imageScoringDetailsId
                });
            })

    
          }//edit
        }
      })
    }
  }

  public buildForm(): void {
    this.imgForm = this.fb.group({
      imgScaleName: ['', [Validators.required,ValidationService.exceptSpecialChar]],
      classification: ['1', [Validators.required]],
      scoreType: ['', [Validators.required]],
      // noOfScales: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      species:['null'],
      status:['',[Validators.required]],
      permissionMap: this.fb.array([this.createItem()])
    })
  }

  createItem() {
    return this.fb.group({
      petImage: ['', [Validators.required]],
      petImageFileName:[''],
      imgDesc:['', [Validators.required]],
      scoreName:['', [Validators.required]],
      unitsOfMeas:[''],
      labelName:['', [Validators.required]],
      imageScoringDetailsId:['']
    })
  }


  addScore() {

    // let value = parseInt(this.imgForm.value.noOfScales) ? parseInt(this.imgForm.value.noOfScales) : 0;

    let value = parseInt(this.imgForm.value.permissionMap.length);
  
  if(value == 0) {
    this.toastr.error("Please add at least one image scale.");
    return;
  }
  if(value > 9 ) {
    this.toastr.error("Cannot add more than 10 image scales.");
    return;
  }

  this.addItem();

    // if(this.imgForm.value.permissionMap.length > 0 && value != this.imgForm.value.permissionMap.length) {
    //   this.permissionMap.clear();
    // }
   
    console.log("this.imgForm.value",this.imgForm.value);
      

  // if (value > 0 && value < 11) {
    // [ ...Array(value) ].forEach((e, i) =>  {
    //   let perMapLength =  this.imgForm.value.permissionMap.length;
    //   console.log("perMapLength",perMapLength)
  
    // if(perMapLength > 9) {
 
    // }
    // else {
    //     if(this.imgForm.value.permissionMap.length < value ) {
          // this.addItem()
    //     }
    //     else {
    
    //     }
   
    // }
    // });
  // }

  //make button enable
// if(this.imgForm.value.permissionMap.length > 0) {
//   this.disableSubmit = false;
// }
// else {
//   this.disableSubmit = true;
// }
 
}
  
  addItem() {
    this.permissionMap = this.imgForm.get('permissionMap') as FormArray;
    this.permissionMap.push(this.createItem());
    console.log("this.imgForm.value",this.imgForm.value);

this.imgForm.value.permissionMap.forEach((ele,i) => 
  {
    this.imgForm.controls.permissionMap['controls'][i].patchValue({
      // 'scoreName': i + 1 // removed patch for score
    })
  })
  }

  selectFileResult(event,i) {
    if (event.target.files[0] && 'jpeg, jpg, png, svg'
      .search(new RegExp(event.target.files[0].name.split('.')[1], 'i')) == -1) {
      this.toastr.error('Invalid file format (Valid formats are jpeg, jpg, png ,svg).', 'Error!');
      this.imgForm.patchValue({ 'petImage': '' });
      this.imgForm.markAsUntouched();
      return false;
    }
    //  if (event.target.files[0] && event.target.files[0].name.length > 30) {
    //   this.toastr.error('File Name cannot be greater than 30 characters.', 'Error!');
    //   return false;
    //  }
    let formData = new FormData();
    console.log(event.target.files[0].name.split('.')[0]);
    let selectedFile = event.target.files[0];
    formData.append("file", selectedFile);
    formData.append("moduleName", 'ImageScoring');
    this.spinner.show();
    this.imgService.bulkUpload('/api/fileUpload/uploadFile', formData).subscribe(res => {
      console.log(res);
      this.spinner.hide();
      if (res && res.status.success) {
        // this.reloadDataTable();
        let fileName = '';
        let fileUrl = '';
        if (res.response.length > 0) {
          fileName = res.response[0];
          fileUrl = res.response[1];
        }
        this.imgForm.controls.permissionMap['controls'][i].patchValue({
          'petImage': fileName,
           'petImageUrl': fileUrl,
           'petImageFileName': fileName
        })
  

      } else {
        this.toastr.error('Please select a valid file for uploading.', 'Error!');
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });

  }


  backToList() {
    this.router.navigate(['/user/imagescore']);
  }

  ngAfterViewInit() {
    this.imgForm.patchValue({
      'status': 1
    });
  }

  classChange($event) {
    console.log("$event",$event.target.value);
    let value = $event.target.value;
    this.imgForm.value.permissionMap.forEach((ele,i) => {
    if(value == 1) {
      this.imageScoringTypeFilter = this.imageScoringTypes.filter(ele => ele.imageScoringTypeId !=  4);
    this.imgForm.controls.permissionMap['controls'][i].patchValue({
      "scoreName": ''
    });
    }
    else {
      this.imageScoringTypeFilter = this.imageScoringTypes.filter(ele => ele.imageScoringTypeId ==  4);
      this.imgForm.controls.permissionMap['controls'][i].patchValue({
        "unitsOfMeas": ''
      });
    }
   })

    if(value == 1) {
      this.imgForm.value.permissionMap.forEach((ele,i) => {
      this.imgForm.get('permissionMap')['controls'][i].controls.petImage.setValidators([Validators.required]);
      this.imgForm.get('permissionMap')['controls'][i].controls.petImage.updateValueAndValidity();

      this.imgForm.get('permissionMap')['controls'][i].controls.scoreName.setValidators([Validators.required]);
      this.imgForm.get('permissionMap')['controls'][i].controls.scoreName.updateValueAndValidity();

      this.imgForm.get('permissionMap')['controls'][i].controls.unitsOfMeas.setValidators([]);
      this.imgForm.get('permissionMap')['controls'][i].controls.unitsOfMeas.updateValueAndValidity();
      })

    }
    else if(value == 2) {
      this.imgForm.value.permissionMap.forEach((ele,i) => {
        this.imgForm.get('permissionMap')['controls'][i].controls.petImage.setValidators([]);
        this.imgForm.get('permissionMap')['controls'][i].controls.petImage.updateValueAndValidity();

        this.imgForm.get('permissionMap')['controls'][i].controls.unitsOfMeas.setValidators([Validators.required]);
        this.imgForm.get('permissionMap')['controls'][i].controls.unitsOfMeas.updateValueAndValidity();

        this.imgForm.get('permissionMap')['controls'][i].controls.scoreName.setValidators([]);
        this.imgForm.get('permissionMap')['controls'][i].controls.scoreName.updateValueAndValidity();
        })
    }


  }
 async submit() {
  let value = this.imgForm.value.classification;
  if(value == 1) {
    this.imgForm.value.permissionMap.forEach((ele,i) => {
    this.imgForm.get('permissionMap')['controls'][i].controls.petImage.setValidators([Validators.required]);
    this.imgForm.get('permissionMap')['controls'][i].controls.petImage.updateValueAndValidity();

    this.imgForm.get('permissionMap')['controls'][i].controls.scoreName.setValidators([Validators.required]);
    this.imgForm.get('permissionMap')['controls'][i].controls.scoreName.updateValueAndValidity();

    this.imgForm.get('permissionMap')['controls'][i].controls.unitsOfMeas.setValidators([]);
    this.imgForm.get('permissionMap')['controls'][i].controls.unitsOfMeas.updateValueAndValidity();
    })

  }
  else if(value == 2) {
    this.imgForm.value.permissionMap.forEach((ele,i) => {
      this.imgForm.get('permissionMap')['controls'][i].controls.petImage.setValidators([]);
      this.imgForm.get('permissionMap')['controls'][i].controls.petImage.updateValueAndValidity();

      this.imgForm.get('permissionMap')['controls'][i].controls.unitsOfMeas.setValidators([Validators.required]);
      this.imgForm.get('permissionMap')['controls'][i].controls.unitsOfMeas.updateValueAndValidity();

      this.imgForm.get('permissionMap')['controls'][i].controls.scoreName.setValidators([]);
      this.imgForm.get('permissionMap')['controls'][i].controls.scoreName.updateValueAndValidity();
      })
  }

    if (!this.imgForm.valid) {
      this.imgForm.markAllAsTouched();
      return false;
    }
    // await this.addScore();

    // if (!this.imgForm.valid) {
    //   this.imgForm.markAllAsTouched();
    //   return false;
    // }

    this.spinner.show();
    this.submitFlag = true;
    let imgFormValue = this.imgForm.getRawValue();
    let imgForm = Object.assign({});
    console.log("imgForm",imgForm);
  
    //for add and edit
    imgForm['imageScaleName'] = imgFormValue.imgScaleName;
    imgForm['scoringTypeId'] = imgFormValue.scoreType;
    imgForm['classificationId'] = imgFormValue.classification;
    imgForm['speciesId'] = imgFormValue.species;
     imgForm['statusId'] = imgFormValue.status;

    let imageScoringScaleDetailsArr = [];
    imgFormValue.permissionMap && imgFormValue.permissionMap.forEach(ele => {
      // if (ele.petImage != "") {
        imageScoringScaleDetailsArr.push({
          // "imageScoringDetailsId": ele.imageScoringDetailsId ? ele.imageScoringDetailsId : '',
          "imageLabel": ele.labelName ? ele.labelName : '',
          "score": ele.scoreName ? ele.scoreName : '',
          "uom":ele.unitsOfMeas ? ele.unitsOfMeas :'',
          "imagePath": ele.petImage ? ele.petImage : '',
          "description": ele.imgDesc ? ele.imgDesc : '',
          "imageScoringDetailsId": ele.imageScoringDetailsId ? ele.imageScoringDetailsId : ''
        })
      // }
    });

    imgForm['imageScoringScaleDetails'] = imageScoringScaleDetailsArr;
    //for add and edit

    if (this.editProd) {
      imgForm['modifiedBy'] = parseInt(this.userService.getUserId());
      imgForm['imageScoringScaleId'] = parseInt(this.id);
    
      this.imgService.updateImgScore('/api/imageScoringScales', imgForm).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Image Score updated successfully!');
          this.imgForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
    else {
   
      imgForm['createdBy'] = parseInt(this.userService.getUserId());
     
      this.imgService.addImgScore('/api/imageScoringScales', imgForm).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Image Score added successfully!');
          this.imgForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }

  }
  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/add-new-clinic/basic-details') > -1 || next.url.indexOf('/add-new-clinic/add-plans') > -1 || next.url.indexOf('/add-new-clinic/add-notes') > -1 || next.url.indexOf('/add-new-clinic/mobile-app-config') > -1 || next.url.indexOf('/add-new-clinic/push-notification-study') > -1){
      return true;
    }
    
    if (next.url.indexOf('/user/imagescore') > -1 && this.submitFlag) {
      return true;
    }
    if (this.imgForm.pristine == false ) { //|| this.imgForm.dirty == false
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }
}


