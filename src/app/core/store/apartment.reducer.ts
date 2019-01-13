import { Apartment } from "../model/apartment";
import { AppActions, ActionType, AddApartmentAction } from "../actions";

export function apartmentReducer(state: Apartment, action: AppActions) {
    switch (action.type) {
        case ActionType.ADD_APARTMENT:
            const addApartmentAction: AddApartmentAction = action as AddApartmentAction;
            return {
                ...state
            }
        default:
            return state;
    }
}
