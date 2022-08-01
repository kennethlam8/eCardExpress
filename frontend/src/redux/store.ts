import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/reducers";
import cardSearchReducer from "./cardSearch/reducers";
import { allCardReducer, cardDetailReducer, cardRequestReducer } from "./card/reducer";
import eventReducer from "./event/reducers";
import userInfoReducer from "./userInfo/reducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    userInfo: userInfoReducer,
    card: cardRequestReducer,
    cardInfo: cardSearchReducer,
    userAllCard: allCardReducer,
    cardDetail: cardDetailReducer,
  },
})

export default store