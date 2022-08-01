import { createAction } from '@reduxjs/toolkit'

const createCard = createAction<{
    firstName: string
    lastName: string
    email: string
}>('todoItems/count/update')




export { createCard}