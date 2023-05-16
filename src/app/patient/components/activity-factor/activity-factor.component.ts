import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-activity-factor',
  templateUrl: './activity-factor.component.html',
  styleUrls: ['./activity-factor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivityFactorComponent implements OnInit {

  petId: any;
  studyId: any;
  petParents: any = [];
  headers = [];
  reportName: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private customDatePipe: CustomDateFormatPipe,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      let str = this.router.url;
      this.petId = str.split("view/")[1].split("/")[0];
      this.studyId = str.split("view/")[1].split("/")[1];
    });
    this.reportName = "Pet Activity Factor:" + ' ' + sessionStorage.getItem('viewPetName');
    this.headers = [
      { key: "studyName", label: "STUDY NAME", checked: true, width: 160 },
      { key: "extPetValue", label: "EXT PET VALUE", checked: true, width: 90 },
      { key: "algorithmName", label: "ALGORITHM NAME", checked: true, width: 150 },
      { key: "algorithmVerion", label: "ALGORITHM VERSION", checked: true },
      { key: "afCalculatedDate", label: "DATE OF EXECUTION", checked: true, format: 'MM/dd/yyyy' },
      { key: "traditionalEe", label: "TRADITIONAL EE", checked: true },
      { key: "estimatedEnergyExpenditure", label: "ESTIMATED ENERGY EXPENDITURE", checked: true },
      { key: "estimatedStepCount", label: "ESTIMATED STEP COUNT", checked: true },
      { key: "estimatedAf", label: "ESTIMATED ACTIVITY FACTOR", checked: true },
      { key: "recommendedFeedAmt", label: "RECOMMENDED FEED AMOUNT", checked: true },
      { key: "feedUnits", label: "FEED UNITS", checked: true }
    ];
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.afCalculatedDate = this.customDatePipe.transform(ele.afCalculatedDate, 'MM/dd/yyyy');
    });
  }
}