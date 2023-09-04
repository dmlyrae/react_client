import { Error } from "src/pages/error";
import { Component, ErrorInfo } from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode
}

// type ReactInstance = Component<any> | Element;

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props:ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error:Error) {
    return { hasError: true, error: error?.message ?? "Unknown Error" };
  }

  componentDidCatch(error:Error, errorInfo:ErrorInfo) {
    console.log(error,errorInfo)
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
        return (
            <Error 
                errorMessage={"Error"}
            />
        )
    }

    return children;
  }
}

export default ErrorBoundary;