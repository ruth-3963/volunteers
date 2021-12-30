import React from "react";
import { Redirect, Route,useHistory } from "react-router-dom";

function ProtectedRoute ({ children, ...rest }) {
    const history = useHistory();
    return (
      <Route {...rest} render={() => {
        return rest.computedMatch.params.id == JSON.parse(localStorage.getItem("group")).id
          ? children
          :history.goBack()
      }} />
    )
  }

export default ProtectedRoute;
