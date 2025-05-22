import React from 'react';
import styled from 'styled-components';

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
}

const GenerateAIButton: React.FC<Props> = ({ onClick, disabled }) => {
  return (
    <StyledWrapper>
      <button className="btn" onClick={onClick} disabled={disabled}>
        <svg height={24} width={24} fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
        </svg>
        <span className="text">Generuj z AI</span>
        {disabled && (
          <span className="ml-2 inline-block align-middle">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </span>
        )}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    border: none;
    width: 15em;
    height: 5em;
    border-radius: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    background: #1C1A1C;
    cursor: pointer;
    transition: all 450ms ease-in-out;
  }

  .sparkle {
    fill: #AAAAAA;
    transition: all 800ms ease;
  }

  .text {
    font-weight: 600;
    color: #AAAAAA;
    font-size: medium;
  }

  .btn:hover {
    background: linear-gradient(0deg,#A47CF3,#683FEA);
    box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
    inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 4px rgba(255, 255, 255, 0.2),
    0px 0px 180px 0px #9917FF;
    transform: translateY(-2px); /* Add this line for upward movement */
  }

  .btn:active {
    transform: translateY(1px); /* Add this line for slight downward movement on click */
  }

  .btn:hover .text {
    color: white;
  }

  .btn:hover .sparkle {
    fill: white;
    transform: scale(1.2) rotate(180deg); /* Add rotation on hover */
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

`;

export default GenerateAIButton; 