import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { userData } from '../../Types/user';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit{
  profileService = inject(ProfileService);

  // private userData = signal<userData>(null);

  // Create state so we can change 
  userData = input<userData>();

  editing = false; //if the user is in the edit(form) view - by default it's not in edit, so false

  userForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    age: new FormControl(),
    password: new FormControl(),

    // be blank on register and user can fill in on profile page later...
    bio: new FormControl('')
  }); //will want to have the gender and country (note that those are optional fields)

  edit(){//edit button
    this.editing = true;//this will toggle the edit view
  }

  cancelEditing(){
    this.editing = false;//switch back to default/non edit view
    //may want to add a form rest/clearing
  }

  //on form submit callback...
  onSubmit() {
    //Check database for users with same name or email...

    //This should be patching or updating data for profile user....
    // this.profileService.postNewUser(this.userForm.value);
    
    // TODO: Use EventEmitter with form value
    console.warn(this.userForm.value);

    this.editing = false;//switch back to default/non edit view
  }


  


  //run when component is initiated...
  ngOnInit(): void {
  //   this.profileService.getMe().subscribe((data) => {
  //     console.log('Your data of yourself',data);
  //     // set user data
  //     this.userData.set(data);
  //   });
  //   console.log("Profile component has been loaded...")
  // }
 }
}
