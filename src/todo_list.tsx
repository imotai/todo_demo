//
// todo_list.tsx
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
import TodoItem from './todo_item'
import { useStore } from 'laco-react'
import { TodoStore, getFilteredTodos } from '../stores/todo'
import { useReducerAsync } from 'use-reducer-async'
import { asyncActionHandlers, reducer, Todo, TodoActionkind } from './reducer'
import { DB3BrowserWallet, initializeDB3, DocumentReference } from 'db3.js'

const TodoList = () => {
    const mnemonic =
        'result crisp session latin must fruit genuine question prevent start coconut brave speak student dismiss'
    const wallet = DB3BrowserWallet.createNew(mnemonic, 'DB3_SECP259K1')
    const userAddress = wallet.getAddress()
    const dbAddress = '0xecc8726fd95cc10f2d9a2fc3ade5bb7c2f11bac9'
    const db = initializeDB3('http://127.0.0.1:26659', dbAddress, wallet)
    const collection = 'todos'
    const [inited, setInited] = useState(false)
    const [state, dispatch] = useReducerAsync(
        reducer,
        { todoList: [], loading: false },
        asyncActionHandlers
    )
    return (
        <ul className="todo-list">
            {state.todoList.map((todo) => (
                <TodoItem
                    todo={todo}
                    dispatch={dispatch}
                    db={db}
                    collection={collection}
                />
            ))}
        </ul>
    )
}

export default TodoList
