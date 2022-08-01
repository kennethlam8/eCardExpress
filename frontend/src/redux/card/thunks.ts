import { createAsyncThunk } from "@reduxjs/toolkit";


const getAllCard: any = createAsyncThunk('getAllCard', async (params: any, thunkApi) => {
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `cards`)
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.message)
})

const getCardByID: any = createAsyncThunk('getCardByID', async (params: string, thunkApi) => {
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `cards/` + params)
    const data = await res.json()
    console.log(data.data)
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.message)
})

export { getAllCard, getCardByID }