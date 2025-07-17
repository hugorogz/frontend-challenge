import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { Select, Button, Space, message } from 'antd';
import { BoundingBox, CANVAS_HEIGHT, CANVAS_WIDTH, KonvaAnnotatorProps } from '../utils';
import { PostAnnotation } from '../api/annotations-api';

const KonvaAnnotator = ({ 
  imageId, 
  imageUrl, 
  categories, 
  boxes, 
  setBoxes, 
  selectedCategory, 
  setSelectedCategory }: KonvaAnnotatorProps) => {
  // useImage allows to load an image asynchronously and use it inside the canvas. Returns HTMLImageElement
  const [image] = useImage(imageUrl);  
  const [newBox, setNewBox] = useState<BoundingBox | null>(null);
  const isDrawing = useRef(false);
  const [imageScale, setImageScale] = useState(1);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [messageApi, contextHolder] = message.useMessage();// to use toasters from AntD

  useEffect(() => {
    if (image) {
      // Calculates the scaling of images to fit the fixed 800x600 canvas
      const scaleX = CANVAS_WIDTH / image.width;
      const scaleY = CANVAS_HEIGHT / image.height;
      const scale = Math.min(scaleX, scaleY);
      setImageScale(scale);

      // to center the image in the canvas
      const offsetX = (CANVAS_WIDTH - image.width * scale) / 2;
      const offsetY = (CANVAS_HEIGHT - image.height * scale) / 2;
      setImageOffset({ x: offsetX, y: offsetY });
    }
  }, [image]);

  const handleMouseDown = (e: any) => {
    if (!isDrawing.current) {
      // this event.target is a special node from Konva Stage
      // methods getState, getPointerPosition are also konva methods
      // getStage returns the Stage where event.current belongs
      // getPointerPosition return an object { x, y } with the mouse pointer coordinates
      // related to konva. Internally calculater by konva library
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) return;
      setNewBox({ x: pos.x, y: pos.y, width: 0, height: 0 });
      isDrawing.current = true;
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || !newBox) return;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    setNewBox({
      ...newBox,
      width: pos.x - newBox.x,
      height: pos.y - newBox.y,
    });
  };

  const handleMouseUp = () => {
    if (newBox && isDrawing.current) {
      setBoxes([...boxes, newBox].filter(b => b?.height && b?.width));
      setNewBox(null);
      isDrawing.current = false;
    }
  };

  const handleSubmit = async (action: 'confirm' | 'discard') => {
    const isConfirming = action === 'confirm';

    if (isConfirming && (!selectedCategory || boxes.length === 0)) {
      messageApi.open({
        type: 'warning',
        content: 'Please select a category and draw at least one box.',
      });
      return;
    }

    const formatted = {
      imageId,
      annotations: isConfirming
        ? [{
            categoryId: selectedCategory!.id,
            boundingBoxes: boxes
              .filter(b => b?.height && b?.width)
              .map(b => ({
                topLeftX: b.x,
                topLeftY: b.y,
                width: b.width,
                height: b.height,
              })),
          }]
        : [],
    };

    if (!isConfirming) setBoxes([]);

    try {
      await PostAnnotation(formatted);
      messageApi.open({
        type: 'success',
        content: `✅ Annotation ${isConfirming ? 'submitted' : 'discarded'} successfully!`,
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `Failed to ${isConfirming ? 'submit' : 'discard'} annotation: ${error}`,
      });
    }
  };

  return (
    <>
      {/* for toaster */}
      {contextHolder}
      {/* Space is for spacing elements so they dont look tight */}
      <Space style={{ marginBottom: 16 }}>
        <Select
          showSearch
          placeholder="Select Category"
          style={{ width: 200 }}
          value={selectedCategory?.id}
          onChange={(value) => {
            const cat = categories.find(c => c.id === value);
            setSelectedCategory(cat ?? null);
          }}
          options={categories.map(c => ({
            label: c.name,
            value: c.id,
          }))}
          filterOption={(input, option) =>
            (option?.label as string).toLowerCase().includes(input.toLowerCase())
          }
        />



        <Button onClick={() => handleSubmit('discard')}>Discard</Button>

        <Button
          style={
            !selectedCategory || boxes.length === 0
              ? {}
              : { color: 'black', backgroundColor: 'rgb(0, 245, 77)' }
          }
          type="primary"
          disabled={!selectedCategory || boxes.length === 0}
          onClick={() => handleSubmit('confirm')}
        >
          Confirm
        </Button>
      </Space>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Stage // main container for the canvas, represents the "stage" or drawing area.
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          // these mouse events are internally passed to the rendered <canvas> in ther DOM
          // they are not part of react konva Stage
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ border: '1px solid #ccc', marginBottom: 10 }}
        >
          {/* A layer inside the stage */}
          <Layer> 
            {image && (
              <KonvaImage // draws an image in the canvas by using an HTMLImageElement (returned from useImage
                image={image}
                x={imageOffset.x}
                y={imageOffset.y}
                scale={{ x: imageScale, y: imageScale }}
              />
            )}
            {boxes.map((box, i) => (
              <Rect // component that draws a rectangle.
                key={i}
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                stroke="red"
              />
            ))}
            {newBox && (
              <Rect // component that draws a rectangle.
                x={newBox.x}
                y={newBox.y}
                width={newBox.width}
                height={newBox.height}
                stroke="blue"
                dash={[4, 4]}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default KonvaAnnotator;
