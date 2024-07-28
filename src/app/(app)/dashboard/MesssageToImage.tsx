import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { ShareIcon } from "lucide-react";

export const ShareButton = ({ message }: any) => {
  const contentRef = useRef(null);

  const handleGenerateImage = async () => {
    const node = contentRef.current;
    if (node) {
      const dataUrl = await toPng(node);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "instagram-share.png";
      link.click();
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

      <Button onClick={handleGenerateImage} variant={"outline"}>
        <ShareIcon />
      </Button>
    </>
  );
};

export default ShareButton;
