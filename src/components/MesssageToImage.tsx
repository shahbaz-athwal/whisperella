import React, { useRef } from "react";
import { toJpeg } from "html-to-image";
import { Button } from "@/components/ui/button";
import { ShareIcon } from "lucide-react";

export const ShareButton = ({ message }: any) => {
  const contentRef = useRef(null);

  const handleShare = async () => {
    const node = contentRef.current;
    if (node) {
      try {
        const dataUrl = await toJpeg(node, {
          quality: 0.8,
        });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "Share-Message.jpeg", {
          type: blob.type,
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
          });
        } else {
          console.log("Web Share API is not supported in your browser.");
        }
      } catch (error) {
        console.error("Error sharing", error);
      }
    }
    // if (node) {
    //   const dataUrl = await toJpeg(node , {
    //     quality: 0.8
    //   });
    //   const link = document.createElement("a");
    //   link.href = dataUrl;
    //   link.download = "instagram-share.jpeg";
    //   link.click();
    // }
  };

  return (
    <>
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div
          ref={contentRef}
          className="w-[720px] h-[1280px] p-5 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-opacity-70"
        >
          <h1 className="py-20 text-7xl font-bold text-white">Whisperella</h1>
          <h1 className="text-4xl p-4 text-white font-sans mt-4 max-h-[90%] overflow-hidden">
            {message}
          </h1>
        </div>
      </div>

      <Button onClick={handleShare} variant={"outline"}>
        <ShareIcon />
      </Button>
    </>
  );
};

export default ShareButton;
