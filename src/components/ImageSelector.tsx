import { Card, Image as AntImage } from 'antd';
import { ImageSelectorProps } from '../utils';

const ImageSelector = ({ images, selectedImage, setSelectedImage }: ImageSelectorProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '8px 16px',
        background: '#fff',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Card title="Select an Image" style={{ margin: 0 }}>
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            padding: '4px 0',
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                flex: '0 0 auto',
                width: 80,
                height: 80,
                border: selectedImage?.id === img.id ? '4px solid rgb(0, 245, 77)' : '1px solid #ccc',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 4,
                boxSizing: 'border-box',
              }}
              onClick={() => {
                setSelectedImage(img)
              }}
            >
              <AntImage
                src={img.url}
                alt={`Image ${img.id}`}
                preview={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ImageSelector;
