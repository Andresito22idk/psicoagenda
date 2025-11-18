import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private firestore = inject(Firestore);

  /** Obtiene los turnos del usuario actual */
  async getTurnosUsuario(uid: string) {
    const col = collection(this.firestore, 'turnos');

    // ESTA CONSULTA NECESITA ÍNDICE EN FIRESTORE (crear cuando Firebase lo pida)
    const q = query(
      col,
      where('userUid', '==', uid),
      orderBy('fecha', 'desc'),
      orderBy('hora')
    );

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }
}

