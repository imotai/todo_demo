// @ts-nocheck
import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { useReducerAsync } from 'use-reducer-async'
import { asyncActionHandlers, reducer, Todo, TodoActionkind } from './reducer'
import { DB3BrowserWallet, initializeDB3, DocumentReference } from 'db3.js'
import './base.css'
import './index.css'

function App() {
    const mnemonic =
        'result crisp session latin must fruit genuine question prevent start coconut brave speak student dismiss'
    const wallet = DB3BrowserWallet.createNew(mnemonic, 'DB3_SECP259K1')
    const userAddress = wallet.getAddress()
    const dbAddress = '0xecc8726fd95cc10f2d9a2fc3ade5bb7c2f11bac9'
    const db = initializeDB3('http://127.0.0.1:26659', dbAddress, wallet)
    const collection = 'todos'
    const [todo, setTodo] = useState('')
    const [inited, setInited] = useState(false)
    const [state, dispatch] = useReducerAsync(
        reducer,
        { todoList: [], loading: false, editing: false },
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
    function add(e: KeyboardEvent) {
        if (e.code === 'Enter') {
            dispatch({
                type: TodoActionkind.INSERT,
                payload: {
                    id: Date.now().toString(),
                    text: todo,
                    status: false,
                    owner: userAddress,
                },
                db,
                collection,
            })
            setTodo('')
        }
    }

    function update(e: ChangeEvent, item: DocumentReference<Todo>) {
        dispatch({
            type: TodoActionkind.UPDATE,
            payload: {
                ...item.doc.doc,
                status: e.target.checked,
            },
            old_payload: item,
            db,
            collection,
        })
    }
    function remove(item: DocumentReference<Todo>) {
        dispatch({
            type: TodoActionkind.DELETE,
            payload: item.doc.doc,
            old_payload: item,
            db,
            collection,
        })
    }
    return (
        <div className=" App">
            <input
                placeholder="Pleace input todo"
                style={{ width: 300 }}
                value={todo}
                onInput={(e) => setTodo(e.currentTarget.value)}
                onKeyDown={(e) => add(e)}
            />
            <div>{state.loading ? 'loading...' : ''}</div>
            <ul className="todo-list">
                {state.todoList.map((item) => (
                    <li key={item.doc.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={item.doc.doc.status}
                                onChange={(e) => update(e, item)}
                            />{' '}
                            {item.doc.doc.text}
                        </label>
                        <a onClick={() => remove(item)}>delete</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default App
