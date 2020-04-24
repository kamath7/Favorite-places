import * as FileSystem from "expo-file-system";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";
import { insertPlace, fetchPlaces } from "../helpers/db";
import ENV from "../env";
export const addPlace = (title, image, location) => {
  return async dispatch => {
    const response = await fetch(
      `http://www.mapquestapi.com/geocoding/v1/reverse?key=${ENV.googleApiKey}&location=${location.lat},${location.lng}`
    );
    if (!response.ok) {
      throw new Error(`Something went wrong`);
    }

    const resData = await response.json();
    console.log(resData.results);
    if (!resData.results) {
      throw new Error(`Something went wrong`);
    }
    const address =
      resData.results[0].locations[0].street +
      ", " +
      resData.results[0].locations[0].adminArea4;
    console.log(address);
    const fileName = image.split("/").pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath
      });
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );
      console.log(dbResult);
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: {
            lat: location.lat,
            lng: location.lng
          }
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      console.log(dbResult);
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (error) {
      throw err;
    }
  };
};
