import { Component, type ReactNode } from "react";

type State = {
  shouldThrow: boolean;
};

class ErrorTestButton extends Component<object, State> {
  state: State = {
    shouldThrow: false,
  };

  render(): ReactNode {
    if (this.state.shouldThrow) {
      throw new Error("Intentional rendering error");
    }

    return (
      <button
        className="error-test-button"
        type="button"
        onClick={() => {
          this.setState({ shouldThrow: true });
        }}
      >
        Test error boundary
      </button>
    );
  }
}

export default ErrorTestButton;
