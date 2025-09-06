'use client'

import { useState, ButtonHTMLAttributes } from 'react'
import { useRouter } from 'next/navigation'

interface SignUpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  disabled?: boolean
  className?: string
}

const SignUpButton: React.FC<SignUpButtonProps> = ({
  text = 'Sign Up',
  disabled = false,
  className = '',
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
    router.push('/profile')
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
          animation: pulseGlow 2s infinite;
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

        .signupButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        }

        .signupButton:hover::before {
          left: 100%;
        }

        .signupButton.clicked {
          transform: scale(0.95);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }

        .signupButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .buttonText {
          position: relative;
          z-index: 2;
        }

        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 10px rgba(0, 180, 255, 0.6), 0 0 20px rgba(0, 180, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 180, 255, 1), 0 0 40px rgba(0, 180, 255, 0.6);
          }
          100% {
            box-shadow: 0 0 10px rgba(0, 180, 255, 0.6), 0 0 20px rgba(0, 180, 255, 0.4);
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
