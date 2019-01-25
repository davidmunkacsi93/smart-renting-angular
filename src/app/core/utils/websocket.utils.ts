import { Injectable } from "@angular/core";

@Injectable()
export class WebSocketUtils {

    constructor (){}

    createPaymentData(from, to, amount, username) {
        return {
            from: from,
            to: to,
            amount: amount,
            username: username
        }
    }

    createWebSocketData(from, to, username) {
        return {
            from: from,
            to: to,
            username: username
        }  
    }
}