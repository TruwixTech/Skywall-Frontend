import { useEffect, useRef } from "react";

export function GoogleAnalytics({ trackingId }) {
    const loaded = useRef(false);

    useEffect(() => {
        if (loaded.current || window.gtag) return;

        const script = document.createElement("script");
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", trackingId, { debug_mode: true });

        loaded.current = true;
    }, [trackingId]);

    return null;
}


export const trackEvent = (action, category, label, value) => {
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value,
        });
    }
};
