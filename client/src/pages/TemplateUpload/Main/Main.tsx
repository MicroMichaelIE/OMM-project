import React, { useState } from 'react';
// import FileTUpload from './FileUpload';
import { URLUpload } from '../URL/LTemplateUpload';
// import ScreenshotUpload from './ScreenshotUpload';
// import CameraUpload from './CameraUpload';
import { FileTemplateUpload } from '../File/FileUpload';
import { CameraTemplateUpload } from '../Camera/CameraUpload';
import { ScreenshotUpload } from '../Screenshot/ScreenshotUpload';
import { DrawingTemplateUpload } from '../Drawing/DrawingUpload';
import { ErrorBox } from '../../../components/ErrorBox/ErrorBox';

export interface ErrorType {
  message: string;
  show: boolean;
}

function UploadPage() {
  const [uploadType, setUploadType] = useState('');
  const [error, setError] = useState<ErrorType>({} as ErrorType);

  interface ButtonClickHandler {
    (type: string): void;
  }
  const handleButtonClick: ButtonClickHandler = (type) => {
    setUploadType(type);
    setError({ message: '', show: false });
  };

  const renderUploadOption = () => {
    switch (uploadType) {
      case 'file':
        return <FileTemplateUpload setError={setError} />;
      case 'url':
        return <URLUpload setError={setError} />;
      case 'screenshot':
        return <ScreenshotUpload setError={setError} />;
      case 'camera':
        return <CameraTemplateUpload setError={setError} />;
      case 'draw':
        return <DrawingTemplateUpload setError={setError} />;
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
      {error.show && <ErrorBox errorMessage={error.message} />}
    </div>
  );
}

export default UploadPage;
