import { useState, useEffect } from "react";

export default function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
            width: 0,
            height: 0,
        });

        useEffect(() => {
            const handleResize = () => {
            setWindowSize({
                width: document.documentElement.clientWidth,
                height: window.innerHeight,
            });
            };

            // Set initial size
            handleResize();

            // Add event listener
            window.addEventListener("resize", handleResize);

            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return windowSize;
    }