"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewGrid from "./components/review-grid";

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
      <div className="flex flex-col items-center text-center px-4 py-12 text-zinc-800">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Dive into the World of Anonymous Messages
        </h1>
        <p className="text-xl md:text-2xl">Login to get your own dashboard.</p>
        <p className="text-xl md:text-2xl mb-10">
          Share your messages wherever you want.
        </p>

        <div className="my-8">
          <a
            href="https://github.com/shahbaz-athwal/whisperella"
            target="_blank"
          >
            <Button className="text-white">Give a star on GitHub</Button>
          </a>
        </div>
        <h2 className="text-3xl font-extrabold m-6">User Reviews</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[250px] w-full" />
            ))}
          </div>
        ) : (
          <div className="w-full max-w-7xl px-4">
            <ReviewGrid reviews={reviews} />
          </div>
        )}
      </div>
    </>
  );
}
