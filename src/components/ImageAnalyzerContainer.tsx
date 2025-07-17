import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { GetImages } from "../api/images-api";
import { setImages } from "../redux/imagesSlice";
import { GetCategories } from "../api/categories-api";
import { setCategories } from "../redux/categoriesSlice";
import KonvaAnnotator from "./KonvaAnnotator";
import ImageSelector from "./ImageSelector";
import { BoundingBox, Category, Image } from "../utils";
import { message } from 'antd';


const ImageAnalyzerContainer = () => {
  const images = useSelector((state: RootState) => state.images.images);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [messageApi, contextHolder] = message.useMessage(); // to use antD toasters
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await GetImages();
        const categories = await GetCategories();

        dispatch(setImages(images));
        dispatch(setCategories(categories));
      } catch (error) {
        messageApi.error(`Failed to load data: ${error}`);
      }
    };

    fetchImages();
  }, []);

  const handleSelectImage = (img: Image) => {
    setSelectedImage(img);
    setSelectedCategory(null); // clear selected category
    setBoxes([]); // clear bounding boxes
  };


  return (
    <div style={{ paddingBottom: 160 }}>
      {contextHolder}
      <KonvaAnnotator
        imageId={selectedImage?.id ?? 0}
        imageUrl={selectedImage?.url ?? ""}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        boxes={boxes}
        setBoxes={setBoxes}
      />
      <ImageSelector
        images={images}
        selectedImage={selectedImage}
        setSelectedImage={handleSelectImage}
      />
    </div>
  );
};

export default ImageAnalyzerContainer;
