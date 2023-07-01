type Props = {
  name: string;
  color?: string;
};

export default function Icon({ name, color }: Props) {
  const commonAttr = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "16",
    height: "16",
  };

  const defaultColor = "rgba(101, 116, 134, 1)";
  switch (name) {
    case "check":
      return (
        <svg {...commonAttr} color={color || defaultColor}>
          <g id="check-lg">
          <path id="Vector" d="M5.99998 11.28L3.21998 8.49999L2.27332 9.43999L5.99998 13.1667L14 5.16665L13.06 4.22665L5.99998 11.28Z" fill="#657486"/>
          </g>
        </svg>
      );
    case "arrow-down":
      return (
        <svg {...commonAttr} color={color || defaultColor}>
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      );

    default:
      return <svg></svg>;
  }
}
