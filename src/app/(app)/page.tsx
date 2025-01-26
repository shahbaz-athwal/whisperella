"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewGrid from "./components/review-grid";
import { BackgroundLines } from "@/components/ui/bg-lines";
import { FeaturesSection } from "./components/features";
import { IconBrandGithub } from "@tabler/icons-react";

export interface ReviewProps {
  id: number;
  name?: string;
  username: string;
  image?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export default function Page() {
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const { data } = await axios.get(`/api/getreviews`);
        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    getReviews();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        <BackgroundLines className="pointer-events-none h-40 md:h-60 flex items-center justify-center w-full flex-col px-4">
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-6xl font-sans py-2 relative z-20 font-bold tracking-tight">
            Dive into the World <br /> of Anonymous Messages
          </h2>
        </BackgroundLines>

        <h2 className="container md:ml-12 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-4xl font-sans py-2 relative z-20 font-bold tracking-tight">
          ✨ Features
        </h2>
        <FeaturesSection />
        {/* 
        <div className="my-8">
          <a
            href="https://github.com/shahbaz-athwal/whisperella"
            target="_blank"
          >
            <div className="flex items-center justify-center">
              <IconBrandGithub size={16} className="mr-2" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                Give a Star on GitHub
              </span>
            </div>
          </a>
        </div> */}

        <h2 className="container md:ml-12 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-4xl font-sans py-2 relative z-20 font-bold tracking-tight">
          ✌🏻 User Reviews
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mb-12 px-6 py-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[250px] w-full" />
            ))}
          </div>
        ) : (
          <div className="w-full max-w-7xl px-4 mb-12">
            <ReviewGrid reviews={reviews} />
          </div>
        )}
      </div>
    </>
  );
}
