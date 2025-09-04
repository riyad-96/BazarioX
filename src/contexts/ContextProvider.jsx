import UniContexts from "./UniContexts";

function ContextProvider({ children }) {
  return (
    <UniContexts>
      {children}
    </UniContexts>
  )
};

export default ContextProvider;