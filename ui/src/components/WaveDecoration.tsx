const WaveDecoration = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={`wave-decoration ${className}`}
      viewBox="0 0 600 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 100C50 80 100 120 150 100C200 80 250 120 300 100C350 80 400 120 450 100C500 80 550 120 600 100"
        stroke="hsl(185 80% 55%)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <path
        d="M0 110C50 90 100 130 150 110C200 90 250 130 300 110C350 90 400 130 450 110C500 90 550 130 600 110"
        stroke="hsl(200 90% 60%)"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M0 90C50 70 100 110 150 90C200 70 250 110 300 90C350 70 400 110 450 90C500 70 550 110 600 90"
        stroke="hsl(265 80% 60%)"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
};

export default WaveDecoration;
