import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetsService } from '../assets.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LookupService } from 'src/app/services/util/lookup.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { NgbCarouselConfig, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { SupportService } from 'src/app/support/support.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { start } from '@popperjs/core';
import { forkJoin } from 'rxjs';
import 'chartjs-plugin-doughnutlabel';
import 'chartjs-plugin-datalabels';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-assets-dashboard',
  templateUrl: './assets-dashboard.component.html',
  styleUrls: ['./assets-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbCarouselConfig]
})
export class AssetsDashboardComponent implements OnInit {
  devicesBystudy: any = [];
  devicesBystudyDefault: any = [];
  public customerFilter: FormGroup;
  public customerFilter1: FormGroup;
  public customerFilter2: FormGroup;
  public customerFilter4: FormGroup;
  public customerFilter5: FormGroup;
  public maxXaxes: any;
  @ViewChild('popOver4') popOver4: NgbPopover;
  @ViewChild('popOver1') popOver1: NgbPopover;
  @ViewChild('popOver2') popOver2: NgbPopover;
  @ViewChild('popOver3') popOver3: NgbPopover;
  @ViewChild('popOver5') popOver5: NgbPopover;
  public options: ChartOptions = {
    responsive: true,
    tooltips: {
      backgroundColor: '#3aceba'
    },
    legend: {
      align: start,
      position: 'right',
      labels: {
        fontSize: 12,
        usePointStyle: true
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    cutoutPercentage: 60
  }
  // device chart
  // public deviceChartLabels: Label[] = [];

  // public deviceChartData: ChartDataSets[] = [];
  // [350, 450, 100, 200, 140, 80, 60, 90,100,190],

  public pieChartColors: Array<any> = [{
    backgroundColor: ['#FDA7A7', '#FDCAB2', '#FEC6E2', '#AED2FC', '#B3BFDD', '#6DD1CC', '#FDCAB6', '#EAC4A7', '#FDA7A8', '#FDCAB7']
  }];

  public deviceChartType: ChartType = 'horizontalBar';


  //issues chart
  public issuesChartLabels: Label[] = [];
  public issuesChartData: MultiDataSet = [
    [350, 450, 100, 200, 140, 80, 60, 90],
  ];
  public issuesChartPercent: any = [];
  public issuesChartType: ChartType = 'doughnut';
  deviceModelArr: any = [];
  deviceModelArr2: any = [];
  deviceTypeArr: any = [];
  studyList: any;
  issueList: any;
  deviceStatuses: any;
  agentName: any;
  deviceChartDataText: any = 'Assets';

  //new data 1 for Assets by Study 
  public barChartOptionss: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value) => this.formatter(value),
        align: 'center',
        anchor: 'center',
      }
    },
    maintainAspectRatio: false,
    scales: {
      // yAxes: [{ ticks: { min: 0 } }],
      yAxes: [{
        // distribution: "linear",
        scaleLabel: {
          display: false
        },
        ticks: {
          // minRotation: 360,
          // labelOffset: 2,
          autoSkip: false,
          callback: function (label: any, index, labels) {
            if (/\s/.test(label)) {
              return label.split(" ");
            } else {
              return label;
            }
          }
        },
        gridLines: {
          display: false
        }
      }],
      xAxes: [{
        ticks: {
          callback: (value, index, values) => {
            this.maxXaxes = values[values.length - 1];
            this.changeDetectorRef.detectChanges();
            return value;
          }
        }
      }]
    },
    tooltips: {
      backgroundColor: '#3aceba'
    },
    legend: {
      align: start,
      // position: 'right',
      labels: {
        fontSize: 12,
        usePointStyle: true
      }
    }
  };
  public barChartTypee: ChartType = 'horizontalBar';
  public barChartLegendd = true;

  public barChartDataa: ChartDataSets[] = [
    // { data: [1, 2, 3], label: 'Approved', stack: 'a' },
    // { data: [4, 5, 6], label: 'Accepted', stack: 'a' },
    // { data: [7], label: 'Open', stack: 'a' },
    // { data: [1, 2], label: 'In Progress', stack: 'a' },
  ];
  public barChartLabelss: string[] = [];
  //new data 1 ends here

  //new data 4 starts here
  public barChartOptions4: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value) => this.formatter(value),
        align: 'center',
        anchor: 'center',
        font: {
          size: 10,
          weight: 'bold'
        }
      }
    },
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: '#3aceba'
    },
    scales: {
      yAxes: [{ ticks: { min: 0 } }],
      xAxes: [{
        distribution: "linear",
        scaleLabel: {
          display: false
        },
        ticks: {
          // minRotation: 360,
          // labelOffset: 2,
          // suggestedMax:10,
          autoSkip: false,
          callback: function (label: any, index, labels) {
            if (/\s/.test(label)) {
              return label.split(" ");
            } else {
              return label;
            }
          }
        },
        gridLines: {
          display: false
        }
      }],
    },
    legend: {
      align: start,
      position: 'top',
      labels: {
        fontSize: 12,
        usePointStyle: true
      }
    }
  };
  public barChartLabels4: Label[] = [];
  public barChartType4: ChartType = 'bar';
  public barChartLegend4 = true;
  public barChartPlugins4 = [
    {
      beforeInit: function (chart, options) {
        chart.legend.afterFit = function () {
          this.height += 15; // must use `function` and not => because of `this`
        };
      }
    }
  ];

  public barChartData4: ChartDataSets[] = [

  ];
  sensorLocationsArr: any;
  modelArr: any;
  modelUpArr: any = [];
  totalCount: any = 0;
  dataArchive: any[] = [];
  dataModel: any[] = [];
  canvasDis: boolean = false;
  canvasDis3: boolean = false;
  canvasDis4: boolean = false;
  selectedRecord: any;
  showNavigationArrows: boolean = false;
  showNavigationArrowsM: boolean = false;
  asetIsues: any;
  assignedToList: any;
  RWFlag: boolean = false;
  deviceModelArr3: any[];

  endDate: any;
  startDate: any;

  public Issueoptions: any = {
    tooltips: {
      backgroundColor: '#3aceba',
      mode: 'index',
      intersect: true,
      callbacks: {
        label: (tooltipItem, data) => {
          return this.issuesChartLabels[tooltipItem.index] + ': ' + this.issuesChartData[tooltipItem.index] + " (" + this.issuesChartPercent[tooltipItem.index] + "%)";
        }
      }
    },
    legend: {
      position: 'right',
      align: start,
      labels: {
        fontSize: 12,
        usePointStyle: true
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    cutoutPercentage: 60,
    plugins: {
      datalabels: {
        formatter: (value) => this.formatter(value)
      },
      doughnutlabel: {
        labels: [
          {
            text: '',
            font: {
              size: '30',
              units: 'em',
              family: '"Titillium Web", sans-serif',
              weight: 'bold'
            },
            color: '#37b57c'
          },
          {
            text: 'Total Issues'
          }
        ]
      }
    }
  }

  formatter(value) {
    if (value > 0) {
      value = value.toString();
      value = value.split(/(?=(?:...)*$)/);
      value = value.join(',');
      return value;
    } else {
      value = "";
      return value;
    }
  }

  // data 4 ends here

  private filterForm(): void {
    this.customerFilter = this.fb.group({
      assetType: [''],
      model2: [''],
      study: [''],
      startDate: '',
      endDate: ''
    });
    let endDate = moment().format("MM-DD-YYYY");
    let startDate = moment(endDate).subtract(3, 'months').format('MM-DD-YYYY');

    this.customerFilter.patchValue({
      startDate: startDate,
      endDate: endDate
    });
  }

  private filterForm1(): void {
    this.customerFilter1 = this.fb.group({
      assetType: [''],
      model: [''],
      study: ['']
    });
  }

  private filterForm5(): void {
    this.customerFilter5 = this.fb.group({
      location: [''],
      assetType: [''],
      model: ['']
    });
  }

  private filterForm2(): void {
    this.customerFilter2 = this.fb.group({
      startDate: '',
      endDate: '',
      agent: ''
    });
    let endDate = moment().format("MM-DD-YYYY");
    let startDate = moment(endDate).subtract(3, 'months').format('MM-DD-YYYY');

    this.customerFilter2.patchValue({
      startDate: startDate,
      endDate: endDate
    });
  }

  private filterForm4(): void {
    this.customerFilter4 = this.fb.group({
      assetType: [''],
      assetTypeMain:[''],
      model2: [''],
      study: [''],
      startDate: '',
      endDate: ''
    });
    let endDate = moment().format("MM-DD-YYYY");
    let startDate = moment(endDate).subtract(3, 'months').format('MM-DD-YYYY');

    this.customerFilter4.patchValue({
      startDate: startDate,
      endDate: endDate
    });
  }



  //bar chart

  public barChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: '# of Asset Issues'
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          userCallback: function (label, index, labels) {
            // when the floored value is the same as the value we have a whole number
            if (Math.floor(label) === label) {
              return label;
            }

          },

        }
      }]
    }
  };
  public barChartLabels: Label[] = ['Aging', 'Case', 'AGL3 - Field Test employ..', 'WEDs', 'AFTr UK', 'AFTr US - Study B', 'WAM -Study E', 'Wearables Sensor'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
  ];
  csStudy: any = [];
  csStudyDefault: any = [];
  devicesMalfunc: any;
  devicesMalfuncDefault: any;
  csWidget: any;
  csWidgetDefault: any;
  Asset2: any = [];
  Asset2Default: any = [];
  Asset1: any;
  totalAssets: any;
  totalAssetsByStatus: number;

  exportDataExcel: any;

  constructor(
    private spinner: NgxSpinnerService,
    private assetsService: AssetsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private lookupService: LookupService,
    private customDatePipe: CustomDateFormatPipe,
    private supportservice: SupportService,
    private userService: UserDataService,
    private changeDetectorRef: ChangeDetectorRef,
    config: NgbCarouselConfig
  ) {
    config.interval = 0;
    config.wrap = false;
    config.showNavigationArrows = true;

    this.spinner.show();
    this.endDate = moment().format("YYYY-MM-DD");
    this.startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');
    forkJoin(
      this.assetsService.getAssetsService(`/api/reports/getTotalAssets`),
      this.assetsService.getAssetsService(`/api/reports/getTotalAssetsByStatus`),
      this.assetsService.getAssetsService(`/api/reports/getAssetsDevicesByStudyReport?modelType=&assetModel=&study=`),
      this.assetsService.getAssetsService(`/api/reports/getAssetsDevicesMalfunctions?filterType=datetype&startDate=${this.startDate}&endDate=${this.endDate}`),
      this.assetsService.getAssetsService(`/api/reports/getCustomerSupportIssueByStudyWidget?startDate=${this.startDate}&endDate=${this.endDate}&agent=0`),
      this.assetsService.getAssetsService(`/api/reports/getCustomerSupportIssueWidget?startDate=${this.startDate}&endDate=${this.endDate}&studyId=0`)
    ).subscribe(res => {
      let res1 = res[0];
      let res2 = res[1];
      let res3 = res[2];
      let res4 = res[3];
      let res5 = res[4];
      let res6 = res[5];
      // --res1 -getTotalAssets -----------------------------
      this.Asset1 = JSON.parse(JSON.stringify(res1.response.rows));
      let modelAsset = JSON.parse(JSON.stringify(res1.response.rows));
      //remove last row
      this.Asset1.splice(-1, 1);
      this.archiveArray(3, this.Asset1);
      this.totalAssets = res1.response.totalElements;
      //last element 
      let len = modelAsset.length;
      this.modelArr = modelAsset[len - 1].modelAssociatedObject;

      //-- res2  getTotalAssetsByStatus ----------------------------
      this.Asset2 = res2.response.rows;
      this.Asset2Default = res2.response.rows;
      this.totalAssetsByStatus = res2.response.totalElements;

      //-- res3 getAssetsDevicesByStudyReport --------------------------
      let dateArr = [];
      let weightArr = [];
      let allocArr = [];
      let discArr = [];
      let deacArr = [];
      let inStudyArr = [];
      let avaiArr = [];
      let unAssArr = [];
      let inTestArr = [];
      this.devicesBystudyDefault = res3.response.rows;
      this.devicesBystudy = res3.response.rows;
      this.devicesBystudy.forEach((ele, i) => {
        // if(i < 8) {
        dateArr.push(ele.studyName);
        weightArr.push(ele.devicesbyStudy);

        let statusNameCount = ele.statusNameCount;
        statusNameCount && statusNameCount.forEach(pro => {
          if (pro.statusName == 'Allocated') {
            allocArr.push(pro.statusCount);
          }
          if (pro.statusName == 'Available') {
            avaiArr.push(pro.statusCount);
          }
          if (pro.statusName == 'Unassigned') {
            unAssArr.push(pro.statusCount);
          }
          if (pro.statusName == 'Discarded') {
            discArr.push(pro.statusCount);
          }
          if (pro.statusName == 'Deactivated') {
            deacArr.push(pro.statusCount);
          }
          if (pro.statusName == 'In-Study') {
            inStudyArr.push(pro.statusCount);
          }
          if (pro.statusName == 'In Testing') {
            inTestArr.push(pro.statusCount);
          }
        })
        // }
      });
      // this.deviceChartLabels = dateArr;
      this.barChartLabelss = dateArr;

      this.barChartDataa = [
        { data: avaiArr, label: 'Available', stack: 'a' },
        { data: allocArr, label: 'Allocated', stack: 'a' },
        { data: unAssArr, label: 'Unassigned', stack: 'a' },
        { data: discArr, label: 'Discarded', stack: 'a' },
        // { data: deacArr, label: 'Deactivated', stack: 'a' },
        { data: inStudyArr, label: 'In-Study', stack: 'a' },
        { data: inTestArr, label: 'In Testing', stack: 'a' },
      ];

      // this.spinner.show();
      setTimeout(() => {
        // tslint:disable-next-line: no-unused-expression
        this.canvasDis = true;
        // this.spinner.hide();
      }, 2000);

      //-- res4 getAssetsDevicesMalfunctions ----------------------------
      let dateArr1 = [];
      let weightArr1 = [];

      // let dataArr = [];
      // let gapArr = [];
      // let stuckArr = [];
      // let wifiArr = [];
      this.devicesMalfuncDefault = res4.response.rows;
      this.devicesMalfunc = res4.response.rows;
      this.devicesMalfunc && this.devicesMalfunc.forEach((ele, i) => {
        dateArr1.push(ele.studyName);
        weightArr1.push(ele.ticketsCount);
        let issueNameCount = ele.issueNameCount;
        issueNameCount && issueNameCount.forEach((pro, i) => {
          let batArr = [];
          let duplicateRecord = false;



          this.barChartData4.forEach((bar, k) => {
            if (bar.label == pro.issueName) {
              duplicateRecord = true;
            }
          })

          if (pro.issueName && !duplicateRecord) {
            batArr.push(pro.issueCount);
            this.barChartData4.push(
              { data: batArr, label: pro.issueName, stack: 'a', maxBarThickness: 40 })
          }


          if (pro.issueName && duplicateRecord) {
            this.barChartData4.forEach((ele, i) => {
              if (ele.label == pro.issueName) {
                this.barChartData4[i].data.push(pro.issueCount)
              }
            })
            // batArr.push(pro.issueCount);
            // bar.data = 
          }


          // if(pro.issueName == 'Data Not Uploading') {
          //   dataArr.push(pro.issueCount);
          // }
          // if(pro.issueName == 'Gaps in Data') {
          //   gapArr.push(pro.issueCount);
          // }
          // if(pro.issueName == 'Stuck Accelerometer') {
          //   stuckArr.push(pro.issueCount);
          // }
          // if(pro.issueName == 'Wifi Connection Issues') {
          //   wifiArr.push(pro.issueCount);
          // }

        })
      });
      console.log('dateArr1',dateArr1);
      dateArr1.forEach((element,index) => {
        dateArr1[index] = (element.replace(/_/g, ' '));
      });
      console.log('dateArr1',dateArr1);
      this.barChartLabels4 = dateArr1;
      //commented
      // this.barChartData4 = [{data: weightArr1, label: '# of Asset Issues'}];
      //comment ends

      // this.barChartData4 = [
      //   { data: batArr, label: 'Battery Issues', stack: 'a' },
      // { data: dataArr, label: 'Data Not Uploading', stack: 'a' },
      // { data: gapArr, label: 'Gaps in Data', stack: 'a' },
      // { data: stuckArr, label: 'Stuck Accelerometer', stack: 'a' },
      // { data: wifiArr, label: 'Wifi Connection Issues', stack: 'a' },
      // ];
      this.canvasDis4 = false;
      setTimeout(() => {
        // tslint:disable-next-line: no-unused-expression;
        this.canvasDis4 = true;
        //  this.spinner.hide();
      }, 2000);

      //-- res5  getCustomerSupportIssueByStudyWidget ----------------------------
      this.csStudyDefault = res5.response.customerSupportIssuesByStudy;
      this.csStudy = res5.response.customerSupportIssuesByStudy;

      //-- res6  getCustomerSupportIssueWidget ------------------------------
      this.csWidgetDefault = res6.response.customerSupportByCategories;
      this.csWidget = res6.response.customerSupportByCategories;
      //new code
      if (res6.response.customerSupportByCategories.length > 0) {
        this.totalCount = res6.response.customerSupportByCategories[0].totalCount;
        this.Issueoptions.plugins.doughnutlabel.labels[0].text = this.totalCount;
      }
      let dateArr2 = [];
      let weightArr2 = [];
      let issuesCount = [];
      let csMalfunc = res6.response.customerSupportByCategories;
      this.asetIsues = res6.response.customerSupportByCategories;
      csMalfunc && csMalfunc.forEach((ele, i) => {
        dateArr2.push(ele.issueName);
        weightArr2.push(ele.issuePercent);
        issuesCount.push(ele.issueCount);
      });
      this.issuesChartLabels = dateArr2;
      this.issuesChartData = issuesCount;
      this.issuesChartPercent = weightArr2;
      this.canvasDis3 = false;
      setTimeout(() => {
        // tslint:disable-next-line: no-unused-expression
        this.canvasDis3 = true;
        this.spinner.hide();
      }, 2000);
    })
  }


  archiveArray(numberOfChunks, inputList) {
    this.dataArchive = [];
    var result = inputList.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / numberOfChunks)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      // resultArray.forEach(ele => {
      //   ele.forEach(res => {
      //     res.startDate = res.startDate ? this.customDatePipe.transform(res.startDate, 'MM-dd-yyyy') : '';
      //     res.endDate = res.endDate ? this.customDatePipe.transform(res.endDate, 'MM-dd-yyyy') : '';
      //   })
      // })
      this.dataArchive = resultArray;
      if (this.dataArchive.length > 1) {
        this.showNavigationArrows = true;
      } else {
        this.showNavigationArrows = false;
      }
      return resultArray
    }, [])

  }
  modelArray(numberOfChunks, inputList) {
    this.dataModel = [];
    var result = inputList.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / numberOfChunks)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      // resultArray.forEach(ele => {
      //   ele.forEach(res => {
      //     res.startDate = res.startDate ? this.customDatePipe.transform(res.startDate, 'MM-dd-yyyy') : '';
      //     res.endDate = res.endDate ? this.customDatePipe.transform(res.endDate, 'MM-dd-yyyy') : '';
      //   })
      // })
      this.dataModel = resultArray;
      if (this.dataModel.length > 1) {
        this.showNavigationArrowsM = true;
      } else {
        this.showNavigationArrowsM = false;
      }
      return resultArray
    }, [])

  }


  //on clicking asettype models filter

  assetClick(deviceType, id) {
    this.selectedRecord = deviceType;
    // this.modelArr.filter
    const filterTasks = (taskArray, obj) => taskArray.filter(task => Object.keys(task).some(key => obj[key] && obj[key] == task[key]));

    this.modelUpArr = filterTasks(this.modelArr, { deviceType: deviceType });
    this.modelUpArr && this.modelUpArr.length == 0 && this.modelUpArr.forEach(ele => {
      if (ele.modelCount == null) {
        this.modelUpArr = [];
      }
    });
    this.modelArray(3, this.modelUpArr);
  }

  //reseting assets
  resetAsset() {
    this.modelUpArr = [];
    this.modelArray(3, this.modelUpArr);
    this.selectedRecord = '';
  }

  changeDeviceType($event) {
    this.spinner.show();
    this.deviceModelArr = [];
    let asset = $event.name;
    //  this.firmForm.controls['assetModel'].enable();
    this.assetsService.getAssetsService(`/api/assets/getDeviceModelById/${asset}`).subscribe(res => {
      if (res.status.success === true) {
        let modelList = res.response.rows;
        modelList && modelList.forEach(ele => {
          if (ele.deviceModel == "Other") {
            let index = modelList.indexOf(ele);
            modelList.splice(index, 1);
          }
        });
        modelList.forEach(element => {
          this.deviceModelArr.push({ 'name': element.deviceModel });
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
  }

  changeDeviceType2($event) {
    this.spinner.show();
    this.deviceModelArr2 = [];
    let asset = $event.name;
    //  this.firmForm.controls['assetModel'].enable();
    this.assetsService.getAssetsService(`/api/assets/getDeviceModelById/${asset}`).subscribe(res => {
      if (res.status.success === true) {
        let modelList = res.response.rows;
        modelList && modelList.forEach(ele => {
          if (ele.deviceModel == "Other") {
            let index = modelList.indexOf(ele);
            modelList.splice(index, 1);
          }
        });

        modelList.forEach(element => {
          this.deviceModelArr2.push({ 'name': element.deviceModel });
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
  }

  changeDeviceType3($event) {
    this.spinner.show();
    this.deviceModelArr3 = [];
    let asset = $event.name;
    //  this.firmForm.controls['assetModel'].enable();
    this.assetsService.getAssetsService(`/api/assets/getDeviceModelById/${asset}`).subscribe(res => {
      if (res.status.success === true) {
        let modelList = res.response.rows;
        modelList && modelList.forEach(ele => {
          if (ele.deviceModel == "Other") {
            let index = modelList.indexOf(ele);
            modelList.splice(index, 1);
          }
        });

        modelList.forEach(element => {
          this.deviceModelArr3.push({ 'name': element.deviceModel });
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
  }

  clearModel2() {
    this.customerFilter.value.model2 = '';
  }
  clearModel3() {
    this.customerFilter5.value.model = '';
  }
  clearModel() {
    this.customerFilter1.value.model = '';
  }

  ngOnInit(): void {
    //permission for the module
    let userProfileData = this.userService.getRoleDetails();
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "37") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "4") {
      this.RWFlag = true;
    }

    this.filterForm();
    this.filterForm1();
    this.filterForm2();
    this.filterForm4();
    this.filterForm5();
    if (this.modelUpArr.length > 0) {
      //    this.assetClick()
    }


    this.lookupService.getDeviceModel('/api/assets/getDeviceTypesAndModels').subscribe(res => {
      res.response.deviceTypes.forEach(element => {
        this.deviceTypeArr.push({ 'name': element });
      });
      // res.response.deviceModels.forEach(element => {
      //   this.deviceModelArr.push({ 'name' : element});
      // });

    },
      err => {
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );

    //for location
    this.lookupService.getCommon(`/api/lookup/getSensorLocation`).subscribe(res => {
      if (res.status.success === true) {
        this.sensorLocationsArr = res.response.sensorLocationList;
        this.sensorLocationsArr && this.sensorLocationsArr.forEach(ele => {
          if (ele.storageLocationName == "Other Storage Location") {
            let index = this.sensorLocationsArr.indexOf(ele);
            this.sensorLocationsArr.splice(index, 1);
          }
        })
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

    //assignedto
    this.supportservice.getSupportService('/api/lookup/getAssignedToUsers').subscribe(res => {
      if (res.status.success === true) {
        let userId = this.userService.getUserId();
        // if (!this.RWFlag) {
        //   this.assignedToList = res.response.ticketAssignedUserList && res.response.ticketAssignedUserList.filter(item => item.userId == userId);
        // }
        // else {
        this.assignedToList = res.response.ticketAssignedUserList;
        // }

      } else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

    // getAllStudyList
    this.lookupService.getCommon('/api/study/getStudyList').subscribe(res => {
      if (res.status.success === true) {
        this.studyList = res.response.studyList;
      } else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

    //Issue
    this.lookupService.getCommon(`/api/lookup/getIssue`).subscribe(res => {
      if (res.status.success === true) {
        this.issueList = res.response.issueList;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

    //Device Statuses
    this.lookupService.getCommon(`/api/lookup/getDeviceStatuses`).subscribe(res => {
      if (res.status.success === true) {
        this.deviceStatuses = res.response.deviceStatuses;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });

  }


  public clearAllFilters() {
    this.filterForm();
    this.applyFilters();
  }
  public clearAllFilters1() {
    this.filterForm1();
    this.applyFilters1();

  }
  public clearAllFilters2() {
    this.filterForm2();
    this.applyFilters2();
    this.agentName = '';
  }
  public clearAllFilters4() {
    this.filterForm4();
    this.applyFilters4();
  }
  public clearAllFilters5() {
    this.filterForm5();
    this.applyFilters5();
  }


  applyFilters5() {
    let filter = JSON.parse(JSON.stringify(this.customerFilter5.value));
    this.spinner.show();
    let location = filter.location == '' ? 0 : filter.location;
    let model = filter.model == '' ? '' : filter.model.name;
    let assetType = filter.assetType == '' ? '' : filter.assetType.name;

    // getTotalAssetsByStatus
    this.assetsService.getAssetsService(`/api/reports/getTotalAssetsByStatus?locationId=${location}&modelType=${model}&assertModel=${assetType}`).subscribe(res => {
      if (res.status.success === true) {
        this.Asset2 = res.response.rows;
        this.totalAssetsByStatus = res.response.totalElements;

        // res.response && res.response.forEach(ele =>

        //   {
        //     if(ele.studyName != null) {
        //       this.csStudy.push(ele);
        //     }
        //   })
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
      this.popOver5.close();
    }, err => {
      this.popOver5.close();
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    );
  }

  applyFilters2() {
    let filter = JSON.parse(JSON.stringify(this.customerFilter2.value));
    this.spinner.show();
    this.agentName = filter.agent ? filter.agent.userName : '';
    //   let endDate = moment(filter.endDate).format("YYYY-MM-DD");;
    // let startDate = moment(filter.startDate).format('YYYY-MM-DD');
    let endDate = filter.endDate ? this.customDatePipe.transform(filter.endDate, 'yyyy-MM-dd') : '';
    let startDate = filter.startDate ? this.customDatePipe.transform(filter.startDate, 'yyyy-MM-dd') : '';
    let agent = filter.agent ? filter.agent.userId : 0;
    // getCustomerSupportIssueByStudyWidget
    this.assetsService.getAssetsService(`/api/reports/getCustomerSupportIssueByStudyWidget?startDate=${startDate}&endDate=${endDate}&agent=${agent}`).subscribe(res => {
      if (res.status.success === true) {
        this.csStudy = res.response.customerSupportIssuesByStudy;

        // res.response && res.response.forEach(ele =>

        //   {
        //     if(ele.studyName != null) {
        //       this.csStudy.push(ele);
        //     }
        //   })
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
      this.popOver2.close();
    }, err => {
      this.popOver2.close();
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    );
  }

  applyFilters4() {
    this.barChartData4 = [];
    let filter = JSON.parse(JSON.stringify(this.customerFilter4.value));
    // if (this.customerFilter4.dirty) {
    this.spinner.show();
    let assetIssue = filter.assetType ? filter.assetType.issueId : 0;
    let studyId = filter.study ? filter.study.studyId : '';
    let model = filter.model2 == '' ? '' : filter.model2.name;
    let assetType = filter.assetTypeMain == '' ? '' : filter.assetTypeMain.name;
    let endDate = filter.endDate ? this.customDatePipe.transform(filter.endDate, 'yyyy-MM-dd') : '';
    let startDate = filter.startDate ? this.customDatePipe.transform(filter.startDate, 'yyyy-MM-dd') : '';
 
    this.assetsService.getAssetsService(`/api/reports/getAssetsDevicesMalfunctions?filterType=datetype&startDate=${startDate}&endDate=${endDate}&filterValue=${assetIssue}&studyId=${studyId}&assetType=${assetType}&modelType=${model}`).subscribe(res => {
      if (res.status.success === true) {
        let dateArr = [];
        let weightArr = [];

        // let dataArr = [];
        // let gapArr = [];
        // let stuckArr = [];
        // let wifiArr = [];
        this.devicesMalfunc = res.response.rows;
        this.devicesMalfunc && this.devicesMalfunc.forEach((ele, i) => {
          dateArr.push(ele.studyName);
          weightArr.push(ele.ticketsCount);
          let issueNameCount = ele.issueNameCount;
          issueNameCount && issueNameCount.forEach((pro, i) => {
            let batArr = [];
            let duplicateRecord = false;



            this.barChartData4.forEach((bar, k) => {
              if (bar.label == pro.issueName) {
                duplicateRecord = true;
              }
            })

            if (pro.issueName && !duplicateRecord) {
              batArr.push(pro.issueCount);
              this.barChartData4.push(
                { data: batArr, label: pro.issueName, stack: 'a', maxBarThickness: 40 })
            }

            if (pro.issueName && duplicateRecord) {
              this.barChartData4.forEach((ele, i) => {
                if (ele.label == pro.issueName) {
                  this.barChartData4[i].data.push(pro.issueCount)
                }
              })
              // batArr.push(pro.issueCount);
              // bar.data = 
            }

            // if(pro.issueName == 'Data Not Uploading') {
            //   dataArr.push(pro.issueCount);
            // }
            // if(pro.issueName == 'Gaps in Data') {
            //   gapArr.push(pro.issueCount);
            // }
            // if(pro.issueName == 'Stuck Accelerometer') {
            //   stuckArr.push(pro.issueCount);
            // }
            // if(pro.issueName == 'Wifi Connection Issues') {
            //   wifiArr.push(pro.issueCount);
            // }

          })
        });
        console.log('dateArr1',dateArr);
        dateArr.forEach((element,index) => {
          dateArr[index] = (element.replace(/_/g, ' '));
        });
        console.log('dateArr1',dateArr);
        this.barChartLabels4 = dateArr;
        //commented
        // this.barChartData4 = [{data: weightArr, label: '# of Asset Issues'}];
        //comment ends

        // this.barChartData4 = [
        //   { data: batArr, label: 'Battery Issues', stack: 'a' },
        // { data: dataArr, label: 'Data Not Uploading', stack: 'a' },
        // { data: gapArr, label: 'Gaps in Data', stack: 'a' },
        // { data: stuckArr, label: 'Stuck Accelerometer', stack: 'a' },
        // { data: wifiArr, label: 'Wifi Connection Issues', stack: 'a' },
        // ];
        this.canvasDis4 = false;
        setTimeout(() => {
          // tslint:disable-next-line: no-unused-expression
          this.canvasDis4 = true;
          this.spinner.hide();
        }, 2000);

      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
      this.popOver4.close();

    }, err => {
      this.popOver4.close();
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    );
    // }
    // else {
    //   this.toastr.error('Please enter at least one field to apply!');
    // }
  }

  applyFilters1() {
    this.barChartLabelss = [];
    this.barChartDataa = [];
    let filter = JSON.parse(JSON.stringify(this.customerFilter1.value));
    // if (this.customerFilter1.dirty) {
    this.spinner.show();
    let assetType = filter.assetType ? filter.assetType.name : '';
    let assetModel = filter.model ? filter.model.name : '';
    let study = filter.study ? filter.study.studyId : '';
    this.assetsService.getAssetsService(`/api/reports/getAssetsDevicesByStudyReport?assetType=${assetType}&modelType=${assetModel}&study=${study}`).subscribe(res => {
      if (res.status.success === true) {
        let dateArr = [];
        let weightArr = [];
        let allocArr = [];
        let discArr = [];
        let deacArr = [];
        let inStudyArr = [];
        let avaiArr = [];
        let unAssArr = [];
        let inTestArr = [];
        this.devicesBystudy = res.response.rows;
        this.devicesBystudy.forEach((ele, i) => {
          // if(i < 8) {
          dateArr.push(ele.studyName);
          weightArr.push(ele.devicesbyStudy);

          let statusNameCount = ele.statusNameCount;
          statusNameCount && statusNameCount.forEach(pro => {
            if (pro.statusName == 'Allocated') {
              allocArr.push(pro.statusCount);
            }
            if (pro.statusName == 'Available') {
              avaiArr.push(pro.statusCount);
            }
            if (pro.statusName == 'Unassigned') {
              unAssArr.push(pro.statusCount);
            }
            if (pro.statusName == 'Discarded') {
              discArr.push(pro.statusCount);
            }
            if (pro.statusName == 'Deactivated') {
              deacArr.push(pro.statusCount);
            }
            if (pro.statusName == 'In-Study') {
              inStudyArr.push(pro.statusCount);
            }
            if (pro.statusName == 'In Testing') {
              inTestArr.push(pro.statusCount);
            }
          })
          // }
        });
        this.barChartLabelss = dateArr;

        this.barChartDataa = [
          { data: avaiArr, label: 'Available', stack: 'a' },
          { data: allocArr, label: 'Allocated', stack: 'a' },
          { data: unAssArr, label: 'Unassigned', stack: 'a' },
          { data: discArr, label: 'Discarded', stack: 'a' },
          // { data: deacArr, label: 'Deactivated', stack: 'a' },
          { data: inStudyArr, label: 'In-Study', stack: 'a' },
          { data: inTestArr, label: 'In Testing', stack: 'a' },
        ];

        this.canvasDis = false;
        setTimeout(() => {
          // tslint:disable-next-line: no-unused-expression
          this.canvasDis = true;
          this.spinner.hide();
        }, 2000);

        // { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', stack: 'a' },
        // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B', stack: 'a' }
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
      this.popOver1.close();

    }, err => {
      this.popOver1.close();
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    );
    // }
  }

  applyFilters() {
    let filter = JSON.parse(JSON.stringify(this.customerFilter.value));
    // if (this.customerFilter.dirty) {
    let model = filter.model ? filter.model.name : null;
    let assetType = filter.assetType ? filter.assetType.name : null;
    let studyId = filter.study ? filter.study.studyId : 0;
    let endDate = filter.endDate ? this.customDatePipe.transform(filter.endDate, 'yyyy-MM-dd') : '';
    let startDate = filter.startDate ? this.customDatePipe.transform(filter.startDate, 'yyyy-MM-dd') : '';
    this.spinner.show();

    let url = `/api/reports/getCustomerSupportIssueWidget?startDate=${startDate}&endDate=${endDate}&studyId=${studyId}`;

    if (assetType != null) {
      url += `&modelType=${assetType}`;
    }
    if (model != null) {
      url += `&assertModel=${model}`;
    }

    this.assetsService.getAssetsService(url).subscribe(res => {
      if (res.status.success === true) {
        //new code
        let resp = res.response.customerSupportByCategories;
        if (resp && resp.length > 0) {
          this.totalCount = resp[0].totalCount;
          this.Issueoptions.plugins.doughnutlabel.labels[0].text = this.totalCount;
        }
        let dateArr = [];
        let weightArr = [];
        let issuesCount = [];
        let csMalfunc = resp;
        this.asetIsues = resp;
        csMalfunc && csMalfunc.forEach((ele, i) => {
          dateArr.push(ele.issueName);
          weightArr.push(ele.issuePercent);
          issuesCount.push(ele.issueCount);
        });
        this.issuesChartLabels = dateArr;
        this.issuesChartData = issuesCount;
        this.issuesChartPercent = weightArr;

        this.canvasDis3 = false;
        setTimeout(() => {
          // tslint:disable-next-line: no-unused-expression
          this.canvasDis3 = true;
          this.spinner.hide();
        }, 2000);


      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
      this.popOver3.close();
    }, err => {
      this.popOver3.close();
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    }
    );
    // }
    // else {
    //   this.toastr.error('Please enter at least one field to apply!');
    // }
  }


  /*Export to Excel*/
  getColumns(val) {
    let headers;
    if (val == 1) {
      let statuses = [];
      this.deviceStatuses.forEach((status: any) => {
        statuses.push({
          dataKey: status.statusName, header: status.statusName
        })
      });
      headers = [
        { dataKey: "study", header: "Study" },
        ...statuses,
        { dataKey: "totalCount", header: "Total Count" }
      ];
    }
    else if (val == 2) {
      headers = [
        { dataKey: "studyName", header: "Study" },
        { dataKey: "studyCount", header: "# Of Tickets" },
        { dataKey: "studyPercentage", header: "%  of Tickets" },
        { dataKey: "openCount", header: "Open" },
        { dataKey: "inProgressCount", header: "In Progress" },
        { dataKey: "closedCount", header: "Closed" }
      ];
    }
    else if (val == 3) {
      headers = [
        { dataKey: "issueName", header: "Issue Type" },
        { dataKey: "issueCount", header: "Count" }
      ];
    }
    else if (val == 4) {
      let issues = [];
      this.issueList.forEach((issue: any) => {
        issues.push({
          dataKey: issue.issueName, header: issue.issueName
        })
      });
      headers = [
        { dataKey: "study", header: "Study" },
        ...issues,
        { dataKey: "ticketsCount", header: "Total Count" }
      ];
    }
    else if (val == 5) {
      let models = [];
      this.modelArr.forEach((model: any) => {
        models.push({
          dataKey: model.modelName, header: model.modelName
        })
      });
      headers = [
        { dataKey: "assetType", header: "Asset Type" },
        { dataKey: "totalCount", header: "Total Count" },
        ...models
      ];
    }
    else {
      let statuses = [];
      this.deviceStatuses.forEach((status: any) => {
        statuses.push({
          dataKey: status.statusName, header: status.statusName
        })
      });
      headers = [
        ...statuses,
        { dataKey: "totalDeviceCount", header: "Total Count" }
      ];
    }

    return headers;
  }

  downloadExport(val) {
    let title: string, sheetName: string;
    if (val == 1)
      title = 'Assets by Study';
    else if (val == 2) {
      title = 'Customer Support Tickets by Study';
      sheetName = 'Tickets by Study';
    }
    else if (val == 3)
      title = 'Asset Issues';
    else if (val == 4)
      title = 'Asset Issue by Study';
    else if (val == 5)
      title = 'Total Assets';
    else
      title = 'Total Assets By Status';

    this.exportAsExcelFile(this.excelData(val), title, sheetName);
  }

  excelData(val: number | string) {
    if (val == 1) {
      this.exportDataExcel = [];
      this.devicesBystudyDefault.forEach((study: any) => {
        let obj: any = {
          study: study.studyName,
          totalCount: this.getTotalStatusCount(study.statusNameCount)
        };
        this.deviceStatuses.forEach((status: any) => {
          obj[status.statusName] = this.getCount(status.statusName, study.statusNameCount, 'statusName', 'statusCount');
        });
        this.exportDataExcel.push(obj);
      });
    }
    else if (val == 2)
      this.exportDataExcel = this.csStudyDefault;
    else if (val == 3)
      this.exportDataExcel = this.csWidgetDefault;
    else if (val == 4) {
      this.exportDataExcel = [];
      this.devicesMalfuncDefault.forEach((study: any) => {
        let obj: any = {
          study: study.studyName,
          ticketsCount: study.ticketsCount
        }
        this.issueList.forEach((issue: any) => {
          obj[issue.issueName] = this.getCount(issue.issueName, study.issueNameCount, 'issueName', 'issueCount');
        });
        this.exportDataExcel.push(obj);
      });
    }
    else if (val == 5) {
      this.exportDataExcel = [];
      let data = [...this.Asset1];
      data.forEach((asset: any) => {
        let obj: any = {
          assetType: asset.deviceType,
          totalCount: asset.deviceCount
        };
        this.modelArr.forEach((model: any) => {
          obj[model.modelName] = this.getCount(asset.deviceType, [model], 'deviceType', 'modelCount');
        });
        this.exportDataExcel.push(obj);
      });
    }
    else {
      this.exportDataExcel = [];
      let obj: any = {
        totalDeviceCount: this.Asset2Default.length ? this.Asset2Default[0].totalDeviceCount : 0
      }
      this.deviceStatuses.forEach((status: any) => {
        obj[status.statusName] = this.getCount(status.statusName, this.Asset2Default, 'status', 'deviceCount');
      });
      this.exportDataExcel.push(obj);
    }
    const arr = [];
    this.exportDataExcel.forEach(ele => {
      const obj = {};
      this.getColumns(val).forEach(ele1 => {
        obj[ele1.header] = ele[ele1.dataKey];
      });
      arr.push(obj);
    });
    return arr;
  }

  exportAsExcelFile(json: any[], excelFileName: string, sheetName?: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const sheetTitle: string = sheetName || excelFileName.substring(0, 31);
    const workbook: XLSX.WorkBook = {
      Sheets: { [sheetTitle]: worksheet },
      SheetNames: [sheetTitle]
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

  getCount(type: string, countObj: any, name: string, count: any) {
    let arr = countObj.filter((obj: any) => obj[name] === type);
    return arr.length ? arr[0][count] : '-';
  }

  getTotalStatusCount(countObj: any) {
    let total: number = 0;
    countObj.forEach((status: any) => {
      total += status.statusCount;
    });
    return total;
  }
}