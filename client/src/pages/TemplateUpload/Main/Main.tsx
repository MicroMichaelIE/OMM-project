import React, { useState } from 'react';
// import FileTUpload from './FileUpload';
import { URLUpload } from '../URL/LTemplateUpload';
// import ScreenshotUpload from './ScreenshotUpload';
// import CameraUpload from './CameraUpload';
import { FileTemplateUpload } from '../File/FileUpload';
import { CameraTemplateUpload } from '../Camera/CameraUpload';
import { ScreenshotUpload } from '../Screenshot/ScreenshotUpload';
import { DrawingTemplateUpload } from '../Drawing/DrawingUpload';

function UploadPage() {
  const [uploadType, setUploadType] = useState('');

  interface ButtonClickHandler {
    (type: string): void;
  }
  const handleButtonClick: ButtonClickHandler = (type) => {
    setUploadType(type);
  };

  const renderUploadOption = () => {
    switch (uploadType) {
      case 'file':
        return <FileTemplateUpload />;
      case 'url':
        return <URLUpload />;
      case 'screenshot':
        return <ScreenshotUpload />;
      case 'camera':
        return <CameraTemplateUpload />;
      case 'draw':
        return <DrawingTemplateUpload />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Upload Page</h1>
      <button onClick={() => handleButtonClick('file')}>File</button>
      <button onClick={() => handleButtonClick('url')}>URL</button>
      <button onClick={() => handleButtonClick('screenshot')}>Screenshot</button>
      <button onClick={() => handleButtonClick('camera')}>Camera</button>
      <button onClick={() => handleButtonClick('draw')}>Draw</button>
      {renderUploadOption()}
    </div>
  );
}

export default UploadPage;
