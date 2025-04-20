"use client";
import * as React from "react";
import ImageList from "@mui/material/ImageList";
import { motion } from "framer-motion";
import ImageListItem from "@mui/material/ImageListItem";
import { IoIosCloseCircle } from "react-icons/io";
import Title from "../UI/Section/Title";

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

type PropsModal = {
  isOpen: boolean;
  closeModal: any;
  src: string;
};
const Modal = (props: PropsModal) => {
  if (!props.isOpen) return;

  return (
    <div
      onClick={props.closeModal}
      className="fixed z-50 p-[4%] md:p-[10%] flex justify-center items-center top-0 left-0 w-screen h-screen bg-[#1a1a1aaa] "
    >
      <div className="absolute top-[30px] right-[30px] text-white text-6xl">
        <IoIosCloseCircle />
      </div>

      <motion.img
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg"
        src={props.src}
        alt="Image fro the modal"
      />
    </div>
  );
};

export default function Galeria() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [srcModal, setSrcModal] = React.useState("");

  const openModal = (src: string) => {
    setIsModalOpen(true);
    setSrcModal(src);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-4">
      <Modal src={srcModal} isOpen={isModalOpen} closeModal={closeModal} />

      <div className="px-2 md:px-6">
        <h1 className="text-center text-secondary text-[32px] md:text-[64px]">
          Galeria
        </h1>
      </div>
      {/* <Title headerLevel={1} title={""} invert="yes" /> */}
      <ImageList
        sx={{ width: "100%", height: "50%" }}
        variant="quilted"
        cols={4}
        rowHeight={121}
      >
        {itemData.map((item) => (
          <ImageListItem
            key={item.img}
            cols={item.cols || 1}
            rows={item.rows || 1}
          >
            <img
              {...srcset(item.img, 121, item.rows, item.cols)}
              onClick={() => {
                openModal(item.img);
              }}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}

const itemData = [
  {
    img: "/webp/10.webp",
    title: "Breakfast",
    rows: 3,
    cols: 2,
  },
  {
    img: "/webp/05.webp",
    title: "Burger",
  },
  {
    img: "/webp/12.webp",
    title: "Camera",
  },
  {
    img: "/webp/16.webp",
    title: "Coffee",
    cols: 2,
  },
  {
    img: "/webp/18.webp",
    title: "Hats",
    cols: 2,
  },
  {
    img: "/webp/20.webp",
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
  },
  {
    img: "/webp/21.webp",
    title: "Basketball",
  },
  {
    img: "/webp/27.webp",
    title: "Fern",
  },
  {
    img: "/webp/23.webp",
    title: "Mushrooms",
    rows: 2,
    cols: 2,
  },
  {
    img: "/webp/28.webp",
    title: "Tomato basil",
  },
  {
    img: "/webp/29.webp",
    title: "Sea star",
  },
  {
    img: "/webp/27.webp",
    title: "Bike",
    cols: 2,
    rows: 3,
  },
  {
    img: "/webp/31.webp",
    title: "Bike",
  },
  {
    img: "/webp/32.webp",
    title: "Bike",
  },
  {
    img: "/webp/43.webp",
    title: "Bike",
    cols: 2,
    rows: 3,
  },
  {
    img: "/webp/33.webp",
    title: "Bike",
  },
  {
    img: "/webp/37.webp",
    title: "Bike",
  },
];
