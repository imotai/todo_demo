// @ts-nocheck
import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { useReducerAsync } from 'use-reducer-async'
import { asyncActionHandlers, reducer, TodoActionkind } from './reducer'
import { DB3BrowserWallet, initializeDB3, DocumentReference } from 'db3.js'
import TodoContext from './context'
import Header from './header'
import MainSection from './main_section'

function App() {
    const mnemonic =
        'result crisp session latin must fruit genuine question prevent start coconut brave speak student dismiss'
    const wallet = DB3BrowserWallet.createNew(mnemonic, 'DB3_SECP259K1')
    const userAddress = wallet.getAddress()
    const dbAddress = '0xd9a7b49ea4bbff268f13a0420f520647e2da587f'
    const db = initializeDB3('http://127.0.0.1:26659', dbAddress, wallet)
    const collection = 'todos'
    const [inited, setInited] = useState(false)
    const [state, dispatch] = useReducerAsync(
        reducer,
        {
            todoList: [],
            loading: false,
            db,
            collection,
            userAddress,
            visibilityFilter: 'All',
        },
        asyncActionHandlers
    )
    if (!inited) {
        dispatch({
            db,
            collection,
            type: TodoActionkind.QUERY,
        })
        setInited(true)
    }

    const providerState = {
        state,
        dispatch,
    }
    return (
        <TodoContext.Provider value={providerState}>
            <div className=" App">
                <Header />
                <MainSection />
            </div>
        </TodoContext.Provider>
    )
}
export default App
