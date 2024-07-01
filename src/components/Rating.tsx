import { StarIcon } from 'lucide-react';

const Rating = ({ rating, maxRating = 5, onRate }: any) => {
  return (
    <div className="flex">
      {Array.from({ length: maxRating }, (_, i) => (
        <StarIcon
          key={i}
          className={`w-6 h-6 cursor-pointer ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          onClick={() => onRate(i + 1)}
        />
      ))}
    </div>
  );
};

export default Rating;
