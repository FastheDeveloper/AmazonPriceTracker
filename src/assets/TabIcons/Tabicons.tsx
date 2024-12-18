import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath, Rect, Circle } from "react-native-svg"

interface TabIconProps extends SvgProps {
  color?: string;
}

const DEFAULT_COLOR = "#94A1AD"

export const HomeTabIcon = ({ color = DEFAULT_COLOR, ...props }: TabIconProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={color}
      fillRule="evenodd"
      d="M19.532 25.127v-3.042c0-1.575-1.44-2.852-3.015-2.852h-.435c-1.575 0-3.015 1.277-3.015 2.852v3.042c0 .2.034.392.098.57h-1.429a2.852 2.852 0 0 1-2.852-2.851V14.12l-1.336 1.169a.57.57 0 0 1-.751-.86l9.127-7.985a.57.57 0 0 1 .751 0l9.128 7.986a.57.57 0 0 1-.752.859l-1.335-1.17v8.727a2.852 2.852 0 0 1-2.853 2.852h-1.428a1.71 1.71 0 0 0 .097-.57Z"
      clipRule="evenodd"
    />
  </Svg>
)

export const PlansTabIcon = ({ color = DEFAULT_COLOR, ...props }: TabIconProps) => (
  <Svg fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill={color}
        d="M16.9 17.89c.453 0 .897-.184 1.498-.534l7.103-4.054c.896-.515 1.39-1.04 1.39-1.857 0-.816-.493-1.35-1.39-1.856l-7.104-4.054C17.797 5.185 17.354 5 16.9 5c-.463 0-.897.185-1.498.535L8.29 9.589c-.896.505-1.389 1.04-1.389 1.856 0 .817.493 1.342 1.39 1.857l7.112 4.054c.601.35 1.035.535 1.498.535Zm0 4.638c.443 0 .857-.194 1.438-.535l7.34-4.219c.769-.447 1.222-.962 1.222-1.71 0-.633-.345-1.119-.847-1.479l-8.099 4.667c-.433.243-.729.389-1.054.389-.325 0-.63-.146-1.054-.39l-8.099-4.666c-.512.36-.847.846-.847 1.478 0 .749.453 1.274 1.212 1.711l7.34 4.22c.581.34.995.534 1.448.534Zm0 4.472c.443 0 .857-.204 1.438-.535l7.34-4.229c.759-.437 1.222-.952 1.222-1.7 0-.643-.345-1.129-.847-1.488l-8.099 4.666c-.433.253-.729.399-1.054.399-.325 0-.63-.146-1.054-.399l-8.099-4.666c-.512.36-.847.846-.847 1.487 0 .749.453 1.264 1.212 1.701l7.34 4.23c.581.33.995.534 1.448.534Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.9 0h32v32H.9z" />
      </ClipPath>
    </Defs>
  </Svg>
)

export const WalletTabIcon = ({ color = DEFAULT_COLOR, ...props }: TabIconProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={color}
      d="M5.5 9.675c0-1.063.862-1.925 1.925-1.925h14.85c1.063 0 1.925.862 1.925 1.925v9.35a1.925 1.925 0 0 1-1.925 1.925H7.425A1.925 1.925 0 0 1 5.5 19.025v-9.35Zm3.3-.55v1.1c0 .456-.37.825-.825.825h-1.1v1.65h1.1a2.475 2.475 0 0 0 2.475-2.475v-1.1H8.8Zm6.05 7.975a2.475 2.475 0 1 0 0-4.95 2.475 2.475 0 0 0 0 4.95Zm-7.975.55h1.1c.456 0 .825.37.825.825v1.1h1.65v-1.1A2.475 2.475 0 0 0 7.975 16h-1.1v1.65Zm14.025.825c0-.456.37-.825.825-.825h1.1V16h-1.1a2.475 2.475 0 0 0-2.475 2.475v1.1h1.65v-1.1Zm0-8.25v-1.1h-1.65v1.1a2.475 2.475 0 0 0 2.475 2.475h1.1v-1.65h-1.1a.825.825 0 0 1-.825-.825ZM8.141 22.6A3.299 3.299 0 0 0 11 24.25h11.275a5.225 5.225 0 0 0 5.225-5.225V13.25a3.299 3.299 0 0 0-1.65-2.858v8.633c0 1.974-1.6 3.575-3.575 3.575H8.141Z"
    />
    <Path
      fill={color}
      d="M6.737 8.678h4.022v4.641H6.737zM19.112 8.678h4.022v4.641h-4.022zM19.112 15.175h4.022v4.641h-4.022zM6.737 15.484h4.022v4.641H6.737z"
    />
  </Svg>
)

export const FeedTabIcon = ({ color = DEFAULT_COLOR, ...props }: TabIconProps) => (
  <Svg  fill="none" {...props}>
    <Path
      fill={color}
      fillRule="evenodd"
      d="M.1 1.5A1.5 1.5 0 0 1 1.6 0h19a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 20.6 7h-19A1.5 1.5 0 0 1 .1 5.5v-4Zm0 10A1.5 1.5 0 0 1 1.6 10h10a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5v-9ZM16.6 10a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5h-4Z"
      clipRule="evenodd"
    />
  </Svg>

)

export const ActiveTabDot = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Circle
      cx={4.245}
      cy={4.245}
      r={4.245}
      fill="#41BCC4"
      transform="matrix(1 0 0 -1 3.055 12.523)"
    />
  </Svg>
)