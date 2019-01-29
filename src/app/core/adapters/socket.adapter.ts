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
import { Web3Utils } from "../utils/web3.utils";

@Injectable()
export class SocketAdapter extends ChatAdapter {
  constructor(
    @Inject(WebSocketProvider) private socket: any,
    private userContract: UserContract
  ) {
    super();
    this.InitializeSocketListerners();
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return from(this.userContract.getUsers()).pipe(
      map(users => {
        return users
          .filter(user => user !== null)
          .map(user => {
            if (user == null) return null;
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
            return response;
          });
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
