'use client';

export default function PieSlice({ radius = 100, startAngle = 0, endAngle = 90, fill = 'green' }) {
  const polarToCartesian = (r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: r + r * Math.cos(angleInRadians),
      y: r + r * Math.sin(angleInRadians),
    };
  };

  const start = polarToCartesian(radius, endAngle);
  const end = polarToCartesian(radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    `M ${radius} ${radius}`,           // Move to center
    `L ${start.x} ${start.y}`,         // Line to start angle
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, // Arc
    "Z"                                // Close path
  ].join(" ");

  return (
    <path d={d} fill={fill} />
  );
}
