import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useReducerAsync } from 'use-reducer-async';
import { asyncActionHandlers, reducer, Todo, TodoActionkind } from './reducer';
import './style.css';

function App() {
  const [todo, setTodo] = useState('');
  const [state, dispatch] = useReducerAsync(
    reducer,
    { todoList: [], loading: false },
    asyncActionHandlers
  );
  function add(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      dispatch({
        type: TodoActionkind.INSERT,
        payload: {
          id: Date.now().toString(),
          name: todo,
          status: false,
        },
      });
      setTodo('');
    }
  }
  function update(e: ChangeEvent, item: Todo) {
    dispatch({
      type: TodoActionkind.UPDATE,
      payload: {
        ...item,
        status: e.target.checked,
      },
    });
  }
  function remove(item: Todo) {
    dispatch({
      type: TodoActionkind.DELETE,
      payload: item,
    });
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
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.status}
                onChange={(e) => update(e, item)}
              />{' '}
              {item.name}
            </label>

            <a onClick={() => remove(item)}>delete</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
