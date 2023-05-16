import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClinicService } from '../clinic.service';
import { ToastrService } from 'ngx-toastr';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.component.html',
  styleUrls: ['./view-plans.component.scss']
})
export class ViewPlansComponent implements OnInit {
  headers: any;
  private modalRef: NgbModalRef;
  modalRef2: NgbModalRef;
  addPlanForm: FormGroup;
  arr: FormArray;
  @ViewChild('archiveContent') archiveContent: ElementRef;
  dataArr: any;
  editFlag: boolean;
  editId: string;
  constructor(public router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private clinicService: ClinicService,
    private toastr: ToastrService,
    public customDatePipe: CustomDateFormatPipe) { }

  ngOnInit() {
    this.addPlanForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    })

    this.headers = [
      // { label: "S.No", checked: true },
      { label: "Plan Name", checked: true },
      { label: "Date Subscribed", checked: true }
    ];
    if (this.router.url.indexOf('/view-clinic') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("view-clinic/")[1].split("/")[0];
      this.editFlag = true;
      this.editId = id;
      this.spinner.show();
      this.clinicService.getStudy(`/api/study/${id}`, '').subscribe(res => {
        console.log("res", res);
        if (res.status.success == true) {
          let study = res.response.rows;
          this.dataArr = study.plansSubscribed;
          console.log("this.dataArr", this.dataArr);
          this.dataArr.forEach(ele => {
            ele.subscribedDate = this.customDatePipe.transform(ele.subscribedDate, 'MM/dd/yyyy');
          })
          // this.addClinicForm.patchValue({
          //   'clinicName': study.studyName ? study.studyName :'',
          //   'start_date':study.startDate ? this.customDatePipe.transform(study.startDate, 'MM-dd-yyyy') :'',
          //   'end_date':study.endDate ?  this.customDatePipe.transform(study.endDate, 'MM-dd-yyyy') :'',
          //   'pinv':study.principleInvestigator ? study.principleInvestigator:'',
          //   'status': study.status ? study.status :''
          // })
          this.spinner.hide();
        }
      },
        err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        }
      );
    }
  }

  createItem() {
    return this.fb.group({
      planName: [''],
      dateSubscribed: ['']
    })
  }

  addItem() {
    this.arr = this.addPlanForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i: number) {
    this.arr = this.addPlanForm.get('arr') as FormArray;
    this.arr.removeAt(i);
  }

  onSubmit($event) {
    console.log("addPlan", $event);

  }

  formatter($event) {

  }
  getNode($event) {

  }
  back() {

  }
  next() {

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

  addPlan() {
    this.openPopup(this.archiveContent, 'xs');
  }
}
