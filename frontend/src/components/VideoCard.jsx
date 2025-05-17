import { useEffect, useRef } from "react";

const VideoCard = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, [peer]);

  return <video ref={ref} autoPlay playsInline className="rounded border w-full max-w-md" />;
};

export default VideoCard;
