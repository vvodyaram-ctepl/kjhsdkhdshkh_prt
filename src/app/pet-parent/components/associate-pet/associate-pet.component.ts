import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PetParentService } from '../../pet-parent.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AddUserService } from 'src/app/clinical-users/components/add-user.service';
import { PetService } from 'src/app/patient/pet.service';
import * as moment from 'moment';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { AssetService } from 'src/app/services/util/asset.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-associate-pet',
  templateUrl: './associate-pet.component.html',
  styleUrls: ['./associate-pet.component.scss']
})
export class AssociatePetComponent implements OnInit {
  recordtype: number = 1;
  breeds: any = [];
  devices: any = [];
  existingpetInfoForm: FormGroup;
  addNewPetForm: FormGroup;
  petList: any = [];
  existingPetArr: any[] = [];
  newPetArr: any[] = [];
  headers: any;
  headers2: any;
  editFlag: boolean = false;
  studyArr: any;
  editId: any;
  petArr: any[];
  addFlag: boolean = false;
  viewFlag: boolean = false;
  submitFlag: boolean = false;
  assetModelArr: any[];
  assetTypeArr: any[];
  devicesList: any;
  assetModelArray: any[];
  assetTypeArray: any[];
  currentDate: any;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  @ViewChild('archiveContent2') archiveContent2: ElementRef;
  
  modalRef2: NgbModalRef;
  list: any;
  speciesArr: any;
  externalPetArr: any;
  newAArr: any[];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private petParentService: PetParentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private tabservice: TabserviceService,
    private customDatePipe: CustomDateFormatPipe,
    private adduserservice: AddUserService,
    private petservice: PetService,
    private alertService: AlertService,
    private assetService: AssetService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.currentDate = moment().format("MM-DD-YYYY");
    console.log("this.router.url", this.router.url);
    let str = this.router.url;
    if (this.router.url.indexOf('/edit-pet-parent') > -1) {
      let id = str.split("edit-pet-parent/")[1].split("/")[0];
      this.editFlag = true;
      this.addFlag = false;
      this.viewFlag = false;
      this.editId = id;
    }
    if (this.router.url.indexOf('/view-pet-parent') > -1) {
      let id = str.split("view-pet-parent/")[1].split("/")[0];
      this.viewFlag = true;
      this.editFlag = false;
      this.addFlag = false;
      this.editId = id;
    }
    if (this.router.url.indexOf('/add-pet-parent') > -1) {
      let id = str.split("add-pet-parent/")[1].split("/")[0];
      this.addFlag = true;
      this.editFlag = false;
      this.viewFlag = false;
      this.editId = id;
    }

    this.getInitialdata();
    this.getStudyList();
    this.buildExistingPetForm();
    this.buildAddNewPetForm();
    this.headers = this.getHeaders();
    this.headers2 = this.getHeaders2();

    this.tabservice.dataModel$.subscribe(res => {
      console.log(res);
      res = res ? (res['associatePet'] ? res['associatePet'] : '') : '';
      console.log("associatePet", res);
      this.existingPetArr = res;

    })
  }
  getHeaders() {
    return [
      { label: "Pet Name", key: "petName", checked: true },
      { label: "Breed Name", key: "breedName", checked: true },
      { label: "Gender", key: "gender", checked: true },
      { label: "", key: "static", checked: true, clickable: true }
    ];
  }

  getHeaders2() {
    return [
      { label: "Pet Name", key: "petName", checked: true },
      { label: "Breed", key: "breed", checked: true },
      { label: "Gender", key: "gender", checked: true },
      { label: "", key: "static", checked: true, clickable: true }
    ];
  }

  public buildExistingPetForm(): void {
    this.existingpetInfoForm = this.fb.group({
      'pet': ['', [Validators.required]],
    })
  }

  public buildAddNewPetForm(): void {
    this.addNewPetForm = this.fb.group({
      'petPhoto': [''],
      'petName': ['', [Validators.required]],
      'breed': ['', [Validators.required]],
      'species':[''],
      'weight': ['', [ValidationService.decimalValidatorWithValue]],
      "weightUnits": [''],
      'gender': ['', [Validators.required]],
      'dob': ['', [Validators.required]],
      'study': [''],
      'studyassDate':[''],
      'startDate':[''],
      'endDate':[''],
      'externalPet':[''],
      'isExternal':false,
      'deviceNumber': [''],
      'deviceModel': [''],
      'assetType': [''],
      'assignedOn': [],
      // moment().format("MM-DD-YYYY")
      'petStatus': [''],
      'category': ['', [Validators.required]],
    })
  }

  breedSelected($event) {
    console.log("$event", $event);
    this.addNewPetForm.patchValue({
      "species": $event.speciesId ? $event.speciesId : ''
    })
  }

  speciesSelected($event) {
    this.addNewPetForm.patchValue({
      'breed':''
    })
    console.log("selected",$event);
    let speciesId = $event.target.value;
    console.log("speciesId",speciesId);
    let breedFilter = [];
    breedFilter  =  this.breeds;

    // this.newAArr =[];
    this.newAArr = breedFilter.filter(ele => ele.speciesId == speciesId);
    console.log("this.breedArr",this.breeds)
  }

  studySelected($event) {
    console.log("study selected",$event);
    if($event) {
      this.addNewPetForm.patchValue({
        'startDate': $event.startDate ? moment(new Date($event.startDate)).format("MM-DD-YYYY"): '',
        'endDate': $event.endDate ? moment(new Date($event.endDate)).format("MM-DD-YYYY"): '',
      });

      //Get external pet info
     this.spinner.show();
     this.petParentService.getPetParentService(`/api/pets/getExternalPetInfoList/${$event.studyId}`).subscribe(res => {
       if (res.status.success === true) {
        // this.externalPetArr = res.response;
 
        // let externalPetArr = [];
    let isExternal:boolean = false;
    if(res.response) {
      this.externalPetArr = res.response;
      isExternal = true
      }
      else {
        this.externalPetArr = [];
        isExternal = false
      }

        this.addNewPetForm.patchValue({
          // "isExternalArr": externalPetArr,
          "isExternal": isExternal
        })

       }
       else {
         this.toastr.error(res.errors[0].message);
       }
       this.spinner.hide();
     }, err => {
       this.spinner.hide();
       this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
     });

      // this.addNewPetForm.controls.studyassDate.setValidators([Validators.required]);
      // this.addNewPetForm.controls.studyassDate.updateValueAndValidity();
    }

  }

  async getInitialdata() {
    this.spinner.show();
    //Get all pets
    await this.petParentService.getPetParentService('/api/pets/getPets').subscribe(res => {
      if (res.status.success === true) {
        console.log(res);
        this.petList = res.response.pets;

      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
    //Get Breeds
    this.spinner.show();
    await this.petParentService.getPetParentService('/api/lookup/getPetBreeds').subscribe(res => {
      if (res.status.success === true) {
        this.breeds = res.response.breeds;
        this.newAArr = this.breeds;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
     //Get Species
     this.spinner.show();
     await this.petParentService.getPetParentService('/api/lookup/getPetSpecies').subscribe(res => {
       if (res.status.success === true) {
         this.speciesArr = res.response.species;
 
       }
       else {
         this.toastr.error(res.errors[0].message);
       }
       this.spinner.hide();
     }, err => {
       this.spinner.hide();
       this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
     });
     
    //Get All Devices
    this.spinner.show();
    await this.petParentService.getPetParentService('/api/assets/getAllDevices').subscribe(res => {
      if (res.status.success === true) {
        console.log(res);
        this.devices = res.response.deviceInfos;
        this.devicesList = res.response.deviceInfos;
        this.assetService.getDeviceDetails('/api/assets/getDeviceTypesAndModels', '').subscribe(res => {
          console.log("res", res);
          if (res.response && res.response.deviceTypes && res.response.deviceTypes.length > 0) {
            let deviceTypeArr = [];
            res.response.deviceTypes.forEach(element => {
              deviceTypeArr.push({ 'name': element });
            });
            this.assetTypeArr = deviceTypeArr;
            this.assetTypeArray = deviceTypeArr;
          }
          if (res.response && res.response.deviceModels && res.response.deviceModels.length > 0) {
            let deviceModelArr = [];
            res.response.deviceModels.forEach(element => {
              deviceModelArr.push({ 'name': element });
            });

            this.assetModelArr = deviceModelArr;
            this.assetModelArray = deviceModelArr;
          }
        },
          err => {
            this.spinner.hide();
            this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
          });
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

  assetTypeSelected($event) {
    console.log(this.addNewPetForm.value)
    // filter device number list based on selected asset type
    let tempDevice = [];
    let tempModel = [];
    if ($event) {
      this.devicesList.length > 0 && this.devicesList.forEach(element => {
        if (element.deviceType && element.deviceType.trim() == $event.name.trim()) {
          tempDevice.push(element);
          if (element.deviceModel) {
            tempModel.push({ name: element.deviceModel });
          }
        }
      });

      let isDeviceExist = tempDevice.map(function (x) { return x.deviceNumber; }).indexOf(this.addNewPetForm.value.deviceNumber ? this.addNewPetForm.value.deviceNumber.deviceNumber : '');
      let isAssetModelExist = tempModel.map(function (x) { return x.name; }).indexOf(this.addNewPetForm.value.deviceModel ? this.addNewPetForm.value.deviceModel.name : '');
      if (isDeviceExist < 0) {
        this.addNewPetForm.patchValue({
          'deviceNumber': '',
        });
      }
      if (isAssetModelExist < 0) {
        this.addNewPetForm.patchValue({
          'deviceModel': '',
        });
      }
      this.devices = tempDevice;
      this.assetModelArr = tempModel;
    }
  }
  assetModelSelected($event) {
    // filter device number list based on selected asset model
    let tempDevice = [];
    let tempAssetType = [];
    if ($event) {
      this.devicesList.length > 0 && this.devicesList.forEach(element => {
        if (element.deviceModel && element.deviceModel.trim() == $event.name.trim()) {
          tempDevice.push(element);
          if (element.deviceType) {
            tempAssetType.push({ name: element.deviceType });
          }
        }
      });
      let isDeviceExist = tempDevice.map(function (x) { return x.deviceNumber; }).indexOf(this.addNewPetForm.value.deviceNumber ? this.addNewPetForm.value.deviceNumber.deviceNumber : '');
      let isAssetTypeExist = tempDevice.map(function (x) { return x.deviceType; }).indexOf(this.addNewPetForm.value.assetType ? this.addNewPetForm.value.assetType.name : '');
      if (isDeviceExist < 0) {
        this.addNewPetForm.patchValue({
          'deviceNumber': '',
        });
      }
      if (isAssetTypeExist < 0) {
        this.addNewPetForm.patchValue({
          'assetType': '',
        });
      }

      this.devices = tempDevice;
      this.assetTypeArr = tempAssetType;
    }
  }

  handleFileInput(files) {
    if (files[0] && 'jpeg, jpg, png, gif'
      .search(new RegExp(files[0].name.split('.')[1], 'i')) == -1) {
      this.toastr.error('Invalid file format (Valid formats are jpeg, jpg, png, gif).', 'Error!');
      this.addNewPetForm.patchValue({ 'petPhoto': '' });
      this.addNewPetForm.markAsUntouched();
      return false;
    }
    if (files[0] && files[0].name.length > 30) {
      this.toastr.error('File Name cannot be greater than 30 characters.', 'Error!');
      return false;
    }
    this.addNewPetForm.get('petPhoto').setValue(files[0].name.split('.')[0]);
    //this.addNewPetForm.patchValue({ 'petPhoto': files[0].name.split('.')[0] });
  }



  existingPetSubmit() {
    console.log(this.existingpetInfoForm.value);
    this.existingpetInfoForm.markAllAsTouched();
    if (this.existingpetInfoForm.valid) {
      console.log("this.existingpetInfoForm", this.existingpetInfoForm.value.pet);
      let pPets = this.existingpetInfoForm.value.pet;
      let duplicateRecord = false;
      //check for duplicates with the array list
      this.existingPetArr && this.existingPetArr.forEach(ele => {
        if (ele.petId == pPets.petId) {
          duplicateRecord = true;
          this.toastr.error("Pet Parent" + " " + ele.petName + " " + "already mapped");
          this.existingpetInfoForm.patchValue({
            'pet': ''
          });
          this.existingpetInfoForm.markAsUntouched();
        }
      })

      if (!duplicateRecord || this.existingPetArr.length == 0) {
        if (this.existingPetArr.length == 0) {
          this.existingPetArr = [];
        }
        this.existingPetArr.push(
          {
            "breedName": pPets.breedName,
            "gender": pPets.gender,
            "petId": pPets.petId,
            "petName": pPets.petName
          });
        this.existingpetInfoForm.patchValue({
          'pet': ''
        })
        this.existingpetInfoForm.markAsUntouched();
      }
    }
  }

  assDateSelected($event) {
    // this.addNewPetForm.controls.deviceNumber.setValidators([Validators.required]);
    // this.addNewPetForm.controls.deviceNumber.updateValueAndValidity();
    // this.addNewPetForm.controls.study.setValidators([Validators.required]);
    // this.addNewPetForm.controls.study.updateValueAndValidity();
  }
  onClearDate() {
    this.addNewPetForm.patchValue({
      'assignedOn':''
    })
    // this.addNewPetForm.controls.deviceNumber.setValidators([]);
    // this.addNewPetForm.controls.deviceNumber.updateValueAndValidity();
    // this.addNewPetForm.controls.study.setValidators([]);
    // this.addNewPetForm.controls.study.updateValueAndValidity();
  }
  populate($event) {
    console.log("event trgrd", $event);
    /*  if($event.studyId) {
      this.addNewPetForm.controls['deviceNumber'].setValidators([Validators.required]);
      this.addNewPetForm.controls['assignedOn'].setValidators([Validators.required]);
      this.addNewPetForm.controls['deviceNumber'].updateValueAndValidity();
      this.addNewPetForm.controls['assignedOn'].updateValueAndValidity();
    }
    else {
      this.addNewPetForm.controls['deviceNumber'].setValidators([]);
      this.addNewPetForm.controls['assignedOn'].setValidators([]);
      this.addNewPetForm.controls['deviceNumber'].updateValueAndValidity();
      this.addNewPetForm.controls['assignedOn'].updateValueAndValidity();
    } */
    // this.addNewPetForm.controls['deviceNumber'].enable();
    // this.addNewPetForm.controls['assignedOn'].enable();

  }
  onClearStudy() {
    this.addNewPetForm.patchValue({
      'studyassDate':''
    })
    // this.addNewPetForm.controls.studyassDate.setValidators([]);
    // this.addNewPetForm.controls.studyassDate.updateValueAndValidity();
    // this.addNewPetForm.controls['deviceNumber'].setValidators([]);
    // this.addNewPetForm.controls['assignedOn'].setValidators([]);
    // this.addNewPetForm.controls['deviceNumber'].updateValueAndValidity();
    // this.addNewPetForm.controls['assignedOn'].updateValueAndValidity();

    // this.assetTypeArr = this.assetTypeArray;
    // this.assetModelArr = this.assetModelArray;
    // this.devices = this.devicesList;
    // this.addNewPetForm.patchValue({
    //   'assetType' : '',
    //   'deviceNumber' : '',
    //   'deviceModel' : '',
    // });
  }
  onClearAssetType() {
    if (!(this.addNewPetForm.value.deviceModel || this.addNewPetForm.value.deviceNumber)) {
      this.assetTypeArr = this.assetTypeArray;
      this.assetModelArr = this.assetModelArray;
      this.devices = this.devicesList;
    }
  }
  onClearModel() {
    if (!(this.addNewPetForm.value.assetType || this.addNewPetForm.value.deviceNumber)) {
      this.assetTypeArr = this.assetTypeArray;
      this.assetModelArr = this.assetModelArray;
      this.devices = this.devicesList;
    }
  }
  onClearDeviceNumber() {
    if (!(this.addNewPetForm.value.assetType || this.addNewPetForm.value.deviceModel)) {
      this.assetTypeArr = this.assetTypeArray;
      this.assetModelArr = this.assetModelArray;
      this.devices = this.devicesList;
    }
    this.addNewPetForm.patchValue({
      'deviceType': '',
      'deviceModel': '',
      'assetType':''
    });
    // this.addNewPetForm.controls.assignedOn.setValidators([]);
    // this.addNewPetForm.controls.assignedOn.updateValueAndValidity();
    // this.addNewPetForm.controls.study.setValidators([]);
    // this.addNewPetForm.controls.study.updateValueAndValidity();
  }

  newPetSubmit() {
    this.addNewPetForm.markAllAsTouched();
    if(this.addNewPetForm) {
      let ele = this.addNewPetForm.value
      // this.addNewPetForm.value.forEach((ele,i) => {
        if(ele.assignedOn) {
          //  this.addNewPetForm.controls.model.setValidators([Validators.required]);
          this.addNewPetForm.controls.deviceNumber.setValidators([Validators.required]);
          this.addNewPetForm.controls.study.setValidators([Validators.required]);
           this.addNewPetForm.controls.assetType.setValidators([Validators.required]);
           this.addNewPetForm.controls.studyassDate.setValidators([Validators.required]);
       
          //  this.addNewPetForm.controls.model.updateValueAndValidity();
           this.addNewPetForm.controls.deviceNumber.updateValueAndValidity();
           this.addNewPetForm.controls.study.updateValueAndValidity();
           this.addNewPetForm.controls.assetType.updateValueAndValidity();
           this.addNewPetForm.controls.studyassDate.updateValueAndValidity();
        }
        if(ele.assetType) {
          //  this.addNewPetForm.controls.model.setValidators([Validators.required]);
           this.addNewPetForm.controls.deviceNumber.setValidators([Validators.required]);
           this.addNewPetForm.controls.study.setValidators([Validators.required]);
           this.addNewPetForm.controls.assignedOn.setValidators([Validators.required]);
           this.addNewPetForm.controls.studyassDate.setValidators([Validators.required]);
       
          //  this.addNewPetForm.controls.model.updateValueAndValidity();
           this.addNewPetForm.controls.deviceNumber.updateValueAndValidity();
           this.addNewPetForm.controls.study.updateValueAndValidity();
           this.addNewPetForm.controls.assignedOn.updateValueAndValidity();
           this.addNewPetForm.controls.studyassDate.updateValueAndValidity();

        }
        if(ele.deviceModel) {
           this.addNewPetForm.controls.assetType.setValidators([Validators.required]);
           this.addNewPetForm.controls.deviceNumber.setValidators([Validators.required]);
           this.addNewPetForm.controls.study.setValidators([Validators.required]);
           this.addNewPetForm.controls.assignedOn.setValidators([Validators.required]);
           this.addNewPetForm.controls.studyassDate.setValidators([Validators.required]);
       
           this.addNewPetForm.controls.assetType.updateValueAndValidity();
           this.addNewPetForm.controls.deviceNumber.updateValueAndValidity();
           this.addNewPetForm.controls.study.updateValueAndValidity();
           this.addNewPetForm.controls.assignedOn.updateValueAndValidity();
           this.addNewPetForm.controls.studyassDate.updateValueAndValidity();
        }
        if(ele.deviceNumber) {
           this.addNewPetForm.controls.assetType.setValidators([Validators.required]);
           this.addNewPetForm.controls.assignedOn.setValidators([Validators.required]);
           this.addNewPetForm.controls.study.setValidators([Validators.required]);
           this.addNewPetForm.controls.studyassDate.setValidators([Validators.required]);
          //  this.addNewPetForm.controls.model.setValidators([Validators.required]);
       
           this.addNewPetForm.controls.assetType.updateValueAndValidity();
           this.addNewPetForm.controls.assignedOn.updateValueAndValidity();
           this.addNewPetForm.controls.study.updateValueAndValidity();
           this.addNewPetForm.controls.studyassDate.updateValueAndValidity();
          //  this.addNewPetForm.controls.model.updateValueAndValidity();
        }
        if(ele.study) {
          this.addNewPetForm.controls.assetType.setValidators([]);
          this.addNewPetForm.controls.deviceNumber.setValidators([]);
           this.addNewPetForm.controls.assignedOn.setValidators([]);
          this.addNewPetForm.controls.studyassDate.setValidators([Validators.required]);

          this.addNewPetForm.controls.assetType.updateValueAndValidity();
           this.addNewPetForm.controls.deviceNumber.updateValueAndValidity();
           this.addNewPetForm.controls.assignedOn.updateValueAndValidity();
          this.addNewPetForm.controls.studyassDate.updateValueAndValidity();

        }
        if(ele.studyassDate) {
          this.addNewPetForm.controls.assetType.setValidators([]);
          this.addNewPetForm.controls.deviceNumber.setValidators([]);
           this.addNewPetForm.controls.assignedOn.setValidators([]);
           this.addNewPetForm.controls.study.setValidators([Validators.required]);
       
           this.addNewPetForm.controls.assetType.updateValueAndValidity();
           this.addNewPetForm.controls.deviceNumber.updateValueAndValidity();
           this.addNewPetForm.controls.assignedOn.updateValueAndValidity();
           this.addNewPetForm.controls.study.updateValueAndValidity();
        }
        if(ele.assignedOn == null && ele.assetType == '' && ele.deviceModel == '' && ele.deviceNumber == '' && ele.study == '' && ele.studyassDate == '') {
          console.log("no validations")
             this.addNewPetForm.controls.assetType.setValidators([]);
           this.addNewPetForm.controls.deviceNumber.setValidators([]);
           this.addNewPetForm.controls.assignedOn.setValidators([]);
           this.addNewPetForm.controls.deviceModel.setValidators([]);
           this.addNewPetForm.controls.study.setValidators([]);
           this.addNewPetForm.controls.studyassDate.setValidators([]);
       
           this.addNewPetForm.controls.assetType.updateValueAndValidity();
           this.addNewPetForm.controls.deviceNumber.updateValueAndValidity();
           this.addNewPetForm.controls.assignedOn.updateValueAndValidity();
           this.addNewPetForm.controls.deviceModel.updateValueAndValidity();
           this.addNewPetForm.controls.study.updateValueAndValidity();
           this.addNewPetForm.controls.studyassDate.updateValueAndValidity();
        }
        
      // })
    }
    if (this.addNewPetForm.valid) {
      console.log("this.petInfoForm", this.addNewPetForm.value);
      // let duplicateRecord = false;
      let newPetForm = this.addNewPetForm.value;
      //check for duplicates with the array list

      let res = Object.assign({});

      let data = this.tabservice.getModelData();
      console.log(data);
      console.log("this.editFlag", this.editFlag);
      let petParentsArr = [];
      petParentsArr.push({
        // "petParentName":  data.parentDetails.petParentName,
        "petParentFirstName": data.parentDetails.petParentFirstName,
        "petParentLastName": data.parentDetails.petParentLastName,
        "email": data.parentDetails.email,
        "phoneNumber": data.parentDetails.phoneNumberCode + data.parentDetails.phoneNumberValue,
        "shippingAddress": data.parentDetails.address,
        "petParentId": this.editFlag ? data.parentDetails.petParentId : 0
      });
      //res["petParents"] = petParentsArr;  // Commented for pet parent values are already sending in submit.
      // res["status"] = data.parentDetails.status;
      // res["isActive"] = true;
      res["petName"] = newPetForm.petName;
      res["petImage"] = newPetForm.petPhoto;
      res["breedId"] = newPetForm.breed.breedId;
      res["breedName"] = newPetForm.breed.breedName;
      res["gender"] = newPetForm.gender;
      res["weight"] = newPetForm.weight;
      res["weightUnit"] = newPetForm.weightUnits;
      res["dateOfBirth"] = this.customDatePipe.transform(newPetForm.dob, 'yyyy-MM-dd');
      res["isNeutered"] = newPetForm.category == 'Neutered' ? true : false;
      res["isActive"] = true;
      res["petStatusId"] = newPetForm.petStatus ? newPetForm.petStatus : '';


      let petDevicesArr = [];
      if (newPetForm.study.studyId) {
        petDevicesArr.push({
          "studyId": newPetForm.study.studyId,
          "deviceId": newPetForm.deviceNumber.deviceId,
          "deviceNumber": newPetForm.deviceNumber.deviceNumber,
          "assignedOn": newPetForm.assignedOn ? this.customDatePipe.transform(newPetForm.assignedOn, 'yyyy-MM-dd') : '',
          "assignedOnDate":newPetForm.assignedOn ? this.customDatePipe.transform(newPetForm.assignedOn, 'yyyy-MM-dd HH:mm:ss'): '',
          "externalPetInfoId":newPetForm.externalPet.externalPetInfoId ? newPetForm.externalPet.externalPetInfoId :'',
          "externalPetValue":newPetForm.externalPet.externalPetValue ? newPetForm.externalPet.externalPetValue : '',
          "studyAssignedOnDate":newPetForm.studyassDate ? this.customDatePipe.transform(newPetForm.studyassDate, 'yyyy-MM-dd HH:mm:ss'): '',
        });
      }

      res["petDevices"] = petDevicesArr;

      this.spinner.show();
      this.petservice.addPet('/api/pets', res).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Pet added to Pet Parent successfully!');
          this.newPetArr.push(
            {
              'petPhoto': newPetForm.petPhoto ? newPetForm.petPhoto : '',
              'petName': newPetForm.petName ? newPetForm.petName : '',
              'breed': newPetForm.breed ? newPetForm.breed : '',
              'weight': newPetForm.weight ? newPetForm.weight : '',
              "weightUnits": newPetForm.weightUnits ? newPetForm.weightUnits : '',
              'gender': newPetForm.gender ? newPetForm.gender : '',
              'dob': newPetForm.dob ? newPetForm.dob : '',
              'study': newPetForm.study ? newPetForm.study : '',
              'deviceNumber': newPetForm.deviceNumber ? newPetForm.deviceNumber : '',
              'deviceModel': newPetForm.deviceModel ? newPetForm.deviceModel : '',
              'assignedOn': newPetForm.assignedOn ? newPetForm.assignedOn : '',
              'petStatus': newPetForm.petStatus ? newPetForm.petStatus : '',
              'category': newPetForm.category ? newPetForm.category : '',
              'petId': res.response.petDTO['petId']
            });


          this.addNewPetForm.patchValue({
            'petPhoto': '',
            'petName': '',
            'breed': '',
            'species':'',
            'weight': '',
            "weightUnits": 'LBS',
            'gender': '',
            'dob': '',
            'study': '',
            'deviceNumber': '',
            'deviceModel': '',
            'assignedOn': '',
            'petStatus': 1,
            'category': '',
            'studyassDate':'',
            'startDate':'',
            'endDate':'',
            'externalPet':'',
          });
          this.addNewPetForm.markAsUntouched();

          this.spinner.hide();
        }
        else {
          this.toastr.error(res.errors[0].message);
          // this.addNewPetForm.patchValue({
          //   'petPhoto': '',
          //     'petName': '',
          //     'breed': '',
          //     'weight': '',
          //     "weightUnits": '',
          //     'gender': '',
          //     'dob': '',
          //     'study':'',
          //     'deviceNumber': '',
          //     'deviceModel': '',
          //     'assignedOn':'',
          //     'petStatus': '',
          //     'category': ''
          // });
          // this.addNewPetForm.markAsUntouched();
          this.spinner.hide();
        }
      }, err => {
        // this.addNewPetForm.patchValue({
        //   'petPhoto': '',
        //     'petName': '',
        //     'breed': '',
        //     'weight': '',
        //     "weightUnits": '',
        //     'gender': '',
        //     'dob': '',
        //     'study':'',
        //     'deviceNumber': '',
        //     'deviceModel': '',
        //     'assignedOn':'',
        //     'petStatus': '',
        //     'category': ''
        // });
        // this.addNewPetForm.markAsUntouched();
        console.log(err);
        this.errorMsg(err);
      });



    }
  }

  private async getStudyList() {
    let res2: any = await (
      this.adduserservice.getStudy('/api/study/getStudyList', '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (res2.status.success === true) {
      this.studyArr = res2.response.studyList;
      this.spinner.hide();
    }
  }

  deviceSelected($event) {
    this.addNewPetForm.patchValue({
      'assetType': $event.deviceType ? { name: $event.deviceType } : '',
      'deviceModel': $event.deviceModel ? { name: $event.deviceModel } : ''
    });
    // this.addNewPetForm.controls.assignedOn.setValidators([Validators.required]);
    //   this.addNewPetForm.controls.assignedOn.updateValueAndValidity();
    //   this.addNewPetForm.controls.study.setValidators([Validators.required]);
    //   this.addNewPetForm.controls.study.updateValueAndValidity();
  }
  
  yes() {
    this.submitFlag = true;
    if (this.addFlag) {
      this.router.navigate(['/user/petparent/add-pet-parent/pet-parent-details']);
    }
    else if (this.editFlag) {
      this.router.navigate([`/user/petparent/edit-pet-parent/${this.editId}/pet-parent-details`]);
    }
    else if (this.viewFlag) {
      this.router.navigate([`/user/petparent/view-pet-parent/${this.editId}/pet-parent-details`]);
    }
  }

  back() {
    if (this.addNewPetForm.pristine == false && !this.submitFlag) {
      // return this.alertService.confirm();
      this.openPopup(this.archiveContent2, 'xs');
  }
  else {
    this.submitFlag = true;
  
    // this.tabservice.setModelData(this.petArr, 'associatePet');
    if (this.addFlag) {
      this.router.navigate(['/user/petparent/add-pet-parent/pet-parent-details']);
    }
    else if (this.editFlag) {
      this.router.navigate([`/user/petparent/edit-pet-parent/${this.editId}/pet-parent-details`]);
    }
    else if (this.viewFlag) {
      this.router.navigate([`/user/petparent/view-pet-parent/${this.editId}/pet-parent-details`]);
    }
  }
  }

  submitPetParent() {
    let res = Object.assign({});
    let data = this.tabservice.getModelData();
    console.log(data);


    this.petArr = [];
    let existingPet = JSON.parse(JSON.stringify(this.existingPetArr));
    let newPet = JSON.parse(JSON.stringify(this.newPetArr));
    this.petArr = (existingPet ? existingPet : []).concat(newPet ? newPet : []);
    console.log("petArr", this.petArr);
    this.tabservice.setModelData(this.petArr, 'associatePet');
    // || !(data.hasOwnProperty('associatePet'))
    if (!(data.hasOwnProperty('parentDetails'))) {
      if (!(data.hasOwnProperty('parentDetails'))) {
        this.toastr.error("Please select all mandatory fields in Basic Details tab");
      }
      // if (!(data.hasOwnProperty('associatePet'))) {
      //   this.toastr.error("Please select all mandatory fields in Associate Pet tab");
      // }
      return;
    }

    if (this.editFlag) {
      res["petParentId"] = this.editId;
    }
    //res["petParentName"] = data.parentDetails.petParentName;
    res["petParentFirstName"] = data.parentDetails.petParentFirstName;
    res["petParentLastName"] = data.parentDetails.petParentLastName;
    res["email"] = data.parentDetails.email;
    // res["status"] = data.parentDetails.status;
    res["isActive"] = data.parentDetails.status == '1' ? true : false;
    res["phoneNumber"] = data.parentDetails.phoneNumberValue ? (data.parentDetails.phoneNumberCode + data.parentDetails.phoneNumberValue) : '';
    res["shippingAddress"] = data.parentDetails.address;
    res["status"] = parseInt(data.parentDetails.status);


    // if (this.petArr.length == 0) {
    //   this.toastr.error('Please select at least one pet parent', 'Error!');
    //   return;
    // }
    this.submitFlag = true;
    let petIdArr = [];
    let onStudyPetExist = false;
    if (this.petArr.length > 0) {
      this.petArr && this.petArr.forEach(ele => {
        petIdArr.push(ele.petId);
        if (ele.petStatus && ele.petStatus == '2') {
          onStudyPetExist = true;
        }
      })
    }
    else {
      petIdArr = [];
    }
    if (this.editFlag && (onStudyPetExist && data.parentDetails.status == '0')) {
      this.toastr.error(`Cannot Inactive ${data.parentDetails.petParentFirstName + ' ' + data.parentDetails.petParentLastName} which is already being referenced`);
      return;
    }
    console.log("petIdArr", petIdArr);
    res["petsAssociated"] = petIdArr;

    // let petsArr = [];
    // data.petArr.forEach(ele => {
    //   petsArr.push({
    //     // "petParentName": ele.ppName,
    //     // "email": ele.ppEmail,
    //     // "phoneNumber": ele.phoneNumberValue,
    //     // "shippingAddress": ele.addr
    //     "petId": 0,
    //     "petName": "string",
    //     "petPhoto": "string",
    //     "breedName": petArr.breedName,
    //     "weight": "string",
    //     "gender": "string",
    //     "dob": "2021-02-03",
    //     "isNeutered": 0,
    //     "petStatus": 0,
    //     "isDeceased": 0,
    //     "deviceNumber": "string",
    //     "deviceType": "string",
    //     "deviceModel": "string"
    //   })
    // });
    // 

    if (!this.editFlag) {

      this.spinner.show();
      this.petParentService.addPetParentService('/api/petParents', res).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Pet Parent added successfully!');
          this.spinner.hide();
          this.tabservice.clearDataModel();
          this.router.navigate(['/user/petparent']);
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      }, err => {
        console.log(err);
        this.errorMsg(err);
      });
    }
    else {
      this.spinner.show();
      this.petParentService.updatePetParentService('/api/petParents', res).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Pet Parent updated successfully!');
          this.spinner.hide();
          this.tabservice.clearDataModel();
          this.router.navigate(['/user/petparent']);
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      }, err => {
        console.log(err);
        this.errorMsg(err);
      });

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


  ngAfterViewInit() {
    this.addNewPetForm.patchValue({
      'petStatus': 1,
      'weightUnits': 'LBS'
    });
  }

  canDeactivate(component, route, state, next) {
    let petArr = [];
    petArr = (this.existingPetArr ? this.existingPetArr : []).concat(this.newPetArr ? this.newPetArr : []);
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/petparent') > -1 && this.submitFlag) {
      return true;
    }
    // all tabs subscribe data 
    if (next.url.indexOf('/petparent/add-pet-parent') > -1 || next.url.indexOf('/petparent/edit-pet-parent') > -1) {

      if (this.addNewPetForm.pristine == false) {
          return this.alertService.confirm();
      }
      else {
      console.log("this.submitFlag", this.submitFlag);
      this.submitFlag = true;
      this.tabservice.setModelData(petArr, 'associatePet');
      let data = this.tabservice.getModelData();
      console.log("datadatadata", data);
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (petArr.length > 0 || Object.keys(data).length > 0) {
        return this.alertService.confirm();
      }
      else {
        return true
      }
    }

    if (!this.submitFlag) {
      return false;
    }
    else {
      return true;
    }

  }
  edit(list) {
    console.log(list);
    this.existingpetInfoForm.patchValue({
      pet: { petId: list.petId, petName: list.petName }
    })
  }

  deleteRecord() {
    if (this.list.petStatus == '2') {
      this.modalRef2.close();
    //  this.toastr.error(`Cannot delete ${this.list.petName} as it is already a part of an ongoing study On Study`);
      this.toastr.error(`Cannot dissociate ${this.list.petName} as it is a part of an ongoing study.`);
      return;
    }
    this.existingPetArr.forEach((ele, i) => {
      if (this.list.petId == ele.petId) {
        this.existingPetArr.splice(i, 1);
      }
    })
    this.modalRef2.close();
  }

  delete(list) {
    this.list = list;
    this.openPopup(this.archiveContent, 'xs');
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

}
