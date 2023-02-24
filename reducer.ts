import { Reducer } from 'react';
import type { AsyncActionHandlers } from 'use-reducer-async';
// import { addDoc, updateDoc, deleteDoc, getDocs } from "db3.js";

export interface Todo {
  id?: string;
  name: string;
  status: boolean;
}

export enum TodoActionkind {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  QUERY = 'QUERY',
  DELETE = 'DELETE',
}

type RefreshAction = {
  type: 'REFRESH' | 'LOADING' | 'UNLOADING';
  payload: Todo[];
};
type AsyncAction = { type: string; payload?: Todo };

interface State {
  todoList: Todo[];
  loading: boolean;
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
      });
      // await addDoc(action.payload);
      await new Promise((r) => setTimeout(r, 1500));
      return dispatch({
        type: TodoActionkind.QUERY,
      });
    },
  [TodoActionkind.UPDATE]:
    ({ dispatch }) =>
    async (action) => {
      dispatch({
        type: 'LOADING',
      });
      // await updateDoc(action.payload);
      await new Promise((r) => setTimeout(r, 1500));
      return dispatch({
        type: TodoActionkind.QUERY,
      });
    },
  [TodoActionkind.DELETE]:
    ({ dispatch }) =>
    async (action) => {
      dispatch({
        type: 'LOADING',
      });
      // await deleteDoc(action.payload);
      await new Promise((r) => setTimeout(r, 1500));
      return dispatch({
        type: TodoActionkind.QUERY,
      });
    },
  [TodoActionkind.QUERY]:
    ({ dispatch }) =>
    async (action) => {
      dispatch({
        type: 'LOADING',
      });
      // const docs = await getDocs(action.payload);
      dispatch({
        type: 'UNLOADING',
      });
      const docs = [];
      return dispatch({
        type: 'REFRESH',
        payload: docs,
      });
    },
};
export function reducer(state: State, action: RefreshAction) {
  const { type, payload } = action;
  switch (type) {
    case 'REFRESH':
      return { ...state, todoList: payload };
    case 'LOADING':
      return { ...state, loading: true };
    case 'UNLOADING':
      return { ...state, loading: false };
    default:
      break;
  }
  return state;
}
