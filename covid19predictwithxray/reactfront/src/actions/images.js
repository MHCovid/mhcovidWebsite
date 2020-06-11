import axios from "axios";

import { UPLOAD_IMAGE, PREDICT_SCORE } from "./types";

// UPLOAD IMAGE

export const uploadImage = (form_data) => (dispatch) => {
  axios
    .post("/api/images/", form_data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch({
        type: UPLOAD_IMAGE,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// PREDICT SCORE

export const predictScore = (image_id) => (dispatch) => {
  axios
    .get(`/api/images/${image_id}/`)
    .then((res) => {
      dispatch({
        type: PREDICT_SCORE,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
