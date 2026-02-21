import React from 'react';
import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.esm.jsx';

const VideoBackground: React.FC = () => {
  return (
    <ScrollyVideo
      src={`${import.meta.env.BASE_URL}bg.mp4`}
      transitionSpeed={8}
      full={true}
    />
  );
};

export default VideoBackground;
