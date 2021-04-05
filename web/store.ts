import { useMemo } from "react"
import { createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
// import storage from 'redux-persist/lib/storage'
import storage from "./storage"
import { persistReducer } from "redux-persist"
import thunkMiddleware from "redux-thunk"

let store: any

interface initialState {
  posts: any
  user: object
}

const initialState: initialState = {
  posts: [],
  user: {},
}

export const actionTypes = {
  LIKE_POST: "LIKE_POST",
  UNLIKE_POST: "UNLIKE_POST",
  SET_USER: "SET_USER",
  LIGHT_MODE: "LIGHT_MODE",
  DARK_MODE: "DARK_MODE",
  SET_POSTS: "SET_POSTS",
  UPDATE_POST_MESSAGE: "UPDATE_POST_MESSAGE",
  DELETE_POST: "DELETE_POST",
  UPDATE_USER: "UPDATE_USER",
  AUTHORIZED: "AUTHORIZED",
}

// @ts-ignore
export function posts(state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.SET_POSTS:
      return {
        ...state,
        posts: action.payload ? [...action.payload] : null,
        postsLikeCounters: !action.payload
          ? null
          : [...action.payload].reduce((out: any, post: any) => {
              return {
                ...out,
                [post.ID]: post.Likes,
              }
            }, {}),
      }
    case actionTypes.UPDATE_POST_MESSAGE:
      const updatePostIndex = state.posts.findIndex(
        (post: any) => post.ID === action.payload.ID
      )
      const updatedArray = [...state.posts]
      updatedArray[updatePostIndex].Message = action.payload.Message
      return {
        ...state,
        posts: updatedArray,
      }
    case actionTypes.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post: any) => post.ID !== action.payload),
      }
    default:
      return state
  }
}

export function postsLikes(state = {}, action: any) {
  switch (action.type) {
    case actionTypes.LIKE_POST:
      return {
        ...state,
        [action.post.ID]: true,
      }
    case actionTypes.UNLIKE_POST:
      return {
        ...state,
        [action.post.ID]: false,
      }
    default:
      return state
  }
}

export function postsLikeCounters(state = {}, action: any) {
  let value

  switch (action.type) {
    case actionTypes.LIKE_POST:
      value = state[action.post.ID] || 0

      return {
        ...state,
        [action.post.ID]: value + 1,
      }
    case actionTypes.UNLIKE_POST:
      value = state[action.post.ID] || 0

      return {
        ...state,
        [action.post.ID]: Math.max(value - 1, 0),
      }
    default:
      return state
  }
}

// @ts-ignore
export const userInfo = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.LIGHT_MODE:
      return {
        ...state,
        light: true,
      }
    case actionTypes.DARK_MODE:
      return {
        ...state,
        light: false,
      }
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      }
    case actionTypes.AUTHORIZED:
      return {
        ...state,
        authorized: action.payload,
      }
    case actionTypes.UPDATE_USER:
      let updatedUserArray = state.user
      if (!action.payload["filepath"]) {
        updatedUserArray["Username"] = action.payload["Username"]
        updatedUserArray["ScreenName"] = action.payload["ScreenName"]
        updatedUserArray["Email"] = action.payload["Email"]
      } else {
        updatedUserArray["ProfilePhoto"] = action.payload["filepath"]
      }
      return {
        ...state,
        user: updatedUserArray,
      }
    default:
      return state
  }
}

// Now we're combining all reducers into a single rootReducer
export const rootReducer = combineReducers({
  userInfo,
  posts,
  postsLikes,
  postsLikeCounters,
})

const persistConfig = {
  key: "primary",
  storage,
  // What items to persist
  whitelist: ["userInfo", "posts", "postsLikes", "postsLikeCounters"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

function makeStore(preloadedState: any) {
  return createStore(
    persistedReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}

export const initializeStore = (preloadedState: any) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
