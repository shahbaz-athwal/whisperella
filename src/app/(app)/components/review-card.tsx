"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BadgeCheckIcon } from "lucide-react";
import dayjs from "dayjs";
import { ReviewProps } from "../page";

export function ReviewCard({ review }: { review: ReviewProps }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="pt-6 h-full">
        <div className="flex items-start gap-3 mb-4">
          {review.image ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={review.image} alt={review.username} />
              <AvatarFallback>
                {review.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">
                {review.username[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium truncate">
                {review.name || review.username}
              </span>
              <BadgeCheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
            </div>
          </div>
        </div>
        <p className="text-base text-card-foreground leading-relaxed">
          {review.comment}
        </p>
      </CardContent>
      <CardFooter className="mt-auto pt-6">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Whisperella</span>
          </div>
          <span>{dayjs(review.createdAt).format("MMM D, YYYY h:mm A")}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
