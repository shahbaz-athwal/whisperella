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
          quality: 0.9,
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

    //Dev only
    
    // if (node) {
    //   const dataUrl = await toJpeg(node, {
    //     quality: 0.9,
    //   });
    //   const link = document.createElement("a");
    //   link.href = dataUrl;
    //   link.download = "instagram-share.jpeg";
    //   link.click();
    // }
  };

  return (
    <>
      <div style={{ position: "absolute", top: "-999px", left: "-999px" }}>
        <div
          ref={contentRef}
          className="w-[720px] h-[1280px] p-5 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-opacity-50"
        >
          <div className="relative top-[15%] p-6 mt-4">
            <h2 className="text-4xl font-bold text-left mx-4 text-white mb-8">
              Anonymous Message:
            </h2>
            <div className="rounded-2xl p-6 place-content-center shadow-lg backdrop-blur-lg bg-black/50">
              <h1 className="text-3xl text-white font-sans overflow-hidden break-words">
                {message}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleShare} variant={"outline"}>
        <ShareIcon />
      </Button>
    </>
  );
};

export default ShareButton;
