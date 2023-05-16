import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PetService } from '../../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



@Component({
  selector: 'app-pet-img-scoring',
  templateUrl: './pet-img-scoring.component.html',
  styleUrls: ['./pet-img-scoring.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PetImgScoringComponent implements OnInit {
  filterTypeArr: any[];
  modalRef2: NgbModalRef;
  headers: any;
  petId: string;
  studyId: string;
  reportName:any= '';
  enthusiasmScaleId: any = '';
  feedingTimeId: any = '';
  searchText: any = '';
  petFeedingEnthusiasmScaleDtls: any;
  @ViewChild('archiveContent4') archiveContent4: ElementRef;
  
  exportDataExcel: any;
    //paginatio logic
    parentPage = 1;
    parentpageSize = 5;
  //paginatio logic ends
  fileName= 'Weight History'; 
  playImgUrl: any;
  

  constructor(
    private petService:PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private customDate: CustomDateFormatPipe,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.reportName = "Pet Image Scoring Response:" + ' ' + sessionStorage.getItem('viewPetName');
    this.headers = [

      { key: "scoreType", label: "Scoring Type", checked: true },
      { key: "scaleName", label: "Scale Name ", checked: true },
      { key: "imageLabel", label: "Label", checked: true },
      { key: "score", label: "Score/Value", checked: true },
  
      // { key: "feedingTime", label: "Feeding Frequency", checked: true },
      { key: "petImagePath", label: "Image Uploaded", checked: true,  clickable: true },
      { key: "submittedOn", label: "Submitted On", checked: true},
    ];

    this.filterTypeArr =
      [{
        name: "Score",
        id: "scoreIds"
      },
      {
        name: "Date Between",
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
    if (ele.submittedOn) {
      ele.submittedOn = ele.submittedOn ? this.customDate.transform(ele.submittedOn, 'MM/dd/yyyy') : '-'
    }
    ele['image'] = ele.petImagePath

    if (ele.petImagePath) {
      ele.petImagePath = `<span class="petImage img-wrapper" ><img class="" src= ` + 
      ele.petImagePath + ` height="38" width="38"  ></span>`
    } else {
      ele.petImagePath = '<span class="petImage"><img class="" src="assets/images/no-dogs.svg" height="38" width="38"></span>';
    }
    
  })
}
getNode($event) {
  console.log($event);
  let play = $event.item.image
  if($event.header == 'petImagePath')
   {
    this.playImg(play)
   }
  
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

playImg(petImagePath) {
  console.log(petImagePath);
  this.openPopup(this.archiveContent4, 'xs');
  this.playImgUrl = petImagePath;
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
