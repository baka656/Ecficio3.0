import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import {LoadingController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.page.html',
  styleUrls: ['./organizer.page.scss'],
})
export class OrganizerPage implements OnInit {
  events:Event[]=[];
  constructor(private fs:FirebaseService,private router:Router,private lc:LoadingController,private toastCtrl:ToastController) { }

  ngOnInit() {
    this.fs.getUsers('events').valueChanges().subscribe((da:Event[])=>{
      this.events=da;
   });
  
  }

 SelectedEvent(x,e){
    console.log(e);
   this.lc.create({message:"please wait"}).then( (loading)=>{
     loading.present();
     setTimeout(()=>{
      var a= this.fs.getUser('logins','eventslogin').valueChanges().subscribe((da:{password:string})=>{
       if(x==da.password){
         console.log(x);
         this.router.navigate(['tabs/organizer/scan/',e]);
        a.unsubscribe();
        
        }     
        else{
          
            let toast = this.toastCtrl.create({
              message: 'Invalid credentials / Check your Internet connection',
      
              duration: 3000,
              position: 'middle'
            }).then((da)=>{da.present()});          
        }
     })
     loading.dismiss();
    },1000);
    
  })
   
 }
}
