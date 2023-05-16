import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss']
})
export class AddContactsComponent implements OnInit {

  addContactForm: FormGroup;
  constructor( private fb: FormBuilder) {
    this.addContactForm = this.fb.group({
      'contact_status': ['', [Validators.required]],
      'contact':'',
      'user_name':'',
      'full_name':'',
      'city':'',
      'state':'',
      'postal_code':'',
      'country':'',
      'phoneNumberCode':'',
      'phoneNumberValue':'',
      'email_address':''

   })
   }

  ngOnInit(): void {
  }

  onSubmit($event) {
    
  }
}
