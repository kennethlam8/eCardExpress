import { createReducer } from "@reduxjs/toolkit";
import { EventInfo, IEventState } from "./state";
import { fetchEventById, fetchEvents } from "./thunks";

// const initialState: EventInfo = {
//     name: "",
//     status: "Preparing",
//     organiser: "",
//     start_date: "",
//     start_time: "",
//     end_time: "",
//     event_address: "",
//     estimated_participant: 0,
//     banner_image: "",
//     invitation_code: "",
//     location: "",
//     description: "",
//     host_id: 0,
//     image: "",
//     group_name: ""
// }
const initialState: IEventState = {
    events: []
}

const eventReducer = createReducer(initialState, (build) => {
    build.addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload
        // console.log('event reducer state.event:', state.events);

        // console.log('event reducer state name :', state.name)
    })
    build.addCase(fetchEvents.rejected, (state, action) => {
        console.log('rejected - fetchEvents Thunk action.payload :', action.payload)
    })
    build.addCase(fetchEventById.fulfilled, (state, action) => {
        state.events = action.payload
        // console.log('fetchEventById Thunk action.payload :', action.payload)
    })
    build.addCase(fetchEventById.rejected, (state, action) => {
        console.log('rejected - fetchEventById Thunk action.payload :', action.payload)
    })
})

export default eventReducer