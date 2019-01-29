import {
  ChatAdapter,
  User,
  Message,
  ChatParticipantType,
  ChatParticipantStatus,
  ParticipantResponse,
  ParticipantMetadata
} from "ng-chat";
import { Observable, of, from } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Socket } from "socket.io";
import { Http, Response } from "@angular/http";
import { WebSocketProvider } from "../providers/websocket.provider";
import { Inject, Injectable } from "@angular/core";
import { UserContract } from "../contracts/user.contract";

@Injectable()
export class SocketAdapter extends ChatAdapter {
  private userId: string;

  constructor(private socket: any, private userContract: UserContract) {
    super();
    this.InitializeSocketListerners();
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return from(this.userContract.getUsers()).pipe(
      map(users => {
        var result: ParticipantResponse[] = [];
        users.forEach(user => {
          var us: User = {
            id: user.Address,
            participantType: ChatParticipantType.User,
            avatar: undefined,
            displayName: user.Username,
            status: ChatParticipantStatus.Online
          };
          var metadata: ParticipantMetadata = {
            totalUnreadMessages: 0
          };
          var response: ParticipantResponse = {
            participant: us,
            metadata: metadata
          };
          result.push(response);
        });
        return result;
      })
    );
  }

  getMessageHistory(userId: any): Observable<Message[]> {
    return of([]);
  }

  sendMessage(message: Message): void {
    this.socket.emit("sendMessage", message);
  }

  public InitializeSocketListerners(): void {
    this.socket.on("messageReceived", messageWrapper => {
      this.onMessageReceived(messageWrapper.user, messageWrapper.message);
    });

    this.socket.on("friendListChanged", data => {
      console.log("Friend list changed");
    });
  }
}
