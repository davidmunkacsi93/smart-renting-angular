import { ChatAdapter, User, Message, ChatParticipantType, ChatParticipantStatus, ParticipantResponse, ParticipantMetadata } from 'ng-chat';
import { Observable, of } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { Http, Response } from '@angular/http';
import { WebSocketProvider } from '../providers/websocket.provider';
import { Inject, Injectable } from '@angular/core';
import { UserContract } from '../contracts/user.contract';

@Injectable()
export class SocketAdapter extends ChatAdapter
{
    private userId: string;
    private participants: ParticipantResponse[]

    constructor(   
        private socket : any,
        private participantArray: ParticipantResponse[]
    ) {
        super();
        this.participants = participantArray;
        console.log(this.participants);
        this.InitializeSocketListerners(); 
    }

    listFriends(): Observable<ParticipantResponse[]> {
        return of(this.participants);
    }

    getMessageHistory(userId: any): Observable<Message[]> {
        return of([]);
    }
    
    sendMessage(message: Message): void {
        this.socket.emit("sendMessage", message);
    }

    public InitializeSocketListerners(): void
    {
      this.socket.on("messageReceived", (messageWrapper) => {
        this.onMessageReceived(messageWrapper.user, messageWrapper.message);
      });

      this.socket.on("friendListChanged", data => {
        console.log("Friend list changed");
      });
    }
}