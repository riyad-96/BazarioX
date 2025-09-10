import UniContexts from "./UniContexts";
import FunctionContexts from './FunctionContexts';

function ContextProvider({ children }) {
  return (
    <UniContexts>
      <FunctionContexts>
        {children}
      </FunctionContexts>
    </UniContexts>
  )
};

export default ContextProvider;