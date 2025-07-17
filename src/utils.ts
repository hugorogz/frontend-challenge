export const imagesUrl = 'https://5f2f729312b1481b9b1b4eb9d00bc455.api.mockbin.io/unanalyzed-images';
export const categoriesUrl = 'https://f6fe9241e02b404689f62c585d0bd967.api.mockbin.io/categories';
export const annotationsnUrl = 'https://eb1b6f8bfab448df91c68bd442d6a968.api.mockbin.io/annotations';

export interface Category {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  url: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface KonvaAnnotatorProps {
  imageId: number;
  imageUrl: string;
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category | null) => void;
  boxes: BoundingBox[];
  setBoxes: (boxes: BoundingBox[]) => void;
}

export interface ImageSelectorProps {
  images: Image[];
  selectedImage: Image | null;
  setSelectedImage: (image: Image) => void;
}

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;