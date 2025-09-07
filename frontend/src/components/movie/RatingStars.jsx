import React from 'react';
import './RatingStars.css';

const RatingStars = ({ rating, size = 'medium', changeRating, starDimension = '20px', starSpacing = '2px' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (newRating) => {
    if (changeRating) {
      changeRating(newRating);
    }
  };

  const renderStars = () => {
    const stars = [];

    // Full stars
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <span
          key={`full-${i}`}
          className="star full"
          onClick={() => handleStarClick(i)}
          style={{ 
            cursor: changeRating ? 'pointer' : 'default',
            fontSize: starDimension,
            marginRight: starSpacing
          }}
        >
          ★
        </span>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <span
          key="half"
          className="star half"
          onClick={() => handleStarClick(fullStars + 0.5)}
          style={{ 
            cursor: changeRating ? 'pointer' : 'default',
            fontSize: starDimension,
            marginRight: starSpacing
          }}
        >
          ★
        </span>
      );
    }

    // Empty stars
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(
        <span
          key={`empty-${i}`}
          className="star empty"
          onClick={() => handleStarClick(fullStars + (hasHalfStar ? 0.5 : 0) + i)}
          style={{ 
            cursor: changeRating ? 'pointer' : 'default',
            fontSize: starDimension,
            marginRight: starSpacing
          }}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className={`rating-stars ${size}`}>
      <div className="stars-container">
        {renderStars()}
      </div>
      {rating > 0 && !changeRating && (
        <span className="rating-text">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default RatingStars;