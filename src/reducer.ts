// @ts-nocheck
import { Reducer } from 'react'
import type { AsyncActionHandlers } from 'use-reducer-async'
import {
    DocumentReference,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    DB3Store,
    collection,
} from 'db3.js'

export interface Todo {
    text: string
    status: boolean
    owner: string
}

export interface TodoState {
    todoList: Array<DocumentReference<Todo>>
    loading: boolean
    db: DB3Store
    collection: string
    userAddress: string
    visibility: string
}

export enum TodoActionkind {
    INSERT = 'INSERT',
    UPDATE = 'UPDATE',
    QUERY = 'QUERY',
    DELETE = 'DELETE',
}

type RefreshAction = {
    type: 'REFRESH' | 'LOADING' | 'UNLOADING'
}

export type AsyncAction = {
    collection: string
    type: string
    payload?: Todo
    old_payload?: DocumentReference<Todo>
    db: DB3Store
}

export const asyncActionHandlers: AsyncActionHandlers<
    Reducer<Todo, RefreshAction>,
    AsyncAction
> = {
    [TodoActionkind.INSERT]:
        ({ dispatch }) =>
        async (action) => {
            dispatch({
                type: 'LOADING',
            })
            const col = await collection(action.db, action.collection)
            await addDoc(col, action.payload)
            await new Promise((r) => setTimeout(r, 1100))
            return dispatch({
                db: action.db,
                collection: action.collection,
                type: TodoActionkind.QUERY,
            })
        },

    [TodoActionkind.UPDATE]:
        ({ dispatch }) =>
        async (action) => {
            dispatch({
                type: 'LOADING',
            })
            console.log(action.old_payload)
            console.log(action.payload)
            await updateDoc(action.old_payload!, action.payload)
            await new Promise((r) => setTimeout(r, 1100))
            return dispatch({
                db: action.db,
                collection: action.collection,
                type: TodoActionkind.QUERY,
            })
        },

    [TodoActionkind.DELETE]:
        ({ dispatch }) =>
        async (action) => {
            dispatch({
                type: 'LOADING',
            })
            await deleteDoc(action.old_payload!)
            await new Promise((r) => setTimeout(r, 1100))
            return dispatch({
                db: action.db,
                collection: action.collection,
                type: TodoActionkind.QUERY,
            })
        },

    [TodoActionkind.QUERY]:
        ({ dispatch }) =>
        async (action) => {
            dispatch({
                type: 'LOADING',
            })
            const col = await collection(action.db, action.collection)
            // get all docs
            const result = await getDocs(col)
            dispatch({
                type: 'UNLOADING',
            })
            return dispatch({
                collection: action.collection,
                db: action.db,
                type: 'REFRESH',
                payload: result.docs,
            })
        },
}

export function reducer(state: TodoState, action: RefreshAction) {
    const { type, payload } = action
    switch (type) {
        case 'REFRESH':
            return { ...state, todoList: payload }
        case 'LOADING':
            return { ...state, loading: true }
        case 'UNLOADING':
            return { ...state, loading: false }
        default:
            break
    }
    return state
}
