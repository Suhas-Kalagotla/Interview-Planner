import { Alert } from "@mantine/core";
import React from "react";

class ErrorBoundary extends React.Component {
    
    constructor(props : any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error : any) {
      console.log(error);
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error : any, errorInfo : any) {
      // You can also log the error to an error reporting service
      console.info(error, errorInfo);
    }
  
    render() {
      if ((this.state as any).hasError) {
        // You can render any custom fallback UI
        return <Alert color="red" variant="light">Something went wrong..</Alert>;
      }
  
      return (this.props as any).children; 
    }
  }

  export default ErrorBoundary;