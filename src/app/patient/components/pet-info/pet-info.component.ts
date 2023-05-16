import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { PetService } from '../../pet.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-pet-info',
  templateUrl: './pet-info.component.html',
  styleUrls: ['./pet-info.component.scss']
})
export class PetInfoComponent implements OnInit {
  @ViewChild('archiveContent') archiveContent: ElementRef;
  petInfoForm: FormGroup;
  breedArr: any;
  startDate: any;
  submitFlag: boolean;
  editFlag: boolean = false;
  editId: string;
  modalRef2: NgbModalRef;
  studyArr: any;
  speciesArr: any;
  formDataCopy: any;
  deceasedStatus: boolean = false;
  offStatus: boolean = false;
  newAArr: any[];
  isVirtual: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tabservice: TabserviceService,
    private petService: PetService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private customDatePipe: CustomDateFormatPipe,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {

    this.petInfoForm = this.fb.group({
      'petImage': [''],
      'petImageUrl': [''],
      'petImageFileName': [''],
      'petName': ['', [Validators.required, ValidationService.whiteSpaceValidator, ValidationService.exceptSpecialChar]],
      'dateofBirth': [''],
      'breed': ['', [Validators.required]],
      'species': ['', [Validators.required]],
      'speciesName': [''],
      'weightUnits': '',
      // 'weight': ['', [ValidationService.decimalValidatorWithValue]],
      'status': ['', [Validators.required]],
      'gender': [''],
      'category': [''],
      'confirmOffStudy': false,
      'petPreviousStatus': [''],
      'statusDisable': false
    })
  }

  ngAfterViewInit() {

    this.tabservice.dataModel$.subscribe(res => {
      console.log(res);
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
      if (!(data.hasOwnProperty('petInfo'))) {
        this.petInfoForm.patchValue({
          'status': 1,
          'weightUnits': 'LBS',
        });
      }
      else {
        res = res ? (res['petInfo'] ? res['petInfo'] : '') : '';
        this.petInfoForm.patchValue({
          //'petImage': res.petImage ? res.petImage :'',
          'petImageUrl': res.petImageUrl ? res.petImageUrl : '',
          'petImageFileName': res.petImageFileName ? res.petImageFileName : '',
          'petName': res.petName ? res.petName : '',
          'dateofBirth': res.dateofBirth ? (this.customDatePipe.transform(res.dateofBirth, 'MM-dd-yyyy')) : '',
          'breed': { "breedName": res.breed ? res.breed.breedName : '', "breedId": res.breed ? res.breed.breedId : '' },
          'weightUnits': res.weightUnits ? res.weightUnits : '',
          'weight': res.weight ? res.weight : '',
          'status': res.status ? res.status : '',
          'gender': res.gender ? res.gender : '',
          'category': res.category ? res.category : '',
          'speciesName': res.speciesName ? res.speciesName : '',
          'species': res.species ? res.species : '',
          'petPreviousStatus': res.petPreviousStatus ? res.petPreviousStatus : '',
          'statusDisable': res.statusDisable ? res.statusDisable : ''
        });
        // let breedId = this.petInfoForm.value.breed.breedId;
        // this.breedArr && this.breedArr.forEach(ele => {
        //   if (ele.breedId == breedId) {
        //     this.petInfoForm.patchValue({
        //       "species": ele.speciesId ? ele.speciesId : ''
        //     })
        //   }
        // });

        //commenting after getting species name in service
        // let speciArr:any = [];
        // let speciesId = this.petInfoForm.value.species;
        // if(this.speciesArr) {
        //   speciArr = this.speciesArr.filter(ele => ele.speciesId == speciesId);
        // }
        // this.petInfoForm.patchValue({
        //   "speciesName": speciArr[0] ? (speciArr[0].speciesName ? speciArr[0].speciesName : '') : ''
        // })

      }
    });

    this.formDataCopy = JSON.parse(JSON.stringify(this.petInfoForm.value));

  }
  private async getStudy() {
    this.spinner.show();
    let res: any = await (
      this.petService.getPet('/api/study/getStudyList', '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (res.status.success === true) {
      this.studyArr = res.response.studyList;
      this.spinner.hide();
    }
  }
  private async getSpecies() {
    this.spinner.show();
    let res: any = await (
      this.petService.getPet('/api/lookup/getPetSpecies', '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (res.status.success === true) {
      this.speciesArr = res.response.species;
      this.spinner.hide();
    }
  }

  breedSelected($event) {
    console.log("$event", $event);
    this.petInfoForm.patchValue({
      "species": $event.speciesId ? $event.speciesId : ''
    })
    let speciArr: any = [];
    let speciesId = this.petInfoForm.value.species;
    if (this.speciesArr) {
      speciArr = this.speciesArr.filter(ele => ele.speciesId == speciesId);
    }
    this.petInfoForm.patchValue({
      "speciesName": speciArr[0] ? (speciArr[0].speciesName ? speciArr[0].speciesName : '') : ''
    })
  }

  async ngOnInit() {
    this.startDate = moment().format("MM-DD-YYYY");
    this.spinner.show();
    this.petService.getPet('/api/lookup/getPetBreeds', '').subscribe(res => {
      console.log("res", res);

      this.breedArr = res.response.breeds;
      this.newAArr = this.breedArr;
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );
    await this.getSpecies();

    //check for edit and view
    if (this.router.url.indexOf('/edit-patient') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("edit-patient/")[1].split("/")[0];
      this.editFlag = true;
      this.editId = id;
      this.spinner.show();
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (Object.keys(data).length == 0 || !data.petInfo) {
        await this.getStudy();
        await this.getSpecies();
        this.petService.getPet(`/api/pets/${id}`, '').subscribe(res => {
          console.log("petService edit::", res);
          if (res.status.success == true) {
            let petDetails = res.response.petDTO;

            let editData1 = Object.assign({});
            editData1["petImage"] = petDetails.photoName ? petDetails.photoName : '';
            editData1["petImageFileName"] = petDetails.photoName ? petDetails.photoName : '';
            editData1["petImageUrl"] = petDetails.petPhotoUrl ? petDetails.petPhotoUrl : '';
            editData1["petName"] = petDetails.petName ? petDetails.petName : '';
            editData1["dateofBirth"] = petDetails.dateOfBirth ? this.customDatePipe.transform(petDetails.dateOfBirth, 'MM-dd-yyyy') : '';
            editData1["breed"] = { "breedName": petDetails.breedName ? petDetails.breedName : '', "breedId": petDetails.breedId ? petDetails.breedId : '' };
            editData1["weightUnits"] = petDetails.weightUnit ? petDetails.weightUnit : '';
            editData1["weight"] = petDetails.weight ? petDetails.weight : '';
            editData1["status"] = petDetails.petStatusId ? petDetails.petStatusId : '1';
            if (petDetails.petStatusId == 3) {
              editData1["statusDisable"] = true;
            }
            else {
              editData1["statusDisable"] = false;
            }
            editData1["petPreviousStatus"] = petDetails.petStatusId ? petDetails.petStatusId : '1';

            editData1["gender"] = petDetails.gender ? petDetails.gender : '';
            editData1["category"] = petDetails.isNeutered == true ? 'Neutered' : 'Spayed';
            editData1["species"] = petDetails.speciesId ? petDetails.speciesId : '';
            editData1["speciesName"] = petDetails.speciesName ? petDetails.speciesName : '';

            // this.breedArr && this.breedArr.forEach(ele => {
            //   if(ele.breedId == petDetails.breedId) {
            //     editData1["species"] = ele.speciesId ? ele.speciesId :'';
            // }
            // });
            // let speciesId =  editData1["species"];
            // this.speciesArr && this.speciesArr.forEach(ele => {
            //   if(ele.speciesId == speciesId) {
            //     editData1["speciesName"] = ele.speciesName ? ele.speciesName : '';
            //   }
            // })

            this.tabservice.setModelData(editData1, 'petInfo');
            this.formDataCopy = JSON.parse(JSON.stringify(editData1));
            console.log("formDataCopy", this.formDataCopy);

            let editData2 = Object.assign({});
            let editData2Arr = [];
            petDetails.petDevices.forEach(ele => {
              this.studyArr && this.studyArr.forEach(res => {
                if (ele.studyId == res.studyId) {
                  if (res.studyId == 2901)
                    this.isVirtual = true;
                  editData2Arr.push({
                    "studyName": { studyId: res.studyId ? res.studyId : '', studyName: res.studyName ? res.studyName : '', startDate: res.startDate, endDate: res.endDate },
                    "startDate": res.startDate ? moment(res.startDate).format("MM-DD-YYYY") : '',
                    "endDate": res.endDate ? moment(res.endDate).format("MM-DD-YYYY") : '',
                    "studyassDate": ele.studyAssignedOn ? moment(ele.studyAssignedOn).format("MM-DD-YYYY") : '',
                    "externalPet": (ele.externalPetInfoId != '' && ele.externalPetInfoId != 'null') ? { "externalPetId": ele.externalPetInfoId ? ele.externalPetInfoId : '', "externalPetValue": ele.externalPetValue ? ele.externalPetValue : '' } : '',
                    "isExternal": ele.external,
                    "disabled": false,
                    "isVirtual": (res.studyId == 2901) ? true : false,
                    "studyDescription": ele.studyDescription
                  });
                }
              })

            });
            if (editData2Arr.length > 0) {
              editData2["arr"] = editData2Arr;
              this.tabservice.setModelData(editData2, 'petStudy');
            }

            let editData3 = Object.assign({});
            let editData3Arr = [];
            petDetails.petDevices.forEach(ele => {
              if (ele.studyId && ele.deviceNumber) {
                editData3Arr.push({
                  "assignedOn": ele.assignedOn,
                  "deviceNumber": { "deviceId": ele.deviceId, "deviceNumber": ele.deviceNumber },
                  "model": ele.deviceModel ? { name: ele.deviceModel } : '',
                  "study": ele.studyId,
                  "studyName": ele.studyName,
                  'petStudyDeviceId': ele.petStudyDeviceId,
                  'petStudyId': ele.petStudyId,
                  'assetType': ele.deviceType ? { name: ele.deviceType } : '',
                  'unAssignedOn': ele.unAssignedOn ? ele.unAssignedOn : '',
                  'unAssignReason': ele.unAssignReason ? ele.unAssignReason : '',
                  "disabled": false
                });
              }
            })
            editData3["arr"] = editData3Arr;
            console.log("editData3", editData3);
            if (editData3Arr.length > 0) {
              editData3["arr"] = editData3Arr;
              this.tabservice.setModelData(editData3, 'petDevice');
            }

            let editData4Arr = [];
            petDetails.petParents.forEach(ele => {
              editData4Arr.push({
                "ppId": ele.petParentId,
                "ppName": ele.petParentName,
                "petParentFirstName": ele.firstName,
                "petParentLastName": ele.lastName,
                "ppEmail": ele.email ? ele.email : '',
                "phoneNumberValue": ele.phoneNumber ? ele.phoneNumber : '',
                "addr": ele.shippingAddress ? ele.shippingAddress : ''
              });
            })
            //mobile number handling here as in pet parent infi tab ,
            //  it is breaking the logic on every tab click on it

            //format mobile number
            editData4Arr && editData4Arr.forEach(ele => {
              let phoneNumber = ele.phoneNumberValue;
              // debugger;
              if (phoneNumber) {
                // phoneNumber.replace(/ /g, "");
                // let desired = phoneNumber.replace(/[^\w\s]/gi, '');
                phoneNumber = phoneNumber.replace(/ /g, "");
                let desired = phoneNumber.replace(/[^\w\s]/gi, '');
                console.log("desired", desired);
                phoneNumber = desired;

                if (desired.startsWith("44")) {
                  phoneNumber = this.formatUKPhoneNumber(phoneNumber);
                }
                else {
                  phoneNumber = this.formatUSPhoneNumber(phoneNumber);
                }
                ele.phoneNumberValue = phoneNumber;
              }

            })
            this.tabservice.setModelData(editData4Arr, 'petExistingArr');

          }
          else {
            this.toastr.error(res.errors[0].message);
          }
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          console.log(err);
          this.errorMsg(err);
        }
        );
      }

    }

    this.spinner.hide();
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
    console.log("phoneNumber in pet info", phoneNumber)
    // let phoneNumberArr = phoneNumber.toString().split("44");
    let phoneNumberArr = phoneNumber.toString().split(/44(.+)/);
    console.log("phoneNumberArr", phoneNumberArr)
    let genPh = phoneNumberArr[1]
    // return phoneNumberArr[1].replace(/\s+/g, '').replace(/(.)(\d{4})(\d)/, '+44 $1 - $2 - $3');
    let newString = '+44' + ' ' + genPh.substr(0, 2) + '-' + genPh.substr(2, 4) + '-' + genPh.substr(6, 4);
    return newString
  }

  onSubmit($event) {

  }

  speciesSelected($event) {
    this.petInfoForm.patchValue({
      'breed': ''
    })
    console.log("selected", $event);
    let speciesId = $event.target.value;
    console.log("speciesId", speciesId);
    let breedFilter = [];
    breedFilter = this.breedArr;

    // this.newAArr =[];
    this.newAArr = breedFilter.filter(ele => ele.speciesId == speciesId);
    console.log("this.breedArr", this.breedArr)
  }


  errorMsg(err) {
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
  }

  selectFileResult(event) {
    if (event.target.files[0] && 'jpeg, jpg, png, svg'
      .search(new RegExp(event.target.files[0].name.split('.')[1], 'i')) == -1) {
      this.toastr.error('Invalid file format (Valid formats are jpeg, jpg, png ,svg).', 'Error!');
      this.petInfoForm.patchValue({ 'petImage': '' });
      this.petInfoForm.markAsUntouched();
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
    formData.append("moduleName", 'PetPhoto');
    this.spinner.show();
    this.petService.bulkUpload('/api/fileUpload/uploadFile', formData).subscribe(res => {
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
        this.petInfoForm.patchValue({ 'petImage': res.response, 'petImageUrl': fileUrl, 'petImageFileName': fileName });

      } else {
        this.toastr.error('Please select a valid file for uploading.', 'Error!');
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
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

  changeValue() {
    this.modalRef2.close();
    this.submitFlag = true;
    this.tabservice.setModelData(this.petInfoForm.value, 'petInfo');
    let data = this.tabservice.getModelData();
    console.log("datadatadata", data);
    // if (!this.editFlag) {
    //   this.router.navigate(['/user/patients/add-patient/pet-study']);
    // }
    // else {
    //   this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-study`]);
    // }
  }
  unChangeValue() {
    this.petInfoForm.patchValue({
      //'petImage': res.petImage ? res.petImage :'',
      // 'petImageUrl' : this.formDataCopy.petImageUrl ? this.formDataCopy.petImageUrl : '',
      // 'petImageFileName' :  this.formDataCopy.petImageFileName ? this.formDataCopy.petImageFileName : '',
      // 'petName': this.formDataCopy.petName ? this.formDataCopy.petName :'',
      // 'dateofBirth': this.formDataCopy.dateofBirth ? (this.customDatePipe.transform(this.formDataCopy.dateofBirth, 'MM-dd-yyyy')) :'',
      // 'breed':{"breedName": this.formDataCopy.breed ? this.formDataCopy.breed.breedName : '',"breedId":this.formDataCopy.breed ? this.formDataCopy.breed.breedId :''},
      // 'weightUnits':this.formDataCopy.weightUnits ? this.formDataCopy.weightUnits :'',
      // 'weight':this.formDataCopy.weight ? this.formDataCopy.weight :'',
      'status': this.formDataCopy.status ? this.formDataCopy.status : '',
      // 'gender':this.formDataCopy.gender ? this.formDataCopy.gender :'',
      // 'category':this.formDataCopy.category ? this.formDataCopy.category :'',
      // 'speciesName':this.formDataCopy.speciesName ? this.formDataCopy.speciesName : '',
      // 'species':this.formDataCopy.speciesId  ? this.formDataCopy.speciesId:''
    });
  }

  next() {
    let data = this.tabservice.getModelData();
    this.petInfoForm.markAllAsTouched();
    if (this.petInfoForm.valid) {
      if (this.editFlag && !this.submitFlag) {
        if (this.petInfoForm.value.status == "3" && this.formDataCopy.status != "3") {
          this.deceasedStatus = true;
          this.offStatus = false;
          this.openPopup(this.archiveContent, 'xs');
        }
        else if (this.petInfoForm.value.status == "1" && this.formDataCopy.status != "1" && (data.hasOwnProperty('petStudy'))) {
          // && (data.hasOwnProperty('petStudy'))
          this.offStatus = true;
          this.deceasedStatus = false;
          this.openPopup(this.archiveContent, 'xs');
        }
        else {
          this.submitFlag = true;
          this.tabservice.setModelData(this.petInfoForm.value, 'petInfo');

          console.log("datadatadata", data);
          if (!this.editFlag) {
            this.router.navigate(['/user/patients/add-patient/pet-study']);
          }
          else {
            this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-study`]);
          }

        }
      }
      else {
        this.submitFlag = true;
        this.tabservice.setModelData(this.petInfoForm.value, 'petInfo');

        console.log("datadatadata", data);
        if (!this.editFlag) {
          this.router.navigate(['/user/patients/add-patient/pet-study']);
        }
        else {
          this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-study`]);
        }

      }

    }
    else {
      this.submitFlag = false;
    }
  }
  back() {

  }
  canDeactivate(component, route, state, next) {
    console.log('i am navigating away');
    console.log("routein basic", next.url);
    let data = this.tabservice.getModelData();
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/add-patient') > -1 || next.url.indexOf('/edit-patient') > -1) {
      this.petInfoForm.markAllAsTouched();
      if (this.petInfoForm.valid) {
        if (this.editFlag && !this.submitFlag) {
          if (this.petInfoForm.value.status == "3" && this.formDataCopy.status != "3") {
            this.deceasedStatus = true;
            this.offStatus = false;
            this.openPopup(this.archiveContent, 'xs');
          }
          else if (this.petInfoForm.value.status == "1" && this.formDataCopy.status != "1" && (data.hasOwnProperty('petStudy'))) {
            // && (data.hasOwnProperty('petStudy'))
            this.offStatus = true;
            this.deceasedStatus = false;
            this.openPopup(this.archiveContent, 'xs');
          }
          else {
            this.submitFlag = true;
            this.tabservice.setModelData(this.petInfoForm.value, 'petInfo');

          }
        }
        else {
          this.submitFlag = true;
          this.tabservice.setModelData(this.petInfoForm.value, 'petInfo');
          // let data = this.tabservice.getModelData();
          console.log("datadatadata in petinfo candeactivate", data);
        }
      }
      else {
        this.submitFlag = false;
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (this.petInfoForm.touched) { //this.petInfoForm.pristine == false || Object.keys(data).length > 0
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

}
