import React from "react";
import { Button } from "react-bootstrap";
export const Fallback = ({error, resetErrorBoundary}) => {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <Button variant="outline-secondary" onClick={resetErrorBoundary}>Try again</Button>
      </div>
    )
  }