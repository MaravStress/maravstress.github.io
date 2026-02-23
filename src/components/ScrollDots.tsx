import React, { useState, useRef } from 'react';
import { useLenis } from 'lenis/react';
import '../style/ScrollDots.css';

interface ScrollDotsProps {
    points: number[];
}

const ScrollDots: React.FC<ScrollDotsProps> = ({ points }) => {
    const [activePoint, setActivePoint] = useState(0);
    const isSnapping = useRef(false);
    const scrollTimeout = useRef<number | null>(null);

    const lenis = useLenis((lenisInstance) => {
        const limit = lenisInstance.limit;
        const scroll = lenisInstance.scroll;
        const velocity = Math.abs(lenisInstance.velocity);

        if (limit <= 0) return;

        const currentFraction = scroll / limit;

        // Find nearest point
        let nearestIdx = 0;

        if (currentFraction < points[0]) {
            nearestIdx = 0;
        } else {
            let minDiff = Infinity;
            points.forEach((p, idx) => {
                const diff = Math.abs(currentFraction - p);
                if (diff < minDiff) {
                    minDiff = diff;
                    nearestIdx = idx;
                }
            });
        }

        if (activePoint !== nearestIdx) {
            setActivePoint(nearestIdx);
        }

        if (isSnapping.current) return;

        if (scrollTimeout.current) {
            window.clearTimeout(scrollTimeout.current);
        }

        // Snap to nearest point when scrolling stops
        scrollTimeout.current = window.setTimeout(() => {
            if (velocity < 0.1) {
                isSnapping.current = true;
                const targetScroll = points[nearestIdx] * limit;

                if (Math.abs(scroll - targetScroll) > 5) {
                    lenisInstance.scrollTo(targetScroll, {
                        lerp: 0.05,
                        onComplete: () => {
                            isSnapping.current = false;
                        }
                    });
                } else {
                    isSnapping.current = false;
                }
            }
        }, 200);
    }, [points, activePoint]);

    const snapToPoint = (index: number) => {
        if (scrollTimeout.current) {
            window.clearTimeout(scrollTimeout.current);
        }

        isSnapping.current = true;
        setActivePoint(index);

        if (lenis) {
            const targetScroll = points[index] * lenis.limit;
            lenis.scrollTo(targetScroll, {
                lerp: 0.05,
                onComplete: () => {
                    isSnapping.current = false;
                }
            });
        }
    };

    return (
        <div className="scroll-dots-container">
            {points.map((_, idx) => (
                <div
                    key={idx}
                    className={`scroll-dot ${idx === activePoint ? 'active' : ''}`}
                    onClick={() => snapToPoint(idx)}
                />
            ))}
        </div>
    );
};

export default ScrollDots;
