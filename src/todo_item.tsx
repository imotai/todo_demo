//
// todo_item.ts
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

import React, { Component } from 'react'
import classnames from 'classnames'
import TodoTextInput from './todo_input'
import { TodoActionkind } from './reducer'
export default class TodoItem extends Component {
    state = {
        editing: false,
    }

    handleDoubleClick = () => {
        this.setState({ editing: true })
    }

    completeTodo = (context) => {
        context.dispatch({
            type: TodoActionkind.UPDATE,
            payload: {
                ...context.todo.doc.doc,
                status: true,
            },
            old_payload: context.todo,
            db: context.db,
            collection: context.collection,
        })
    }

    deleteTodo = (context) => {
        context.dispatch({
            type: TodoActionkind.DELETE,
            payload: context.todo.doc.doc,
            old_payload: context.todo,
            db: context.db,
            collection: context.collection,
        })
    }

    handleSave = (context, text) => {
        if (text.length === 0) {
            context.dispatch({
                type: TodoActionkind.DELETE,
                payload: context.todo.doc.doc,
                old_payload: context.todo,
                db: context.db,
                collection: context.collection,
            })
        } else {
            context.dispatch({
                type: TodoActionkind.UPDATE,
                payload: {
                    ...context.todo.doc.doc,
                    text: text,
                },
                old_payload: context.todo,
                db: context.db,
                collection: context.collection,
            })
        }
        this.setState({ editing: false })
    }

    render() {
        const { context } = this.props
        let element
        if (this.state.editing) {
            element = (
                <TodoTextInput
                    text={context.todo.doc.doc.text}
                    editing={this.state.editing}
                    onSave={(text) => this.handleSave(context, text)}
                />
            )
        } else {
            element = (
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={context.todo.doc.doc.status}
                        onChange={() => this.completeTodo(context)}
                    />
                    <label onDoubleClick={this.handleDoubleClick}>
                        {context.todo.doc.doc.text}
                    </label>
                    <button
                        className="destroy"
                        onClick={() => this.deleteTodo(context)}
                    />
                </div>
            )
        }

        return (
            <li
                className={classnames({
                    completed: context.todo.doc.doc.status,
                    editing: this.state.editing,
                })}
            >
                {element}
            </li>
        )
    }
}
