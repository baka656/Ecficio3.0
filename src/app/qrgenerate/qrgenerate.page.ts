import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {User} from 'models/user';
import {File} from '@ionic-native/file/ngx';
import { FirebaseService } from '../services/firebase.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-qrgenerate',
  templateUrl: './qrgenerate.page.html',
  styleUrls: ['./qrgenerate.page.scss'],
})
export class QrgeneratePage implements OnInit {
  registerUser:User={} as User;
  myDate: string = new Date().toISOString();
  constructor(private route:ActivatedRoute,private file:File,private emailComposer:EmailComposer,
    private fs:FirebaseService,private socialSharing: SocialSharing) { }
  qrdata={};
  path;
  imageData;
  ngOnInit() {
    this.path="/tabs/register";
    this.qrdata=this.route.snapshot.paramMap.get('abc')+" "+this.myDate;
    let s=String(this.qrdata).split(" ");
    this.registerUser.receipt=s[0];
    
  
    this.registerUser.name=s[1];
    this.registerUser.college=s[2];
    this.registerUser.phone=s[3];
    this.registerUser.rollno=s[4];
    this.registerUser.email=s[5];
    this.registerUser.timestamp=this.myDate;
    
    
    
  }
send(){
  
  const canvas=document.querySelector('canvas') as HTMLCanvasElement;
    this.imageData=canvas.toDataURL().toString();

    this.socialSharing.shareViaEmail('ECFICIO 3.0\n\n'+this.registerUser.name+', Thanks for Registering for Ecficio 3.0\n\nPlease find your unique QR Code below ,which is to be used in events paticipation','Sucessfully registered for Ecficio 3.0!',[this.registerUser.email],['monadarling858@gmail.com'],null,this.imageData).then(()=>{
      console.log("success");
    }).catch(()=>{
      console.log("error");
    }); 

}



}
