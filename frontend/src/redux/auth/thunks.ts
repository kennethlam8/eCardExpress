import { createAsyncThunk } from "@reduxjs/toolkit";

const checkUserEmail: any = createAsyncThunk('checkUserEmail', async (params: { email: string }, thunkApi) => {
    console.log("check email ",process.env.REACT_NATIVE_APP_HOSTING )
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'checkEmail', {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.message)
})

const checkUserPassword: any = createAsyncThunk('checkUserPassword', async (params: { email: string, password: string }, thunkApi) => {
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'login', {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    if (data.error) {
        // console.log(data.error)
        return thunkApi.rejectWithValue(data.error)
    }
    return thunkApi.rejectWithValue(data.message)
})

const userRegister: any = createAsyncThunk('userRegister', async (params: { email: string, password: string, firstName: string, lastName:string}, thunkApi) => {
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + 'user', {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.message)
})

const emailVerify: any = createAsyncThunk('emailVerify', async (params: { email: string, token: string}, thunkApi) => {
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `confirmation/${params.email}/t/${params.token}`)
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.error)
})

const resendEmail: any = createAsyncThunk('resendEmail', async (params: { email: string, token: string}, thunkApi) => {
    const res = await fetch(process.env.REACT_NATIVE_APP_HOSTING + `resend-email`)
    const data = await res.json()
    if (res.ok) {
        return thunkApi.fulfillWithValue(data.data)
    }
    return thunkApi.rejectWithValue(data.message)
})

export { checkUserEmail, checkUserPassword, userRegister, emailVerify, resendEmail}
