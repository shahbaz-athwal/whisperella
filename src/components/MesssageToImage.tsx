import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { ShareIcon } from "lucide-react";

export const ShareButton = ({ message }: any) => {
  const contentRef = useRef(null);

  const handleShare = async () => {
    const node = contentRef.current;
    if (node) {
      try {
        const dataUrl = await toPng(node);
        const blob = await (await fetch(dataUrl)).blob();
        const filesArray = [
          new File([blob], "message.png", {
            type: blob.type,
          }),
        ];

        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
          await navigator.share({
            files: filesArray,
            title: "Anonymous Message",
            text: message,
          });
        } else {
          console.log("Web Share API is not supported in your browser.");
        }
      } catch (error) {
        console.error("Error sharing", error);
      }
    }
  };

  return (
    <>
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div
          ref={contentRef}
          className="w-[1080px] h-[1920px] bg-white p-5 text-center"
        >
          <h1 className="text-4xl font-bold">Anonymous Message</h1>
          <h1>{message}</h1>
        </div>
      </div>

      <Button onClick={handleShare} variant={"outline"}>
        <ShareIcon />
      </Button>
    </>
  );
};

export default ShareButton;
