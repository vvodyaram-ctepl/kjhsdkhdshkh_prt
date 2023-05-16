import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/util/lookup.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { QuestionnaireService } from '../../questionnaire.service';

@Component({
  selector: 'app-view-questionnaire',
  templateUrl: './view-questionnaire.component.html',
  styleUrls: ['./view-questionnaire.component.scss']
})
export class ViewQuestionnaireComponent implements OnInit {
  public flatTabs: any[];
  public data: any = {};
  public questionnaireId: any;
  public menuId: any;
  public isFav: boolean = false;
  RWFlag: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private questionnaireService: QuestionnaireService,
    private userDataService: UserDataService,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private router: Router,
    private tabService: TabserviceService
  ) {
  }

  ngOnInit(): void {
    this.tabService.clearDataModel();
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();

    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "26") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }

    this.flatTabs = [
      { tabId: 1, name: 'Instructions', link: 'instructions', property: 'instructions' },
      { tabId: 2, name: 'Questions', link: 'questions', property: 'questions' },
    ];

    this.spinner.show();
    this.activatedRoute.params.subscribe(params => {
      this.questionnaireId = params.questionnaireId;
      this.questionnaireService.getQuestionnaireById(`/api/questionnaire/${this.questionnaireId}`).subscribe(res => {
        if (res.status.success === true) {
          this.data = res.response.questionnaire;
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
    });
    this.checkFav();
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

  checkFav() {
    let userProfileData = this.userDataService.getRoleDetails();
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "26") {
        this.menuId = ele.menuId;
      }
    });

    this.lookupService.getFavInfo(`/api/favourites/isFavourite/${this.menuId}/${this.questionnaireId}`).subscribe(res => {
      if (res.response.favourite.isFavourite)
        this.isFav = true;
    });
  }

  makeFav() {
    this.spinner.show();
    this.lookupService.addasFav(`/api/favourites/${this.menuId}/${this.questionnaireId}`, {}).subscribe(res => {
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

  removeFav() {
    this.spinner.show();
    this.lookupService.removeFav(`/api/favourites/${this.menuId}/${this.questionnaireId}`, {}).subscribe(res => {
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

  errorMsg(err) {
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      this.spinner.hide();
    }
    else {
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      this.spinner.hide();
    }
  }

  back() {
    this.router.navigate(['/user/questionnaire']);
  }
  addQuestionnaire() {
    this.router.navigate(['/user/questionnaire/add']);
  }
  editQuestionnaire() {
    this.tabService.clearDataModel();
    this.router.navigate(['/user/questionnaire/edit', this.questionnaireId]);
  }
}
