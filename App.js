import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import PlacesNavigator from "./navigation/PlacesNavigator";
import placesReducer from "./store/places-reducer";
import {init} from './helpers/db';

init().then(()=>{
  console.log(`DB initialised`)
}).catch((err)=>{
  console.log(`DB connection failed. ${err}`)
});
const rootReducer = combineReducers({
  places: placesReducer
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <PlacesNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center"
  }
});
