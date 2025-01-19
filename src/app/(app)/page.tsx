"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import { Mail, StarIcon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: number;
  name?: string;
  username: string;
  image?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([]);
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

        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-lg md:max-w-xl relative"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Mail />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-1/2" />
          <CarouselNext className="right-0 translate-x-1/2" />
        </Carousel>

        <div className="my-8">
          <a
            href="https://github.com/shahbaz-athwal/whisperella"
            target="_blank"
          >
            <Button className="text-white">Give a star on GitHub</Button>
          </a>
        </div>
        <h2 className="text-3xl font-extrabold m-6">User Reviews</h2>
        <Carousel
          plugins={[Autoplay({ delay: 4000 })]}
          className="w-full max-w-lg md:max-w-xl relative"
        >
          <CarouselContent>
            {loading ? (
              <CarouselItem>
                <Skeleton className="w-[600px] h-[150px]" />
              </CarouselItem>
            ) : (
              reviews.map((review) => (
                <CarouselItem key={review.id}>
                  <div className="rounded-lg overflow-hidden">
                    <div className="flex justify-between p-4">
                      <div className="flex items-center">
                        <Avatar className="flex mr-2">
                          <AvatarImage src={review.image} />
                          <AvatarFallback className="bg-black text-white">
                            {review.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <div className="text-sm font-bold">
                            {review.name ? review.name : "@" + review.username}
                          </div>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, index) => (
                              <StarIcon
                                color="black"
                                fill="gray"
                                key={index}
                                className="w-5 h-5"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {dayjs(review.createdAt).format("MMM D, YYYY h:mm A")}
                      </div>
                    </div>
                    <div className="p-4">
                      <p>{review.comment}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>

          {!loading && (
            <>
              <CarouselPrevious className="left-0 -translate-x-1/2" />
              <CarouselNext className="right-0 translate-x-1/2" />
            </>
          )}
        </Carousel>
      </div>
    </>
  );
}
