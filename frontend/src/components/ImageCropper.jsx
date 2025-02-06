import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/button';
import upload from '../lib/upload';

const ImageCropModal = ({ isOpen, onClose, onUploadComplete, queue }) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [currentFile, setCurrentFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const processNextImage = () => {
    if (queue.length === 0) return;
    const nextFile = queue[0];
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result);
    reader.readAsDataURL(nextFile);
    setCurrentFile(nextFile);
  };

  const handleCropComplete = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const image = imageRef.current;
    const cropArea = {
      x: crop.x * (image.naturalWidth / image.width),
      y: crop.y * (image.naturalHeight / image.height),
      width: crop.width * (image.naturalWidth / image.width),
      height: crop.height * (image.naturalHeight / image.height),
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    canvas.toBlob(async (blob) => {
      try {
        setUploading(true);
        const croppedFile = new File([blob], currentFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        const url = await upload(croppedFile);
        onUploadComplete(url);
        
        setSrc(null);
        setCurrentFile(null);
      } catch (err) {
        console.error('Upload Error:', err);
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg');
  };

  useEffect(() => {
    if (isOpen && queue.length > 0 && !currentFile) {
      processNextImage();
    }
  }, [isOpen, queue, currentFile]);

  if (!isOpen) return null;

  return (
<>
    { src && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <ReactCrop
          crop={crop}
          onChange={c => setCrop(c)}
          onComplete={c => setCrop(c)}
        >
          <img
            ref={imageRef}
            src={src}
            alt="Crop preview"
            style={{ maxWidth: '100%' }}
          />
        </ReactCrop>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              onClose();
              setSrc(null);
              setCurrentFile(null);
            }}
            className="bg-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCropComplete} 
            className="bg-buttonColor"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Crop & Upload'}
          </Button>
        </div>
      </div>
    </div>
          )
        }
 </>
  );
};

export default ImageCropModal;