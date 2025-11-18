import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private firestore = inject(Firestore);

  // Obtener todos los profesionales (espera que exista la colección 'profesionales')
  async getProfesionales(): Promise<any[]> {
    try {
      const ref = collection(this.firestore, 'profesionales');
      const snap = await getDocs(ref);
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    } catch (e) {
      console.error('HomeService.getProfesionales error', e);
      return [];
    }
  }

  // Obtener datos del usuario por uid (colección 'users')
  async getUsuario(uid: string): Promise<any | null> {
    try {
      const ref = doc(this.firestore, 'users', uid);
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data() as any) : null;
    } catch (e) {
      console.error('HomeService.getUsuario error', e);
      return null;
    }
  }

  // utilidad para asegurar doc del usuario (no obligatorio)
  async ensureUser(uid: string, data: Record<string, any>) {
    try {
      const ref = doc(this.firestore, 'users', uid);
      await (await import('firebase/firestore')).setDoc(ref as any, data, { merge: true });
    } catch (e) {
      console.warn('ensureUser fallback failed', e);
    }
  }
}
