import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/user';
import {FormBuilder, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import { StorageService } from '../services/storage.service';
import { FirebaseService } from '../services/firebase.service';
import { ToastController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  bo:boolean
  dbUsers:User[]=[];
  user:User[]=[];
  registrationForm:any;
  status:string=""
  data:User={} as User;
  usersList:User[]=[];
  bo1:boolean=false;
  msg:string="";
  constructor(private fb:FormBuilder,private router:Router,private ss:StorageService,private fs:FirebaseService,
    private toastCtrl:ToastController,private lc:LoadingController) {  
    setInterval(data => {
    this.ss.getAuth().then(x=>{
      
      this.bo=x;
    }).catch((err)=>this.bo=false);
      }, 1000);
  }
  
  
  ngOnInit() {
    this.registrationForm=this.fb.group({
      eventname:new FormControl(''),
      marks:new FormControl(0),
      receipt:new FormControl(''),
      name:new FormControl(''),
      college:new FormControl(''),
      phone:new FormControl(''),
      rollno:new FormControl(''),
      email:new FormControl('')
    });
    this.ss.getAuth().then(x=>{
      
      this.bo=x;
    }).catch((err)=>this.bo=false); 
    this.fs.getUsers('participants').valueChanges().subscribe((da:User[])=>{
        this.dbUsers=da;
    });
    
    console.log(this.dbUsers);
  }
  
  createCode(){
    
    this.lc.create({message:"please wait"}).then((loading)=>{
      
      loading.present();
    let s1=""
    this.user.push(this.registrationForm.value);  
    var temp:User=this.registrationForm.value;
    
    s1=this.registrationForm.get('receipt').value.replace(/\s/g,"")+" "+this.registrationForm.get('name').value.replace(/\s/g,"")+" "+
    this.registrationForm.get('college').value.replace(/\s/g,"")+" "+this.registrationForm.get('phone').value.replace(/\s/g,"")+" "+
    this.registrationForm.get('rollno').value.replace(/\s/g,"")+" "+this.registrationForm.get('email').value.replace(/\s/g,"");
    
  
  
      setTimeout(()=>{
            var a=this.fs.getUser('participants',temp.receipt).valueChanges().subscribe((da:User)=>{
              if(da){
                this.toastCtrl.create({
                  message: 'Already registered',
                  duration: 3000,
                  position: 'middle'
                }).then((da)=>{da.present()});
                
              }
              else{
                this.fs.addUser('participants',temp);
                this.toastCtrl.create({
                  message: 'Successfully registered',
              
                  duration: 3000,
                  position: 'middle'
                }).then((da)=>{da.present()});
                console.log("successfully registered");
                a.unsubscribe();
                this.router.navigate(['tabs/register/',s1]);
              }
        });
        loading.dismiss(); 
      },1000);
     
      this.registrationForm.reset();
  });
 
  }
  authenticate(a){
    this.lc.create({message:"authenticating..."}).then((loading)=>{
      loading.present();
      setTimeout(()=>{
      var ab=this.fs.getUser("logins","authenticate").valueChanges().subscribe((baka: {password: string})=>{
        if(a.value==baka.password){
          this.ss.setAuth(true);
          ab.unsubscribe();
          this.toastCtrl.create({
            message: 'Authentication success',
        
            duration: 2000,
            position: 'middle'
          }).then((da)=>{da.present()});
        }
        else {
          this.toastCtrl.create({
            message: 'Authentication failed',
        
            duration: 2000,
            position: 'middle'
          }).then((da)=>{da.present()});
        }
      });
      loading.dismiss();
      },1000);
    
      })
  
    
    
  }
  unauth(){
    this.lc.create({message:"logging out..."}).then((loading)=>{
      loading.present();
      setTimeout(()=>{this.ss.setAuth(false);
        loading.dismiss();
      },1000)
    
    
      })

  }
  
}
