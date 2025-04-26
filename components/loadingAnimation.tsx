import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingAnimation() {
  return (
    <DotLottieReact
      src="/lottie/loading-lottie.lottie"
      loop
      autoplay
    />
  );
};