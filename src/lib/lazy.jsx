import { lazy, Suspense } from "react";
function lazyClient(load) {
  const Inner = lazy(load);
  return function LazyClient(props) {
    return <Suspense fallback={null}>
        <Inner {...props} />
      </Suspense>;
  };
}
export {
  lazyClient
};
