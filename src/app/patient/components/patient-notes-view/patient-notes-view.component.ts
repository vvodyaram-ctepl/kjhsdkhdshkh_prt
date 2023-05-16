import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PetService } from '../../pet.service';

@Component({
  selector: 'app-patient-notes-view',
  templateUrl: './patient-notes-view.component.html',
  styleUrls: ['./patient-notes-view.component.scss']
})
export class PatientNotesViewComponent implements OnInit {
  petId: any;
  studyId: any;
  public addNoteForm: FormGroup;
  constructor(
    private petService: PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.petId = str.split("pet-notes-info/")[1].split("/")[0];
      this.studyId = str.split("pet-notes-info/")[1].split("/")[1];
    });
    this.buildForm();
  }

  public buildForm(): void {
    this.addNoteForm = this.fb.group({
      noteType: ['', [Validators.required]],
      content: ['', [Validators.required]],
    })
  }
  backToNotes() {
    this.router.navigate([`/user/patients/view/${this.petId}/${this.studyId}/patient-notes`]);
  }
  updateNotes() {
    if (!this.addNoteForm.valid) {
      this.addNoteForm.markAllAsTouched();
      return false;
    }
    let notes = this.addNoteForm.getRawValue();
    notes['petId'] = parseInt(this.petId);
    this.spinner.show();
    this.petService.addPet(`/api/pets/${this.petId}/addPetNote`, notes).subscribe(res => {
      if (res.status.success === true) {
        this.toastr.success('Notes added successfully!');
        this.spinner.hide();
        this.addNoteForm.markAsPristine();
        this.backToNotes();
      }
      else {
        this.toastr.error(res.errors[0].message);
        this.spinner.hide();
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }
}
