// @ts-nocheck
//
// App.ts
// Copyright (C) 2023 db3.network Author imotai <codego.me@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import React, { useState } from 'react'
import { useAsyncFn } from 'react-use'
import { useReducerAsync } from 'use-reducer-async'
import {
    asyncActionHandlers,
    reducer,
    TodoActionkind,
    TodoState,
    Todo,
} from './reducer'
import {
    DB3BrowserWallet,
    initializeDB3,
    DocumentReference,
    EventMessage,
} from 'db3.js'
import TodoContext from './context'
import Header from './header'
import MainSection from './main_section'
import truncateEthAddress from 'truncate-eth-address'

function getWallet() {
    try {
        const wallet = DB3BrowserWallet.recover()
        return wallet
    } catch (e) {
        const wallet = DB3BrowserWallet.generate('DB3_SECP259K1')
        return wallet
    }
}

function App() {
    const wallet = getWallet()
    const userAddress = wallet.getAddress()
    const dbAddress = '0xb8f9d994a57ed99c82f3f6675553fbe832937ab8'
    const { db } = initializeDB3(
        'https://grpc.devnet.db3.network',
        dbAddress,
        wallet
    )
    const collection = 'todos'
    const [inited, setInited] = useState(false)
    const [block, setBlock] = useState(0)
    const [state, dispatch] = useReducerAsync(
        reducer,
        {
            todoList: new Array<DocumentReference<Todo>>(0),
            loading: false,
            db,
            collection,
            userAddress,
            visibility: 'All',
        },
        asyncActionHandlers
    )

    const subscription_handle = (msg: EventMessage) => {
        if (msg.event.oneofKind === 'blockEvent') {
            setBlock(msg.event.blockEvent.height)
        } else {
            try {
                if (
                    msg.event.mutationEvent.to.length == 0 &&
                    msg.event.mutationEvent.collections.length == 0
                ) {
                } else {
                    // update the data
                    dispatch({
                        db,
                        collection,
                        type: TodoActionkind.QUERY,
                        visibility: state.visibility,
                        userAddress,
                    })
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    const [ctrl, subscribe] = useAsyncFn(async () => {
        try {
            return await db.client.subscribe(subscription_handle)
        } catch (e) {
            console.log(e)
        }
    }, [db])

    if (!inited) {
        dispatch({
            db,
            collection,
            type: TodoActionkind.QUERY,
            visibility: 'All',
            userAddress,
        })
        subscribe()
        setInited(true)
    }

    const providerState = {
        state,
        dispatch,
    }

    return (
        <TodoContext.Provider value={providerState}>
            <aside className="learn">
                <header>
                    <h3>TodoMVC Dapp Information</h3>
                    <span className="source-links">
                        <h5>Database Address</h5>
                        <a>{truncateEthAddress(dbAddress)}</a>
                        <h5>Collection Name</h5>
                        <a>{collection}</a>
                    </span>
                    <h3>Account Information</h3>
                    <span className="source-links">
                        <h5>Address</h5>
                        <a>{truncateEthAddress(state.userAddress)}</a>
                    </span>
                    <h3>DB3 Network Community</h3>
                    <span className="source-links">
                        <h5>Example</h5>
                        <a href="https://github.com/dbpunk-labs/db3.js/tree/main/examples/todomvc">
                            Source
                        </a>
                        <h5>db3.js</h5>
                        <a href="https://github.com/dbpunk-labs/db3.js">
                            Source
                        </a>
                        <h5>db3 network</h5>
                        <a href="https://github.com/dbpunk-labs/db3">Source</a>
                    </span>
                </header>
                <blockquote className="quote speech-bubble">
                    DB3 Network is an open-source and decentralized firebase
                    firestore alternative for building fully decentralized dApps
                    quickly with minimal engineering effort. <p></p>
                    <footer>
                        <a href="https://github.com/dbpunk-labs/db3">
                            DB3 Network
                        </a>
                    </footer>
                </blockquote>
            </aside>
            <div className="todoapp">
                <Header />
                <MainSection />
            </div>
            <footer className="info">
                <p>block:{block}</p>
            </footer>
        </TodoContext.Provider>
    )
}
export default App
