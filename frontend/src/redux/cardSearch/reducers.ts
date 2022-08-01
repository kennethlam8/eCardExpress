import { createReducer } from "@reduxjs/toolkit";
import { CardState, CardInfo } from "./state";
import { fetchCards, fetchCardsById, fetchPublicCards} from "./thunks";

const initialState: CardState = {
    cards: []
}

const cardSearchReducer = createReducer(initialState, (build) => {
    build.addCase(fetchCards.fulfilled, (state, action) => {
        state.cards = action.payload
        //console.log('card reducer state.cards:', state.cards);
    })
    build.addCase(fetchCards.rejected, (state, action) => {
        console.log('rejected - fetchCards Thunk action.payload :', action.payload)
    })
    build.addCase(fetchPublicCards.fulfilled, (state, action) => {
        state.cards = action.payload
        //console.log('card reducer state.cards:', state.cards);
    })
    build.addCase(fetchPublicCards.rejected, (state, action) => {
        console.log('rejected - fetchCards Thunk action.payload :', action.payload)
    })
    build.addCase(fetchCardsById.fulfilled, (state, action) => {
        state.cards = action.payload
        console.log('fetchCardById Thunk action.payload :', action.payload)
    })
    build.addCase(fetchCardsById.rejected, (state, action) => {
        console.log('rejected - fetchCardById Thunk action.payload :', action.payload)
    })
})

export default cardSearchReducer