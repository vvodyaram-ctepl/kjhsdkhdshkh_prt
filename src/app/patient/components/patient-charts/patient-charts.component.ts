import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as XLSX from 'xlsx'; 
import { ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { PetService } from '../../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/components/validation-message/validation.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-patient-charts',
  templateUrl: './patient-charts.component.html',
  styleUrls: ['./patient-charts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PatientChartsComponent implements OnInit {
  RWFlag: boolean = false;
  submitted = false;
  petId: any;
  studyId: any;
  petCharts: any = [];
  weightArr: any = [];
  //paginatio logic
  parentPage = 1;
  parentpageSize = 5;
//paginatio logic ends
  toDateMinDate: any;
  watchHistoryForm: FormGroup;
  submitFlag:boolean = false;

  public toDate: any = moment().format('MM-DD-YYYY');
  public fromDate: any = moment(this.toDate).subtract(1,'months').format('MM-DD-YYYY');
  public petDobDate:any;
  fileName= 'Weight History'; 
  @ViewChild('archiveContent') archiveContent: ElementRef;
  modalRef2: NgbModalRef;

  //bar chart
  public barChartOptions: ChartOptions = {
    plugins: {
      datalabels: {
        display: false
      }
    },
  };

  public barChartLabels: Label[] = [];
  // ['TUE SEP 01', 'TUE SEP 02', 'TUE SEP 03', 'TUE SEP 04', 'TUE SEP 05', 'TUE SEP 06', 'TUE SEP 07', 'TUE SEP 08'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins: ChartOptions = {
    plugins: {
      datalabels: {
        display: false,
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          console.log("label",label)
          console.log("ctx.chart.data",ctx.chart.data)
          console.log("ctx.chart.data.labels",ctx.chart.data.labels)
          console.log("ctx.chart.data.labels[ctx.dataIndex]",ctx.chart.data.labels[ctx.dataIndex])
          return label;
       }
      }
    },
  };

  public barChartData: ChartDataSets[] = [
    // { data: this.weightArr, label: 'Series A' },
    // { data: [28, 48, 40, 19, 86, 27, 90, 40], label: 'Weight' }
  ];

  public barChartColors: Color[] = [
    { backgroundColor: '#F6D7A7' },
    { backgroundColor: '#A2416B' },
  ]

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  currentDate: string = '';
  editWeight: boolean = false;
  petWeightId: void;
  petWeightUnit: any;
  exportDataExcel: any = [];
  maxNumber: number;
  weightDupArr: any[];
  petDetails: any;
  petDeceased: any;


  constructor(
    private petService: PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private customDatePipe: CustomDateFormatPipe,
    private modalService: NgbModal,
    private customDatepipe: CustomDateFormatPipe,
    private tabService: TabserviceService,
    private userDataService: UserDataService
  ) {
    this.watchHistoryForm = this.fb.group({
      date: ['', Validators.required],
      weight: ['', [Validators.required, ValidationService.decimalValidatorWithValue]],
      weightUnits: [''],
      dontKnow:['']
    })
  }

  async ngOnInit() {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    // userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
    //   if (ele.menuId == 21 && ele.menuActionId == 3) {
    //     this.RWFlag = true;
    //   }
    // });
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "14") {
        menuActionId = ele.menuActionId;
        let menuId = ele.menuId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    // this.spinner.show();
    this.currentDate = moment().format("MM-DD-YYYY");
    // this.buildForm();
    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.petId = str.split("view/")[1].split("/")[0];
      this.studyId = str.split("view/")[1].split("/")[1];
    })

    await this.getInitialData(this.fromDate, this.toDate);
  
    // await this.loadOptions();
    this.watchHistoryForm.patchValue({
      weightUnits: 'lbs',
    });
  }
  onDateSelect($event) {
    if (moment(this.toDate) < moment(this.fromDate)) {
      this.toDate = '';

    }
  }

  exportAsXLSX(){
      //  /* table id is passed over here */   
      //  let element = document.getElementById('excel-table'); 
      //  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

      //  /* generate workbook and add the worksheet */
      //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
      //  XLSX.utils.book_append_sheet(wb, ws, 'data');

      //  /* save to file */
      //  XLSX.writeFile(wb, this.fileName);
      this.exportAsExcelFile(this.excelData(), this.fileName);
  }

  excelData() {
    const arr = [];
    this.exportDataExcel = this.petCharts;
    this.exportDataExcel.forEach(ele => {
      const obj = {};
      if(ele.addDate) {
        obj['DATE']= ele.addDate ? this.customDatepipe.transform(ele.addDate, 'MM-dd-yyyy') : ''
      }
      if(ele.weightKgs) {
        obj['PET WEIGHT (IN KGS)']= ele.weightKgs;
        if(ele.weightKgs == 0) {
          obj['PET WEIGHT (IN KGS)']= '0'
        }
      }
      if(ele.weight) {
        obj['PET WEIGHT (IN LBS)']= ele.weight
        if(ele.weight == 0) {
          obj['PET WEIGHT (IN LBS)']= '0'
        }
      }
      arr.push(obj);
    });

    return arr;
  }

   exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

   saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  
  edit(list) {
    console.log(list);
    this.editWeight = true;
    this.petWeightId = list.petWeightId;
    this.petWeightUnit = list.weightUnit;
    if(list.weight == 0) {
      this.watchHistoryForm.patchValue({
        'dontKnow' : true
      })
    }
    if(this.petWeightUnit == 'lbs') {
      //patchValue
      this.watchHistoryForm.patchValue({
        'weight': list.weight,
        'date': list.addDate ? this.customDatepipe.transform(list.addDate, 'MM-dd-yyyy') : '',
        'weightUnits': list.weightUnit
      })
    }
    else {
        //patchValue
        this.watchHistoryForm.patchValue({
          'weight': list.weightKgs,
          'date': list.addDate ? this.customDatepipe.transform(list.addDate, 'MM-dd-yyyy') : '',
          'weightUnits': list.weightUnit
      })
    }
    console.log(" this.watchHistoryForm", this.watchHistoryForm.value)
    this.openPopup(this.archiveContent, 'xs');
    // this.existingpetInfoForm.patchValue({
    //   pet: { petId: list.petId, petName: list.petName }
    // })
  }

  reset() {
    this.watchHistoryForm.reset();
    this.watchHistoryForm.patchValue({
      weightUnits: 'lbs',
    });
  }

  openWHPopup() {
    if(this.petDeceased == 3) {
      this.toastr.error("Cannot add weight for a deceased pet.")
    }
    else {
    this.editWeight = false;
    this.openPopup(this.archiveContent, 'xs');
    }

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

  addWatchHistory() {
    this.submitted = true;
    let res = Object.assign({});
    //   res.date = this.watchHistoryForm.value.date;
    res.addDate = this.watchHistoryForm.value.date ?
      this.customDatepipe.transform(this.watchHistoryForm.value.date, 'yyyy-MM-dd') : '';
    res.petId = this.petId;
    res.weight = this.watchHistoryForm.value.weight;
    res.weightUnit = this.watchHistoryForm.value.weightUnits;
    res.dontKnow = this.watchHistoryForm.value.dontKnow;
    console.log("res.dontKnow",res.dontKnow);
    //only in edit 
    if(this.editWeight) {
    if(this.watchHistoryForm.value.dontKnow) {
      res.weight = 0;
      this.watchHistoryForm.controls['weight'].setValidators([]);
      this.watchHistoryForm.controls['weight'].updateValueAndValidity();
      // this.watchHistoryForm.markAsPristine();
    }
    else {
      this.watchHistoryForm.controls['weight'].setValidators([Validators.required, ValidationService.decimalValidatorWithValue]);
      this.watchHistoryForm.controls['weight'].updateValueAndValidity();
      // if (!this.watchHistoryForm.valid) {
        this.watchHistoryForm.markAllAsTouched();
        if(this.watchHistoryForm.value.weight == 0) {
          this.toastr.error("Invalid Weight");
          this.submitted = false;
          return false;
        }
        
      // }
    }
  }
    if(this.editWeight) {
      if (!this.watchHistoryForm.valid) {
        this.watchHistoryForm.markAllAsTouched();
        this.submitted = false;
        return false;
      }
      this.submitFlag = true;
      this.petService.updatePetWeight(`/api/pets/updateWeight/${this.petWeightId}/${res.weight}/${res.weightUnit}`, {}).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Weight updated successfully!');
          this.submitted = false;
          //get pet dteils service call
          let evt = document.createEvent("Event");
          evt.initEvent("isAmMedicationClicked", true, true);
          window.dispatchEvent(evt);
  
          this.ngOnInit();
          this.watchHistoryForm.markAsPristine();
          this.modalRef2.close();
          this.watchHistoryForm.reset();
          this.watchHistoryForm.patchValue({
            weightUnits: 'lbs',
          });
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.modalRef2.close();
        }
      }, err => {
        this.modalRef2.close();
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });  
    }
    else {
      if (!this.watchHistoryForm.valid) {
        this.watchHistoryForm.markAllAsTouched();
        this.submitted = false;
        return false;
      }
      this.submitFlag = true;
    this.petService.addPet('/api/pets/addWeight', res).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Weight added successfully!');
        this.submitted = false;
        //get pet dteils service call
        let evt = document.createEvent("Event");
        evt.initEvent("isAmMedicationClicked", true, true);
        window.dispatchEvent(evt);

        this.ngOnInit();
        this.watchHistoryForm.markAsPristine();
        this.modalRef2.close();
        this.watchHistoryForm.reset();
        this.watchHistoryForm.patchValue({
          weightUnits: 'lbs',
        });
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.modalRef2.close();
      }
    }, err => {
      this.modalRef2.close();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });  
  }
  }

  loadOptions() {
    // this.weightDupArr = weightArr;
  
   
  }

  getInitialData(fromDate, toDate) {
    this.spinner.show();
    // this.petService.getPet(`/api/pets/weightHistory/${this.petId}`, '').subscribe
    fromDate = this.customDatePipe.transform(fromDate, 'yyyy-MM-dd');
    toDate = this.customDatePipe.transform(toDate, 'yyyy-MM-dd');
    this.petService.getViewBCScoreHistory(this.petId, fromDate, toDate).subscribe
      (res => {
        if (res.status.success === true) {
          //pet details for dob 
          this.petService.getPet(`/api/pets/getPetDetailsById/${this.petId}`, '').subscribe(res => {
            if (res.status.success === true) {
              this.spinner.hide();
              console.log(res);
              this.petDetails = res.response.petDTO;
              this.petDeceased = res.response.petDTO.petStatusId
             this.petDobDate =  this.petDetails.dateOfBirth ? moment(this.petDetails.dateOfBirth).format('MM-DD-YYYY') : '';
             
            }
            else {
              this.toastr.error(res.errors[0].message);
              this.spinner.hide();
            }
          
          }, err => {
            this.spinner.hide();
            if (err.status == 500) {
              this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
            }
            else {
              this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
            }
          });

          this.petCharts = res.response.weightList;
          let dateArr = [];
          let weightArr = [];
          let weightKgArr = [];
          this.petCharts.forEach(ele => {
            dateArr.push(this.customDatePipe.transform(ele.addDate, 'MM/dd/yyyy'));
            weightArr.push(ele.weight);
            weightKgArr.push(ele.weightKgs);
          });
          console.log("weightArrweightArr",weightArr);
          this.weightDupArr = weightArr;
          this.maxNumber = Math.max(...weightArr);
          console.log("maxNumber",this.maxNumber)
          console.log("weightKgArr",weightKgArr)
          this.barChartLabels = dateArr;
          // this.barChartData['data'] = weightArr;
          this.barChartData = [
            { data: weightArr, label: 'Weight in LBS' , stack: 'a'},
            { data: weightKgArr, label: 'Weight in KGS' , stack: 'b',yAxisID: 'y-axis-1'}
          ];
          console.log("this.barChartData['data']", this.barChartData[0]['data'])


          this.maxNumber = this.weightDupArr.length > 0 ? Math.max(...this.weightDupArr) : 1;
          if(this.maxNumber == 0) {
            this.maxNumber = 1
          }
          console.log("maxNumber",this.maxNumber)
          this.barChartOptions = {
            // responsive: true,
            maintainAspectRatio: false,
            // tooltips: {
            //   mode: 'index',
            //   intersect: true,
            //   // callbacks: {
            //   //   label: (tooltipItem, data) => {
      
            //   //     console.log("tooltipItem", tooltipItem, "data", data, "barChartData", this.barChartData,);
      
            //   //     // return 'Weight :' + ' ' + this.barChartData[0]['data'][tooltipItem.index] + " LBS";
            //   //   }
            //   // }
            // },
            plugins: {
              datalabels: {
                display: false,
                formatter: (value, ctx) => {
                  const label = ctx.chart.data.labels[ctx.dataIndex];
                  console.log("label",label)
                  console.log("ctx.chart.data",ctx.chart.data)
                  console.log("ctx.chart.data.labels",ctx.chart.data.labels)
                  console.log("ctx.chart.data.labels[ctx.dataIndex]",ctx.chart.data.labels[ctx.dataIndex])
                  return label;
               }
              }
            },
            scales: {
              yAxes: [
                {
                position: "left",
                "id": "y-axis-0",
                
                ticks: { min: 0 , max:Math.ceil(this.maxNumber * 1.05)},
                scaleLabel: {
                  display: true,
                  labelString: 'Weight in LBS'
                }
              },
              {
                position: "right",
                "id": "y-axis-1",
                ticks: { min: 0,
                  max:Math.ceil(this.maxNumber * 1.05)
                },
                gridLines: {
                  display:false
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Weight in KGS'
                }
              },
            ],
              
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Recorded Date'
                }
              }],
            }
          };
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
        // this.spinner.hide();
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

