import { Injectable, InjectionToken } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export const WebSocketProvider = new InjectionToken<any>('webSocketProvider', {
    providedIn: 'root',
    factory: () => {
      return io(environment.wsUrl)
    }
  });