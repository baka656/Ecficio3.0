import { Component, OnInit } from '@angular/core';

import {User } from 'models/user';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
@Component({
  selector: 'app-uploadeddata',
  templateUrl: './uploadeddata.page.html',
  styleUrls: ['./uploadeddata.page.scss'],
})
export class UploadeddataPage implements OnInit {
  users:User[]=[];
  selectedevent:string;
  path;
  constructor(private fs:FirebaseService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.selectedevent=this.route.snapshot.paramMap.get('db');
    this.path="/tabs/organizer/scan/"+this.selectedevent;
    console.log("From NgOnInit "+this.selectedevent);
    this.fs.getUsers(this.selectedevent).valueChanges().subscribe((da:User[])=>{
    this.users=da;
    this.users.sort((a,b)=>a.marks<b.marks?1:-1); 
    console.log(da)
  }

  );
  
}
search1(s){
  this.users=[];
  this.fs.getUser(this.selectedevent,s).valueChanges().subscribe((da:User)=>{
    this.users.push(da);
  });
  
}
clear(){
  document.querySelector('ion-input').value='';
  this.fs.getUsers(this.selectedevent).valueChanges().subscribe((da:User[])=>{
    this.users=da;
    this.users.sort((a,b)=>a.marks<b.marks?1:-1); 
  });
}


}