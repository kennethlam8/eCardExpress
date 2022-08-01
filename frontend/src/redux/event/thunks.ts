import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchEvents: any = createAsyncThunk("fetchEvents", async (params, thunkApi) => {

    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'events')
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }

    return thunkApi.rejectWithValue("Fail fetch event" + data.message)

})

const fetchEventById: any = createAsyncThunk("fetchEventById", async (params: { eventId: number }, thunkApi) => {

    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'events/:id')
    const data = await res.json()
    console.log('fetchEventById thunk data', data);
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }

    return thunkApi.rejectWithValue("Fail fetch event by id" + data.message)

})


export { fetchEvents, fetchEventById }