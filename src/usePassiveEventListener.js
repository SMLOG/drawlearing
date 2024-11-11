// usePassiveEventListener.js
import { useEffect, useRef } from 'react';

const usePassiveEventListener = (eventName, handler) => {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            element.addEventListener(eventName, handler, { passive: true });

            return () => {
                element.removeEventListener(eventName, handler);
            };
        }
    }, [eventName, handler]);

    return ref;
};

export default usePassiveEventListener;
