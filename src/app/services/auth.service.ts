import { Injectable, inject } from '@angular/core';
import { 
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential
} from '@angular/fire/auth';

import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  /** LOGIN EMAIL */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /** SIGNUP EMAIL */
  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /** LOGIN GOOGLE */
  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  /** OBTIENE ROL */
  async getUserRole(uid: string): Promise<string | null> {
    const ref = doc(this.firestore, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data()['rol'] ?? null : null;
  }

  /** CREA USER SI NO EXISTE */
  async ensureUserExists(uid: string, email: string) {
    const ref = doc(this.firestore, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        email,
        rol: "cliente"
      });
    }
  }
}
