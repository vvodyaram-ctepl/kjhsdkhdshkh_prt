import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlansService } from '../../plans.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-study-association',
  templateUrl: './study-association.component.html',
  styleUrls: ['./study-association.component.scss']
})
export class StudyAssociationComponent implements OnInit {
  planDetails: any = {};
  id: any = '';
  studyNames: any = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private planservice: PlansService,
    private spinner: NgxSpinnerService,
    public customDatePipe: CustomDateFormatPipe
    
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async params => {
      if (this.router.url.indexOf('/study-association') > -1) {
        let str = this.router.url;
        this.id = str.split("view/")[1].split("/")[0];
        this.spinner.show();
        this.planservice.getPlanService(`/api/plans/${this.id}`).subscribe(res => {
          console.log(res);
          if (res.status.success === true) {
            this.planDetails = res.response.planListDTO;
            this.studyNames = this.planDetails.studyAssociatedObject;
            this.studyNames && this.studyNames.forEach(ele =>{
              ele.associatedDate = this.customDatePipe.transform(ele.associatedDate, 'MM/dd/yyyy');
            })
            this.spinner.hide();
          }
        })
      }
    })
  }

  next(id) {
    this.router.navigate([`/user/plans/view/${id}/activities`]);
  }

  // back(id) {
  //   this.router.navigate([`/user/plans/view/${id}/plan-details`]);
  // }

}
