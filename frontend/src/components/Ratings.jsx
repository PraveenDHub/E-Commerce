import { useState } from "react";
import { Star } from "lucide-react";

const Ratings = ({ value = 0, onRatingChange, disabled = false, showValue = true }) => {
  
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map((star) => {
          const filled = hover ? star <= hover : star <= value;

          return (
            <Star
              key={star}
              size={20}
              className={`transition-all duration-200 
                ${filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                ${disabled ? "cursor-default" : "cursor-pointer hover:scale-125"}
                `}
              onMouseEnter={() => !disabled && setHover(star)}
              onMouseLeave={() => !disabled && setHover(0)}
              onClick={() => !disabled && onRatingChange?.(star)}
            />
          );
        })}
      </div>

      {showValue && (
        <span className="text-xs font-semibold text-gray-500">
          {value}/5
        </span>
      )}
    </div>
  );
};

export default Ratings;