import React, { useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import { RxUpload } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const App = () => {
  const [isclick, setIsClick] = useState(true);
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/remove-bg`,
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = URL.createObjectURL(res.data);
      setProcessedImage(imageUrl); // display this in an <img>
    } catch (error) {
      toast.error("Error while removing background", error);
    }
  };

  return (
    <div className="mx-4 overflow-hidden h-screen">
      <h1 className=" p-2 text-lg md:text-2xl text-yellow-300/70 font-semibold">
        WIPEBG
      </h1>
      {!isclick && (
        <div className=" overflow-hidden whitespace-nowrap">
          <p className="inline-block marque text-center text-gray-300 text-sm md:text-lg">
            <span className="text-yellow-300/70">WIPEBG</span> Clean only 40
            image after that free limit is exceeds so if you get any trouble
            during removing background that's the reason
          </p>
        </div>
      )}
      <AnimatePresence>
        {isclick && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              duration: 0.6,
            }}
            className="bg-gradient-to-t to-[#0F2027] from-[#2C5364] max-w-md md:max-w-xl h-32 md:h-48 justify-center mx-auto flex flex-col mt-36 rounded-md shadow-[#3c626e] shadow-lg space-y-2"
          >
            <h2 className="mx-2 text-sm  text-gray-300 md:max-w-md md:text-lg">
              <span className="text-blue-400 transition-all">WIPEBG</span> is an
              AI tool for removing backgrounds from any image without losing
              quality.
            </h2>
            <div className="relative">
              <p
                onClick={() => setIsClick(false)}
                className="text-center bg-gray-500 mx-16 p-0.5 mb-1 mt-2 rounded-md md:mt-6 hover:text-white hover:bg-[#302b63] transition-all duration-300 cursor-pointer"
              >
                Let's start
                <span className="absolute mt-1 ml-1 text-lg">
                  <GoArrowRight />
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isclick && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              delay: 0.3,
            }}
            className="max-w-md mx-auto mt-28 bg-gradient-to-b to-[#141E30] from-[#243B55]  border border-transparent  shadow-xl shadow-black/40 rounded-2xl p-6 text-white"
          >
            <h2 className="text-center text-base md:text-xl font-medium mb-4 text-gray-300">
              Remove background by just uploading your image
            </h2>
            <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-6 min-h-[200px] flex flex-col items-center justify-center gap-4 hover:border-blue-400 transition-all duration-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {!processedImage ? (
                <RxUpload className="text-lg md:text-2xl" />
              ) : (
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-h-40 object-contain bg-white rounded-md p-2"
                />
              )}
            </div>
            {image && (
              <div className="text-center mt-4">
                <a href={processedImage} download="no-bg.png">
                  <button
                    onClick={() => {
                      setImage("");
                      setProcessedImage("");
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all cursor-pointer"
                  >
                    Download
                  </button>
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
