import {
  configureStore,
  combineReducers,
  type Slice,
} from "@reduxjs/toolkit"
import {devToolsEnhancer} from "@redux-devtools/remote";

// const staticReducers = {} as Record<string, Reducer>
// const asyncReducers = {} as Record<string, Reducer>
// const staticSlices = {} as Record<string, Slice>
const asyncSlices = {} as Record<string, Slice>

function slicesToReducers(slices: Record<string, Slice>) {
  return Object.fromEntries(
    Object.entries(slices).map(([key, slice]) => [key, slice.reducer])
  );
}

function createReducer() {
  // if (Object.keys(staticSlices).length === 0 && Object.keys(asyncSlices).length === 0) {
  //   return (state = {}) => state
  // }
  if (Object.keys(asyncSlices).length === 0) {
    return (state = {}) => state
  }
  return combineReducers({
    // ...slicesToReducers(staticSlices),
    ...slicesToReducers(asyncSlices),
  })
}

const args = window.api.getArgs();
const env = await window.api.getEnv();
console.log(env)
const isVerbose = args.includes('--verbose');
const port = parseInt(env.DEV_PORT ?? '8000', 10);
console.log('DEV_PORT', port)
export const store = configureStore({
  reducer: createReducer(),
  devTools: false,
  enhancers: (getDefaultEnhancers) => {
    const enhancers = getDefaultEnhancers();
    if (isVerbose) {
      return enhancers.concat(devToolsEnhancer({
        name: "DcpCu",
        realtime: true,
        trace: true,
        maxAge: 1000,
        hostname: "localhost",
        port: port
      }));
    }

    return enhancers;
  }
  // enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(devToolsEnhancer({
  //   name: "DcpCu",
  //   realtime: true,
  //   trace: true,
  //   maxAge: 1000,
  //   hostname: "localhost",
  //   port: 8001
  // }))
})

export function injectReducer(key: string, slice: Slice) { //reducer: Reducer) {
  if (asyncSlices[key]) return
  console.log("injectReducer", key)
  asyncSlices[key] = slice
  const reducer = createReducer()
  store.replaceReducer(reducer)
}

export function getSlice (key: string): Slice  {
  return asyncSlices[key]
}

export function getActions<T>(key: string): T {
  return asyncSlices[key].actions as unknown as T
}

export function removeReducer(key: string) {
  if (!asyncSlices[key]) return
  delete asyncSlices[key]
  store.replaceReducer(createReducer())
}

// export function useInjectReducer(
//   key: string,
//   reducer: Reducer,
//   removeOnUnmount = true
// ) {
//   useEffect(() => {
//     injectReducer(key, reducer)
//     return () => {
//       if (removeOnUnmount) {
//         removeReducer(key)
//       }
//     }
//   }, [key, reducer])
// }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

