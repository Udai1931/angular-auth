import { Injectable } from '@angular/core';
import { User } from "../shared/user";
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  userAuth: any;
  userData: any;
  logged: boolean = false;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', "");
      }
    })

    this.afAuth.onAuthStateChanged(user => {
      //isko or better krna pdega bcoz it takes a littele time to load the user
      //local storage
      console.log(user)
      this.userAuth = user;
      if (user) {
        this.logged = true;
      } else {
        this.router.navigate(["sign-in"]);
        this.logged = false;
      }
      console.log(this.logged);
    })
  }

  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        // this.ngZone.run(() => {
        // this.router.navigate(['dashboard']);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  SignUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("Successfully signed up.")
      })
  }

  SendVerificationMail() {
    return this.afAuth.currentUser.then(user => user?.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
  }

  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  Logout() {
    return this.afAuth.signOut().then(() => {
      // localStorage.removeItem('user');
      // this.router.navigate(['sign-in']);
    })
  }

  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider:any) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        // this.ngZone.run(() => {
        //   this.router.navigate(['dashboard']);
        // })
        // this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
  }
}
