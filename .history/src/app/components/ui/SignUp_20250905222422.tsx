'use client'

import { useState, ButtonHTMLAttributes } from 'react'

interface SignUpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
}

const SignUpButton: React.FC<SignUpButtonProps> = ({
  text = 'SIGN UP',
  onClick = () => {},
  disabled = false,
  className = '',
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
    onClick(e)
  }

  return (
    <>
      <style jsx>{`
        .signupButton {
          position: relative;
          padding: 16px 32px;
          background: linear-gradient(145deg, #1a1a1a, #000000);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          text-transform: uppercase;
          min-width: 140px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .signupButton::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .signupButton::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
              circle at 20% 50%,
              rgba(120, 120, 120, 0.3) 0%,
              transparent 50%
            ),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(200, 200, 200, 0.2) 0%, transparent 50%);
          border-radius: 12px;
          animation: shimmer 3s infinite;
        }

        .signupButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        }

        .signupButton:hover::before {
          left: 100%;
        }

        .signupButton:active,
        .signupButton.clicked {
          transform: translateY(0);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }

        .signupButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .signupButton:disabled:hover {
          transform: none;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }

        .buttonText {
          position: relative;
          z-index: 2;
        }

        @keyframes shimmer {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
          .signupButton {
            background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15),
              inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          }

          .signupButton:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.4);
          }
        }
      `}</style>

      <button
        className={`signupButton ${className} ${isClicked ? 'clicked' : ''}`}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        <span className="buttonText">{text}</span>
      </button>
    </>
  )
}

export default SignUpButton
