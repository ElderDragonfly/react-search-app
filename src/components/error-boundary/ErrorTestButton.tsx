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
        type="button"
        onClick={() => {
          // Здесь измени shouldThrow на true через this.setState(...)
        }}
      >
        Test error boundary
      </button>
    );
  }
}

export default ErrorTestButton;