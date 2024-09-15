import React, { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import Webcam from 'react-webcam';
import './App.css';

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodyPix = async () => {
    const net = await bodyPix.load();
    setInterval(() => {
      detect(net);
    }, 60);
    console.log('BodyPix model loaded', net);
  };

  const detect = async (net) => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const segmentation = await net.segmentPersonParts(video);

      const colouredPartImages = bodyPix.toColoredPartMask(segmentation);
      bodyPix.drawMask(canvasRef.current, video, colouredPartImages, 0.7, 0, false);
    }
  }
    
  runBodyPix();
  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef} 
          style={{
            position: 'absolute'
          }}
        />
        <canvas ref={canvasRef}
          style={{
            position: 'absolute',
            zIndex: 10
          }}
        />
      </header>
    </div>
  );
}

export default App;
