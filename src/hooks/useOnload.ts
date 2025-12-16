import { useEffect, useRef, useState } from "react";

type OnLoadHandler = () => void | Promise<void>;
type OnUnloadHandler = () => void | Promise<void>;

function useOnload() {
  const [ready, setReady] = useState(false);
  const onLoadHandler = useRef<OnLoadHandler>(null);
  const onUnloadHandler = useRef<OnUnloadHandler>(null);

  useEffect(() => {
    let active = false;

    const onMount = async () => {
      await Promise.resolve();
      active = true;
      setReady(true);
    };

    onMount().then();

    return () => {
      if (active && onUnloadHandler.current) {
        Promise.resolve(onUnloadHandler.current()).catch(err =>
          console.error("onUnload error:", err)
        );
      }
    };
  }, []);

  useEffect(() => {
    if (ready && onLoadHandler.current) {
      Promise.resolve(onLoadHandler.current()).catch(err =>
        console.error("onLoad error:", err)
      );
    }
  }, [ready]);

  const onLoad = (fn: OnLoadHandler) => {
    onLoadHandler.current = fn;
  };
  const onUnload = (fn: OnUnloadHandler) => {
    onUnloadHandler.current = fn;
  };

  const useReadyEffect = (effect: () => void | (() => void), deps: unknown[] = []) => {
    useEffect(() => {
      if (!ready) return;
      return effect();

    }, [ready, ...deps]);
  };

  return { onLoad, onUnload, ready, useReadyEffect };
}

export default useOnload;
