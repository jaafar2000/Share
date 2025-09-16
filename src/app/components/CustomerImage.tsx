import React from "react";
import NextImage from "next/image";

interface Props {
  src: string;
  w: number;
  h: number;
  alt?: string;
}

const CustomerImage: React.FC<Props> = ({ src, w, h, alt = "Picture" }) => {
  return (
    <div>
      <NextImage src={src} width={w} height={h} alt={alt} />
    </div>
  );
};

export default CustomerImage;
