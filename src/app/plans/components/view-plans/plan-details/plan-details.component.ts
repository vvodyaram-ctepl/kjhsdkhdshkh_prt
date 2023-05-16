import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlansService } from '../../plans.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss']
})
export class PlanDetailsComponent implements OnInit {
  planDetails: any = {};
  id: any = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private planservice: PlansService,
    private spinner: NgxSpinnerService,
    private customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async params => {
      if (this.router.url.indexOf('/plan-details') > -1) {
        let str = this.router.url;
        this.id = str.split("view/")[1].split("/")[0];
        this.spinner.show();
        this.planservice.getPlanService(`/api/plans/${this.id}`).subscribe(res => {
          console.log(res);
          if (res.status.success === true) {
            this.planDetails = res.response.planListDTO;
            this.planDetails.createDate = this.planDetails.createDate ? this.customDatePipe.transform(this.planDetails.createDate, 'MM/dd/yyyy') : '';
            this.spinner.hide();
          }
        })
      }
    })
  }

  next(id) {
    this.router.navigate([`/user/plans/view/${id}/study-association`]);
  }

}
