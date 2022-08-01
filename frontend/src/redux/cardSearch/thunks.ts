import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchCards: any = createAsyncThunk("fetchCards", async (params:{ index: number, keyword: string, searchBy: string }, thunkApi) => {

    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'myCards', {
        method: 'POST',
         headers: {
             'Content-type': 'application/json',
         },
         body: JSON.stringify(params)
     })
     if (res.status.toString().startsWith("5")) {
        console.log("Internal request accept error")        
    }
    const data = await res.json()
    

    //console.log("card fetch data get: ", data);
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }

    return thunkApi.rejectWithValue("Fail fetch card" + data.message)

})

const fetchPublicCards: any = createAsyncThunk("fetchPublicCards", async (params:{ index: number, keyword: string, searchBy: string }, thunkApi) => {

    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'publicCards', {
       method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    if (res.status.toString().startsWith("5")) {
        console.log("Internal request accept error")        
    }
    const data = await res.json()

    //console.log("card fetch data get: ", data);
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }

    return thunkApi.rejectWithValue("Fail fetch card " + data.data)

})

const fetchCardsById: any = createAsyncThunk("fetchCardsById", async (params: { cardId: string }, thunkApi) => {

    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `cards/${params.cardId}`)
    const data = await res.json()
    console.log('fetchCardById thunk data', data);
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }

    return thunkApi.rejectWithValue("Fail fetch card by id" + data.message)

})


export { fetchCards, fetchPublicCards, fetchCardsById }