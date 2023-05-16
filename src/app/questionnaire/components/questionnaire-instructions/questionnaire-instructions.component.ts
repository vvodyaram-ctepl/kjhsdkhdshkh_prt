import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { LookupService } from 'src/app/services/util/lookup.service';
import { TabserviceService } from 'src/app/shared/tabservice.service';

@Component({
  selector: 'app-questionnaire-instructions',
  templateUrl: './questionnaire-instructions.component.html',
  styleUrls: ['./questionnaire-instructions.component.scss']
})
export class QuestionnaireInstructionsComponent implements OnInit {
  insType: number = 1;
  addInstForm: FormGroup;
  preDefinedInstructions = [];
  addedInstructions = [];
  editFlag: boolean = false;
  editId: any;
  changeInstruction: boolean = false;
  editedIndx: number;
  data: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private tabservice: TabserviceService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) {

    this.addInstForm = this.fb.group({
      instructionId: [],
      definedInstruction: [''],
      instruction: ['', [Validators.required]],
      saveForFuture: [false],
      isUpdated: [false]
    })
  }

  ngOnInit(): void {
    this.getPredefinedInstructions();
    if (this.router.url.includes("/user/questionnaire/edit")) {
      this.editFlag = true;
      this.editId = this.router.url.split('edit/')[1].split('/')[0];
    }
    this.patchData();
  }

  patchData() {
    this.data = this.tabservice.getModelData();
    if (!this.data) {
      if (!this.editFlag)
        this.router.navigate(['/user/questionnaire/add/basic-details']);
      else
        this.router.navigate([`/user/questionnaire/edit/${this.editId}/basic-details`]);
      return;
    }
    this.addedInstructions = this.data ? (this.data['instructions'] ? this.data['instructions'] : []) : [];
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.includes("/user/questionnaire/add") || next.url.includes("/user/questionnaire/edit") || next.url.includes("/login")) {
      if(next.url && next.url.includes("preview-questionnaire") && !(this.data && this.data.questions && this.data.questions.length)) {
        this.toastr.error('Select/Add at least one question from questions tab');
        return;
      }
      this.tabservice.setModelData(this.addedInstructions, 'instructions');
      return true;
    }
    else {
      return this.alertService.confirm();
    }
  }

  getPredefinedInstructions() {
    this.spinner.show();
    this.lookupService.getPredefinedInstructions('/api/lookup/getPreDefinedInstructions').subscribe(res => {
      if (res.status.success === true) {
        this.preDefinedInstructions = res.response.preDefinedInstructions;
        this.spinner.hide();

      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    },
      err => {
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

  instructionSelected(event) {
    this.changeInstruction = true;
    this.addInstForm.patchValue({ instruction: event.preDefinedInstruction/* , instructionId: event.preDefinedInstructionId */ });
  }

  formReset() {
    this.addInstForm.reset();
    this.changeInstruction = false;
  }

  addInstruction() {
    if (!this.addInstForm.value.instruction) {
      this.toastr.error('Please add the instruction.', 'Error!');
      return;
    }
    let isExist = false;
    this.addedInstructions.forEach(inst => {
      if (this.addInstForm.value.instruction === inst.instruction) {
        isExist = true;
      }
    });
    if (!isExist) {
      if (this.editedIndx >= 0) {
        this.addedInstructions[this.editedIndx] = this.addInstForm.value;
        this.addedInstructions[this.editedIndx].isUpdated = true;
        this.editedIndx = -1;
      }
      else {
        this.addedInstructions.push(this.addInstForm.value);
      }
      this.formReset();
    }
    else {
      this.toastr.error('Instruction already exists.', 'Error!')
    }
  }

  updateInstruction(i, instruction) {
    this.insType = 2;
    this.spinner.show();
    this.editedIndx = i;
    this.addInstForm.patchValue(instruction);
    setInterval(() => {
      this.spinner.hide();
    }, 300);
  }

  deleteInstruction(i) {
    this.addedInstructions.splice(i, 1);
  }

  back() {
    if (!this.editFlag)
      this.router.navigate(['/user/questionnaire/add/basic-details']);
    else
      this.router.navigate([`/user/questionnaire/edit/${this.editId}/basic-details`]);
  }

  next() {
    if (!this.editFlag)
      this.router.navigate(['/user/questionnaire/add/add-questions']);
    else
      this.router.navigate([`/user/questionnaire/edit/${this.editId}/add-questions`]);
  }

}
