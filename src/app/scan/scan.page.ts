import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'models/user';


import { FirebaseService } from '../services/firebase.service';
import { Event } from 'models/events';
import { LoadingController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  bo:boolean
  event="";
msg:string=""

  selectedEvent=null;
  data:User={} as User;
  dataArray:User[]=[];
  baka:User[]=[];
  filtered:User[]=[];
  status:string="";
  constructor(private qr:BarcodeScanner,private ss:StorageService,private lc:LoadingController,private toastCtrl:ToastController,
    private fs:FirebaseService,private route:ActivatedRoute,private router:Router,private storage:Storage,) { 
      setInterval(data => {
        this.ss.getEvent().then(x=>{
          
          this.bo=x;
        }).catch((err)=>this.bo=false);
          }, 1000);
  }

  ngOnInit() {
    this.data={} as User;
    this.event=this.route.snapshot.paramMap.get('scan');
    this.ss.getEvent().then(x=>{
      this.bo=false;
      this.ss.setEvent(false);
    }).catch((err)=>this.bo=true);
  }
Scancoder1(){
  
  this.data.eventname=this.event;
  this.qr.scan().then((data) => {
  let s=data.text.split(" ");
        
        this.data.marks=0;
       this.data.receipt=s[0];
       this.data.name=s[1];
        this.data.college=s[2];
        this.data.phone=s[3];
       this.data.rollno=s[4];
      this.data.email=s[5];  
    
   var b= this.fs.getUser('participants',this.data.receipt).valueChanges().subscribe((da:User)=>{
        if(da){
          var x=0;
        this.ss.getItems(this.data.eventname).then(items=>{
          this.baka=items;
          for(var i of this.baka){
            if(i.receipt==this.data.receipt){
              x=1;
              break;
            }
          }
        });
         var a= this.fs.getUser(this.data.eventname,this.data.receipt).valueChanges().subscribe((ittop:User)=>{
            if(ittop||x==1){
              this.toastCtrl.create({
                message: "Participitant already participated in round 1 of" +this.event,
        
                duration: 3000,
                position: 'middle'
              }).then((da)=>{da.present()});  
            }
            else{
              this.ss.addItem(da,this.data.eventname);
              this.toastCtrl.create({
                message: "Successfully registered for round 1 of"+this.event,
        
                duration: 3000,
                position: 'middle'
              }).then((da)=>{da.present()});   
              a.unsubscribe();
              b.unsubscribe();
            }
          });
        }
        else{
          console.log("Not a participitant!!");
        }
    });
 });
    
  }

  Scancoder2(){
  
    this.data.eventname=this.event+'-r2';
    this.qr.scan().then((data) => {
    let s=data.text.split(" ");
          
          this.data.marks=0;
         this.data.receipt=s[0];
         this.data.name=s[1];
          this.data.college=s[2];
          this.data.phone=s[3];
         this.data.rollno=s[4];
        this.data.email=s[5];  
      
     var b= this.fs.getUser('participants',this.data.receipt).valueChanges().subscribe((da:User)=>{
          if(da){
            var x=0;
        this.ss.getItems(this.data.eventname).then(items=>{
          this.baka=items;
          for(var i of this.baka){
            if(i.receipt==this.data.receipt){
              x=1;
              break;
            }
          }
        });
           var a= this.fs.getUser(this.data.eventname,this.data.receipt).valueChanges().subscribe((ittop:User)=>{
              if(ittop||x==1){
                this.toastCtrl.create({
                  message: "Participitant already participated in round 2 of" +this.event,
          
                  duration: 3000,
                  position: 'middle'
                }).then((da)=>{da.present()});  
              }
              else{
                this.ss.addItem(da,this.data.eventname);
                this.toastCtrl.create({
                  message: "Successfully registered for round 2 of"+this.event,
          
                  duration: 3000,
                  position: 'middle'
                }).then((da)=>{da.present()});   
                a.unsubscribe();
                b.unsubscribe();
              }
            });
          }
          else{
            console.log("Not a participitant!!");
          }
      });
   });
      
    }
  UpdateMarksr1(){
    this.data={} as User;
    this.router.navigate(['tabs/organizer/studentlist/',this.event]);
  }
  UploadedDatar1(){
    this.router.navigate(['tabs/organizer/uploadeddata/',this.event]);
  }
  UpdateMarksr2(){
    this.data={} as User;
    this.router.navigate(['tabs/organizer/studentlist/',this.event+'-r2']);
  }
  UploadedDatar2(){
    this.router.navigate(['tabs/organizer/uploadeddata/',this.event+'-r2']);
  }
  logout(){
    
   this.ss.setEvent(false);
   this.data={} as User;
   this.router.navigate(['tabs/organizer']);
  }
getr1(receipt){
  this.data.receipt=receipt;
  this.data.eventname=this.event;
this.lc.create({message:"getting data..."}).then((loading)=>{
  loading.present();
  setTimeout(()=>{
   
    var b= this.fs.getUser('participants',this.data.receipt).valueChanges().subscribe((da:User)=>{
      if(da){
        var x=0;
        this.ss.getItems(this.data.eventname).then(items=>{
          this.baka=items;
          for(var i of this.baka){
            if(i.receipt==this.data.receipt){
              x=1;
              break;
            }
          }
        });
       var a= this.fs.getUser(this.data.eventname,this.data.receipt).valueChanges().subscribe((ittop:User)=>{
        console.log(JSON.stringify(ittop));
          if(ittop||x==1){
            this.toastCtrl.create({
              message: "Participitant already participated in round 1 " +this.event,
      
              duration: 3000,
              position: 'middle'
            }).then((da)=>{da.present()});   
            
          }
          else{
            this.ss.addItem(da,this.event);
            
            this.toastCtrl.create({
              message: "Successfully registered for round 1 "+this.event,
      
              duration: 3000,
              position: 'middle'
            }).then((da)=>{da.present()});   
            a.unsubscribe();
            b.unsubscribe();
          }
        });
      }
      else{
        console.log("Not a participitant!!");
      }
  });
  
 
  loading.dismiss();
  },1000);
});
}

getr2(receipt){
  this.data.receipt=receipt;
  this.data.eventname=this.event+'-r2';
this.lc.create({message:"getting data..."}).then((loading)=>{
  loading.present();
  setTimeout(()=>{
   
    var b= this.fs.getUser('participants',this.data.receipt).valueChanges().subscribe((da:User)=>{
      if(da){
        var x=0;
        this.ss.getItems(this.data.eventname).then(items=>{
          this.baka=items;
          for(var i of this.baka){
            if(i.receipt==this.data.receipt){
              x=1;
              break;
            }
          }
        });
       var a= this.fs.getUser(this.data.eventname,this.data.receipt).valueChanges().subscribe((ittop:User)=>{
        console.log(JSON.stringify(ittop));
          if(ittop||x==1){
            this.toastCtrl.create({
              message: "Participitant already participated in round 2 " +this.event,
      
              duration: 3000,
              position: 'middle'
            }).then((da)=>{da.present()});   
            
          }
          else{
            this.ss.addItem(da,this.data.eventname);
            
            this.toastCtrl.create({
              message: "Successfully registered for round 2 of "+this.event,
      
              duration: 3000,
              position: 'middle'
            }).then((da)=>{da.present()});   
            a.unsubscribe();
            b.unsubscribe();
          }
        });
      }
      else{
        console.log("Not a participitant!!");
      }
  });
  
 
  loading.dismiss();
  },1000);
});

}


}
