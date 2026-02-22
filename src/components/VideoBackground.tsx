import React, { useEffect, useRef } from 'react';

const FRAME_COUNT = 251; // 0000 to 0250

const currentFrame = (index: number) => (
  `${import.meta.env.BASE_URL}bg/${index.toString().padStart(4, '0')}.webp`
);

const VideoBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Preload images
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    // Preload all frames
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      imagesRef.current.push(img);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set base dimensions using first frame when it loads
    const updateImage = (index: number) => {
      const img = imagesRef.current[index];
      if (img && img.complete) {
        if (canvas.width !== img.width || canvas.height !== img.height) {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        context.drawImage(img, 0, 0);
      } else if (img) {
        img.onload = () => {
          if (canvas.width !== img.width || canvas.height !== img.height) {
            canvas.width = img.width;
            canvas.height = img.height;
          }
          context.drawImage(img, 0, 0);
        };
      }
    };

    let targetFrameIdx = 0;
    let currentFrameIdx = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const renderLoop = (time: number) => {
      const dt = time - lastTime;

      if (currentFrameIdx !== targetFrameIdx) {
        const framesToMove = dt;

        if (Math.abs(targetFrameIdx - currentFrameIdx) <= framesToMove) {
          currentFrameIdx = targetFrameIdx;
        } else {
          currentFrameIdx += Math.sign(targetFrameIdx - currentFrameIdx) * framesToMove;
        }

        updateImage(Math.round(currentFrameIdx));
      }

      lastTime = time;
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      let scrollFraction = 0;
      if (maxScroll > 0) {
        scrollFraction = scrollTop / maxScroll;
      }

      targetFrameIdx = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollFraction * FRAME_COUNT)
      );

      console.log('Scroll Top:', scrollTop, 'Scroll Fraction:', scrollFraction, 'Target Frame:', targetFrameIdx);
    };

    window.addEventListener('scroll', handleScroll);
    // Also trigger on resize in case page height changes
    window.addEventListener('resize', handleScroll);

    // Set initial frame based on initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        objectFit: 'cover'
      }}
    />
  );
};

export default VideoBackground;
