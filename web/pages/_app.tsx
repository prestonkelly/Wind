import "../styles/globals.scss"
import type { AppProps } from "next/app"
import React from "react"
import { Provider } from "react-redux"
import { useStore } from "../store"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"

export default function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store, {}, function () {
    persistor.persist()
  })

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}
