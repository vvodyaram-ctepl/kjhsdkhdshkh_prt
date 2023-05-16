import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PetService } from '../../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



@Component({
  selector: 'app-pet-eating',
  templateUrl: './pet-eating.component.html',
  styleUrls: ['./pet-eating.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PetEatingComponent implements OnInit {
  filterTypeArr: any[];
  headers: any;
  petId: string;
  studyId: string;
  reportName:any= '';
  enthusiasmScaleId: any = '';
  feedingTimeId: any = '';
  searchText: any = '';
  petFeedingEnthusiasmScaleDtls: any;
  
  exportDataExcel: any;
    //paginatio logic
    parentPage = 1;
    parentpageSize = 5;
  //paginatio logic ends
  fileName= 'Weight History'; 
  

  constructor(
    private petService:PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private customDate: CustomDateFormatPipe
  ) { }

  async ngOnInit() {
    this.reportName = "Pet Eating Enthusiasm Response:" + ' ' + sessionStorage.getItem('viewPetName');
    this.headers = [
      
      { key: "enthusiasmScaleId", label: "Scale Value", checked: true},
      { key: "enthusiasmScaleDesc", label: "Scale Description", checked: true },
      { key: "feedingTime", label: "Feeding Frequency", checked: true },
      { key: "feedingDate", label: "Submitted On", checked: true},
    ];

    this.filterTypeArr =
      [{
        name: "Eating Enthusiasm",
        id: "eatingIds"
      },
      {
        name: "Feeding ",
        id: "feedingIds"
      },
      {
        name: "Feeding Date Between ",
        id: "dateType"
      },
      
    ];


      this.activatedRoute.params.subscribe(async params => {
        let str = this.router.url;
        this.petId = str.split("view/")[1].split("/")[0];
        this.studyId = str.split("view/")[1].split("/")[1];
      })

      // await this.getInitData();
      
  }

formatter($event)  {
  $event.forEach(ele => {
    if (ele.feedingDate) {
      ele.feedingDate = ele.feedingDate ? this.customDate.transform(ele.feedingDate, 'MM/dd/yyyy') : '-'
    }
  })
}
  // getInitData() {
  //   this.spinner.show();
  //   this.petService.getPetEating(this.petId,this.enthusiasmScaleId, this.feedingTimeId,this.searchText, ).subscribe(res => {
  //     if (res.status.success === true) {
  //       this.spinner.hide();
  //       console.log(res);
  //       this.petFeedingEnthusiasmScaleDtls = res.response.petFeedingEnthusiasmScaleDtls    
  //     }
  //     else {
  //       this.toastr.error(res.errors[0].message);
  //       this.spinner.hide();
  //     }
    
  //   }, err => {
  //     this.spinner.hide();
  //     if (err.status == 500) {
  //       this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
  //     }
  //     else {
  //       this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
  //     }
  //   });
  // }
 
  

}
