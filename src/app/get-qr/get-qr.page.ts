import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import {User} from 'models/user';
import { StorageService } from '../services/storage.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-get-qr',
  templateUrl: './get-qr.page.html',
  styleUrls: ['./get-qr.page.scss'],
})
export class GetQRPage implements OnInit {
  qrdata;
  bo:boolean=true;
  msg="";
  myDate;
  registeredUser:User={} as User;
  constructor(private fs:FirebaseService,private ss:StorageService,private lc:LoadingController,
    private toastCtrl:ToastController,private socialSharing:SocialSharing) { 
    
  }

  ngOnInit() {
     
  }
  getqr(r){
    this.lc.create({message:'getting data...'}).then((loading)=>{
      loading.present();
      setTimeout(()=>{
  this.fs.getUser('participants',r).valueChanges().subscribe((da:User)=>{

        //if(da.phone==p){
          this.registeredUser=da;
          this.myDate=da.timestamp;
          
          this.qrdata=da.receipt+" "+da.name+" "+da.college+" "+da.phone+" "+da.rollno+" "+da.email+" "+da.timestamp;
          this.bo=false;
          this.toastCtrl.create({
            message: 'Done',
        
            duration: 1000,
            position: 'middle'
          }).then((da)=>{da.present()});
        /*}
        else{
          this.toastCtrl.create({
            message: 'invalid Combination',
        
            duration: 1000,
            position: 'middle'
          }).then((da)=>{da.present()});
          
        }*/
    });
    loading.dismiss();
  },1000);
 loading.dismiss();
  },err=>{
    
  });
  }

  send(){
    const canvas=document.querySelector('canvas') as HTMLCanvasElement;
    const imageData=canvas.toDataURL().toString();

    this.socialSharing.shareViaEmail('ECFICIO 3.0\n\n'+this.registeredUser.name+', Thanks for Registering for Ecficio 3.0\n\nPlease find your unique QR Code below ,which is to be used in events paticipation','Sucessfully registered for Ecficio 3.0!',[this.registeredUser.email],['monadarling858@gmail.com'],null,imageData).then(()=>{
      console.log("success");
    }).catch(()=>{
      console.log("error");
    }); 
  }
  done(){
    this.bo=!this.bo;

  }

}
