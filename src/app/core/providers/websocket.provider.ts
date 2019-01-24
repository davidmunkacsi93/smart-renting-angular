import { Injectable, InjectionToken } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../model/user';

const CURRENT_USER_KEY = "currentUser";

export const WebSocketProvider = new InjectionToken<any>('webSocketProvider', {
    providedIn: 'root',
    factory: () => {
      var userJSON = sessionStorage.getItem(CURRENT_USER_KEY);
      if (userJSON === null) 
        return io(environment.wsUrl);
      var currentUser : User = JSON.parse(userJSON);
      return io(environment.wsUrl + "?address=" + currentUser.Address);
    }
  });