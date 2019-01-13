import { User } from "../model/user";
import { Apartment } from "../model/apartment";

export interface AppState {
  readonly user: User;
  readonly apartments: Apartment[];
}
