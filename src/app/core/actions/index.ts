import { Action } from "@ngrx/store";
import { User } from "../model/user";

export const enum ActionType {
  ADD_USER = "ADD_USER",
  CLEAR_USER = "CLEAR_USER",
  ADD_APARTMENT = "ADD_APARTMENT",
  REFRESH_BALANCE = "REFRESH_BALANCE"
}

export class AddUserAction implements Action {
  type = ActionType.ADD_USER;
  constructor(public payload: User) {}
}

export class ClearUserAction implements Action {
  type = ActionType.CLEAR_USER;
}

export class RefreshBalanceAction implements Action {
  type = ActionType.REFRESH_BALANCE;
  constructor(public payload: { balanceInEth: number, balanceInEur: number }) {}
}

export class AddApartmentAction implements Action {
  type = ActionType.ADD_APARTMENT;
}

export type AppActions = AddUserAction | ClearUserAction
| AddApartmentAction | RefreshBalanceAction;
