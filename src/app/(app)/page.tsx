"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import { Mail, StarIcon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const dummyReviews = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    review: "Excellent service! Highly recommend.",
    createdDate: new Date("2023-05-10"),
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4,
    review: "Good experience overall.",
    createdDate: new Date("2023-06-15"),
  },
  {
    id: 3,
    name: "Michael Johnson",
    rating: 5,
    review: "Amazing platform for anonymous feedback.",
    createdDate: new Date("2023-07-20"),
  },
];

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center text-center px-4 py-12 text-zinc-800">
        <section className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Whisperella - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Mail/>
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
        </Carousel>

        <div className="my-8">
          <a
            href="https://github.com/shahbaz-athwal/next-concepts"
            target="_blank"
          >
            <Button className="text-white">Give a star on GitHub</Button>
          </a>
        </div>
        <h2 className="text-2xl font-bold mb-8">User Reviews</h2>
        <Carousel
          plugins={[Autoplay({ delay: 5000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {dummyReviews.map((review) => (
              <CarouselItem key={review.id}>
                <div className="rounded-lg border overflow-hidden">
                  <div className="flex justify-between p-4">
                    <div className="flex items-center">
                      <Avatar className="flex mr-2">
                        {"" ? (
                          <AvatarImage src={""} />
                        ) : (
                          <AvatarFallback className="bg-black text-white">
                            {review.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <div className="text-sm font-bold">{review.name}</div>
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
                      {dayjs(review.createdDate).format("MMM D, YYYY h:mm A")}
                    </div>
                  </div>
                  <div className="p-4">
                    <p>{review.review}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
}
