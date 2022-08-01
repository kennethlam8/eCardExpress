import { createAsyncThunk } from "@reduxjs/toolkit";

const getMyInfo: any = createAsyncThunk('getMyInfo', async (params: { email: string, isLoggedIn: string | boolean }, thunkApi) => {
    // console.log({ params })
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'me', {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    const data = await res.json()
    console.log("getMyInfo data: ", data)
    if (res.ok) {
        console.log("Get me from server")
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.error) //data.message
})

const logOut: any = createAsyncThunk('logOut', async (params: any, thunkApi) => {
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'logout', {
        method: "POST",
    })
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.message)
    }
    return thunkApi.rejectWithValue(data.message)
})


const updateCardStyle: any = createAsyncThunk('updateCardStyle', async (params: any, thunkApi) => {
    // console.log(params)
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'update-card-style', {
        method: "PATCH",
        body: params
    })
    const data = await res.json()
    console.log({ data })
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.message)
})


const createUserProfile: any = createAsyncThunk('createUserProfile', async (params: any, thunkApi) => {
    // console.log(params)
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'userProfile', {
        method: "POST",
        headers: {
            //'Accept': 'application/json',
            'Content-Type': 'multipart/form-data;'
        },
        body: params
    })
    const data = await res.json()
    // console.log(data )
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.message)
})

const updateUserProfile: any = createAsyncThunk('createUserProfile', async (params: any, thunkApi) => {
    // console.log(params)
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'userProfile', {
        method: "PATCH",
        headers: {
            //'Accept': 'application/json',
            'Content-Type': 'multipart/form-data;'
        },
        body: params
    })
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.message)
})



export { getMyInfo, updateCardStyle, logOut, createUserProfile, updateUserProfile }

