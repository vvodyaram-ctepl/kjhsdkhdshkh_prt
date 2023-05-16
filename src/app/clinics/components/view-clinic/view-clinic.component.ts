import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClinicService } from '../clinic.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { LookupService } from 'src/app/services/util/lookup.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-clinic',
  templateUrl: './view-clinic.component.html',
  styleUrls: ['./view-clinic.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbCarouselConfig]
})
export class ViewClinicComponent implements OnInit {
  toogleACT: boolean = true;
  public flatTabs: any[];
  editFlag: boolean;
  editId: string;
  clinicForm: FormGroup;
  RWFlag: boolean;
  menuId: any;
  public isFav: boolean = false;
  data: any[];
  nextObservable!: Subscription;
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  currentSlide: any;


  constructor(public route: ActivatedRoute,
    public router: Router,
    private spinner: NgxSpinnerService,
    private clinicService: ClinicService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private customDatePipe: CustomDateFormatPipe,
    private lookupService: LookupService,
    private tabService: TabserviceService,
    config: NgbCarouselConfig
  ) {
    config.interval = 0;
    config.wrap = false;
    config.showNavigationArrows = true;

    this.clinicForm = this.fb.group({
      'clinicName': [''],
      'totalActivePets': [''],
      'totalInactivePets': [''],
      'pinv': [''],
      'status': [''],
      'description': [''],
      'isExternal': [''],
      'startDate': [''],
      'endDate': [''],
      'preludeUrl': [''],
      'notifications': ['']
    });

  }

  ngOnDestroy() {
    if (this.nextObservable) {
      this.nextObservable.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.clinicService.nextIdentifier$.subscribe((data) => {
      console.log(data);
      if (data && data == 'next') {
        this.carousel.next();
      } else if (data && data == 'back') {
        this.carousel.select('0');
        this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-plans`]);
        //this.carousel.prev();
      }

    });
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "11") {
        menuActionId = ele.menuActionId;
        this.menuId = ele.menuId;
      }
    });

    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.flatTabs = [
      { tabId: 1, name: 'Associated Plans', link: 'view-plans', property: 'viewPlans' },
      { tabId: 2, name: 'Associated Pets', link: 'view-associated-pets', property: 'viewAssociatedPets' },
      { tabId: 3, name: 'Notes', link: 'view-notes', property: 'viewNotes' },
      { tabId: 4, name: 'Mobile App Config', link: 'mobile-app-config', property: 'mobileApp' },
      { tabId: 5, name: 'Push Notification', link: 'view-push-notification', property: 'pushNotification' },
      { tabId: 9, name: 'Image Scoring', link: 'view-study-image-scoring', property: 'imageScoring' },
      { tabId: 6, name: 'Questionnaire', link: 'view-questionnaire', property: 'questionnaire' },
      { tabId: 8, name: 'Activity Factor', link: 'view-activity-factor', property: 'viewActivityFactor' },
      { tabId: 7, name: 'Activities', link: 'view-activity', property: 'viewActivity' }
    ];



    if (this.router.url.indexOf('/view-clinic') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("view-clinic/")[1].split("/")[0]
      this.editFlag = true;
      this.editId = id;
      this.spinner.show();
      this.clinicService.getStudy(`/api/study/${id}`, '').subscribe(res => {
        console.log("study", res);
        if (res.status.success == true) {
          let study = res.response.rows;
          this.clinicForm.patchValue({
            'clinicName': study.studyName ? study.studyName : '',
            'totalActivePets': study.totalActivePets,
            'totalInactivePets': study.totalInactivePets,
            'pinv': study.principleInvestigator ? study.principleInvestigator : '',
            'status': study.status == '1' ? 'Active' : 'Inactive',
            'description': study.description ? study.description : '',
            'startDate': study.startDate ? this.customDatePipe.transform(study.startDate, 'MM/dd/yyyy') : '',
            'endDate': study.endDate ? this.customDatePipe.transform(study.endDate, 'MM/dd/yyyy') : '',
            'notifications': study.isNotificationEnable,
            'preludeUrl': study.preludeUrl,
            'isExternal': study.isExternal
          })
          this.spinner.hide();
          console.log("this.clinicForm", this.clinicForm.value);
          console.log(this.clinicForm.value.isExternal);
          if (this.clinicForm.value.isExternal == 1 && this.clinicForm.value.preludeUrl != '') {
            this.flatTabs = [
              { tabId: 1, name: 'Associated Plans', link: 'view-plans', property: 'viewPlans' },
              { tabId: 2, name: 'Associated Pets', link: 'view-associated-pets', property: 'viewAssociatedPets' },
              { tabId: 3, name: 'Notes', link: 'view-notes', property: 'viewNotes' },
              { tabId: 4, name: 'Mobile App Config', link: 'mobile-app-config', property: 'mobileApp' },
              { tabId: 5, name: 'Push Notification', link: 'view-push-notification', property: 'pushNotification' },
              { tabId: 9, name: 'Image Scoring', link: 'view-study-image-scoring', property: 'imageScoring' },
              { tabId: 6, name: 'Questionnaire', link: 'view-questionnaire', property: 'questionnaire' },
              { tabId: 7, name: 'Prelude Config', link: 'view-prelude-config', property: 'viewPreludeConfig' },
              { tabId: 10, name: 'Activity Factor', link: 'view-activity-factor', property: 'viewActivityFactor' },
              { tabId: 8, name: 'Activities', link: 'view-activity', property: 'viewActivity' }
            ];
          } else {
            this.flatTabs = [
              { tabId: 1, name: 'Associated Plans', link: 'view-plans', property: 'viewPlans' },
              { tabId: 2, name: 'Associated Pets', link: 'view-associated-pets', property: 'viewAssociatedPets' },
              { tabId: 3, name: 'Notes', link: 'view-notes', property: 'viewNotes' },
              { tabId: 4, name: 'Mobile App Config', link: 'mobile-app-config', property: 'mobileApp' },
              { tabId: 5, name: 'Push Notification', link: 'view-push-notification', property: 'pushNotification' },
              { tabId: 9, name: 'Image Scoring', link: 'view-study-image-scoring', property: 'imageScoring' },
              { tabId: 6, name: 'Questionnaire', link: 'view-questionnaire', property: 'questionnaire' },
              { tabId: 8, name: 'Activity Factor', link: 'view-activity-factor', property: 'viewActivityFactor' },
              { tabId: 7, name: 'Activities', link: 'view-activity', property: 'viewActivity' }
            ];
          }
          this.studyArray(5, this.flatTabs);
        }
      }, err => {

        console.log(err);
        if (err.status == 500) {
          this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
        }
        else {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
        }
        this.spinner.hide();
      })
    }
    this.checkFav();
  }
  studyArray(numberOfChunks, inputList) {
    this.data = [];
    var result = inputList.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / numberOfChunks)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item);
      this.data = resultArray;
      return resultArray
    }, [])

  }

  onSlide($event?, carousel?) {
    //this.currentSlide = $event.current;
    if ($event.current == "1") {
      console.log("$event")
      this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-study-image-scoring`]);
    }
    if ($event.current == "0") {
      console.log("$event")
      this.router.navigate([`/user/clinics/view-clinic/${this.editId}/view-plans`]);
    }
  }

  editStudy() {
    this.tabService.clearDataModel();
    this.router.navigate([`/user/clinics/edit-clinic/${this.editId}/basic-details`]);
  }
  checkFav() {
    //check favorite
    this.lookupService.getFavInfo(`/api/favourites/isFavourite/${this.menuId}/${this.editId}`).subscribe(res => {
      if (res.response.favourite.isFavourite)
        this.isFav = true;
    });
  }
  makeFav() {
    this.spinner.show();
    this.lookupService.addasFav(`/api/favourites/${this.menuId}/${this.editId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.isFav = true;
        this.toastr.success('Added to Favorites');
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    },
      err => {
        this.errorMsg(err);
      }
    );
  }
  errorMsg(err) {
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      this.spinner.hide();
    }
    else {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      this.spinner.hide();
    }
  }

  removeFav() {
    this.spinner.show();
    this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.editId}`, {}).subscribe(res => {
      if (res.status.success === true) {
        this.isFav = false;
        this.toastr.success('Removed from Favorites');
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    },
      err => {
        this.errorMsg(err);
      }
    );
  }
  public activateTab(activeTab) {
    this.flatTabs.forEach(flatTag => {
      if (flatTag.tabId == activeTab.tabId) {
        flatTag.active = true;
      } else {
        flatTag.active = false;
      }
    });
  }
  // editClinic() {
  //   this.router.navigate(['/user/clinics/edit-clinic/2971/basic-details']);
  // }

}
