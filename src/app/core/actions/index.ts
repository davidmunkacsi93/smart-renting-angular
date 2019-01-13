import { Action } from "@ngrx/store";
import { User } from "../model/user";

export const enum ActionType {
  ADD_USER = "ADD_USER",
  CLEAR_UESR = "CLEAR_USER",
  ADD_APARTMENT = "ADD_APARTMENT"
}

export class AddUserAction implements Action {
  type = ActionType.ADD_USER;
  constructor(public payload: User) {}
}

export class ClearUserAction implements Action {
  type = ActionType.CLEAR_UESR;
}

export class AddApartmentAction implements Action {
  type = ActionType.ADD_APARTMENT;
}

export type AppActions = AddUserAction | ClearUserAction
| AddApartmentAction;
