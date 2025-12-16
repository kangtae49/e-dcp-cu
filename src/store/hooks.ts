import {useDispatch, useSelector} from "react-redux";
import {type RootState, type AppDispatch, injectReducer, getSlice} from "./index";
import type {Slice} from "@reduxjs/toolkit";
import {useEffect, useMemo} from "react";
// import type {Slice} from "@reduxjs/toolkit";
// import {useEffect} from "react";

export const useAppDispatch: () => AppDispatch = useDispatch;

export function useAppSelector<T>(key: string): T | undefined {
  return useSelector((state: RootState) => (state as any)[key]);
}

export function useDynamicSlice<
  State, Actions
>(
  id: string,
  // createSliceFn: (id: string) => Slice<State>
  createSliceFn: (id: string) => Slice,
  createThunksFn?: (id: string) => any,
) {
  // const slice = getSlice(id) ?? createSliceFn(id);
  // let slice = getSlice(id);
  // if (!slice) {
  //   console.log("useDynamicSlice createSlice", id)
  //   slice = createSliceFn(id);
  //   injectReducer(id, slice)
  // }

  const slice = useMemo(() => {
    // return getSlice(id) ?? createSliceFn(id);
    let slice = getSlice(id);
    if (!slice) {
      console.log("useDynamicSlice createSlice", id)
      slice = createSliceFn(id);
      // injectReducer(id, slice)
    }
    return slice
  }, [id]);

  useEffect(() => {
    // console.log("useDynamicSlice: Injecting reducer via useEffect", id);
    injectReducer(id, slice);
  }, [id, slice]);

  // injectReducer(id, slice)
  // useEffect(() => {
  // }, [id, slice])
  // injectReducer(id, slice)
  // useEffect(() => {
  //   console.log("useDynamicSlice", id)
  //   injectReducer(id, slice.reducer)
  //   return () => {
  //     console.log("useDynamicSlice unmount", id)
  //     removeReducer(id)
  //   }
  // }, [])

  const state = useAppSelector<State>(id);
  const dispatch = useAppDispatch();
  const thunks = createThunksFn ? createThunksFn(id) : undefined;
  // const thunks =

  return {
    id,
    slice,
    actions: slice.actions as Actions,
    state,
    dispatch,
    thunks
  };
}

export function createSliceThunk(
  sliceId: string,
  fn: (
    args: any,
    helpers: {
      dispatch: AppDispatch;
      getState: () => RootState;
      sliceState: any;
    }
  ) => void
) {
  return function (args: any) {
    return (dispatch: AppDispatch, getState: () => RootState) => {
      const sliceState = getState()[sliceId];
      return fn(args, { dispatch, getState, sliceState });
    };
  };
}
