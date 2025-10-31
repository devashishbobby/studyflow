// src/components/PasswordStrengthMeter.js
import React from 'react';
import zxcvbn from 'zxcvbn';

const PasswordStrengthMeter = ({ password }) => {
  const testResult = zxcvbn(password);
  const score = testResult.score;

  const createPasswordLabel = () => {
    switch(score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  }

  const progressColor = () => {
      switch(score) {
          case 0: return '#828282';
          case 1: return '#EA1111';
          case 2: return '#FFAD00';
          case 3: return '#9bc158';
          case 4: return '#00b500';
          default: return 'none';
      }
  }

  const changePasswordColor = () => ({
    width: `${(score + 1) / 5 * 100}%`,
    background: progressColor(),
    height: '7px'
  })

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= score ? progressColor() : '#E0E0E0', fontSize: '20px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div style={{marginTop: '10px'}}>
      <div style={{height: '7px', backgroundColor: '#E0E0E0', borderRadius: '5px', overflow: 'hidden'}}>
        <div style={changePasswordColor()}></div>
      </div>
      <p style={{ color: progressColor(), textAlign: 'right', margin: '5px 0 0', fontWeight: 'bold' }}>
        {createPasswordLabel()}
      </p>
      <div>{renderStars()}</div>
    </div>
  )
};

export default PasswordStrengthMeter;