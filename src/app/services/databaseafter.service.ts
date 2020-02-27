import { Injectable } from '@angular/core';
import {User} from 'models/user';
import {Observable} from 'rxjs';
import {AngularFirestore,AngularFirestoreCollection,DocumentReference} from '@angular/fire/firestore'
import {map,take} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DatabaseafterService {
  users:Observable<User[]>;
  userCollection:AngularFirestoreCollection<User>;
  constructor(private afs:AngularFirestore) {
    this.userCollection=this.afs.collection<User>('usersAttended');
    this.users=this.userCollection.snapshotChanges().pipe(map((actions)=>{
      return actions.map(a=>{
        const data=a.payload.doc.data();
        const id=a.payload.doc.id;
        return {id,...data};
      });
    })
  );
   }
   getUsers(){
    
     return this.users;
   }
   getUser(id:string):Observable<User>{
     return this.userCollection.doc<User>(id).valueChanges().pipe(
       take(1),
       map(user=>{
         user.id=id;
         return user;
       })
     );
   }
   addUser(user:User){
     return this.userCollection.add(user);
   }
   updateUser(user:User):Promise<void>{
     return this.userCollection.doc(user.receipt).update({
      eventname:user.eventname,
      marks:user.marks,
      receipt:user.receipt,
      name:user.name,
      email:user.email,
      phone:user.phone,
      college: user.college,
      rollno:user.rollno
     });
   }
   deleteUser(user:User):Promise<void>{
     return this.userCollection.doc(user.id).delete();
   }
   
}
