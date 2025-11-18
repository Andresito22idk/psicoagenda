// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  Timestamp
} from '@angular/fire/firestore';

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
    return snap.exists() ? (snap.data() as any)['rol'] ?? null : null;
  }

  /** CREA USER SI NO EXISTE */
  async ensureUserExists(uid: string, email: string, nombre?: string) {
    const ref = doc(this.firestore, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        email,
        nombre: nombre ?? '',
        rol: "cliente",
        createdAt: Timestamp.now()
      });
    }
  }

  /**
   * Crea un turno en la colección "turnos".
   * turno = {
   *   profesionalId, profesionalNombre, profesionalEspecialidad,
   *   userUid, userNombre, userEmail,
   *   fecha (YYYY-MM-DD), hora (HH:MM),
   *   estado: 'pendiente' | 'confirmada' | 'cancelada' | 'reagendada',
   *   nota?: string
   * }
   */
  async createTurno(turno: Record<string, any>) {
    const colRef = collection(this.firestore, 'turnos');
    const docRef = await addDoc(colRef, {
      ...turno,
      creadoEn: Timestamp.now()
    });
    return docRef.id;
  }

  /**
   * Devuelve los turnos de un profesional en una fecha dada
   * (usamos fecha string YYYY-MM-DD para consulta simple).
   */
  async getTurnosProfesionalFecha(profesionalId: string, fecha: string) {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('profesionalId', '==', profesionalId), where('fecha', '==', fecha), orderBy('hora'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  /** Devuelve los turnos de un usuario (por uid) */
  async getTurnosUsuario(uid: string) {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('userUid', '==', uid), orderBy('fecha', 'desc'), orderBy('hora'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  /** Obtiene la lista de profesionales */
async getProfesionales() {
  const col = collection(this.firestore, 'profesionales');
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

  /** Devuelve todos los turnos (admin) ordenados por creación */
  async getAllTurnos() {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, orderBy('creadoEn', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  /** Actualiza estado / campos de un turno (aceptar, cancelar, reagendar) */
  async updateTurno(turnoId: string, data: Record<string, any>) {
    const ref = doc(this.firestore, 'turnos', turnoId);
    await updateDoc(ref, {
      ...data,
      actualizadoEn: Timestamp.now()
    });
  }
}
