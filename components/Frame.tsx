import React, { useCallback } from "react";
import { View, FlexStyle, StyleProp, ViewStyle } from "react-native";
import { Units } from "../foundations/Spacing";
import { useTheme } from "../application/providers/Theming";

type Value = keyof Units | "none";
type Spacing =
  | Value
  | [Value]
  | [Value, Value]
  | [Value, Value, Value]
  | [Value, Value, Value, Value];

interface Props
  extends Pick<
    FlexStyle,
    | "justifyContent"
    | "alignItems"
    | "flex"
    | "flexBasis"
    | "flexGrow"
    | "flexWrap"
    | "flexDirection"
  > {
  marginTop?: Spacing;
  marginRight?: Spacing;
  marginBottom?: Spacing;
  marginLeft?: Spacing;
  paddingTop?: Spacing;
  paddingRight?: Spacing;
  paddingBottom?: Spacing;
  paddingLeft?: Spacing;
  style?: StyleProp<ViewStyle>;
  debugTrace?: boolean;
}

// TODO: hook to get styles without the frame itself
const Frame: React.FunctionComponent<Props> = function Frame({
  justifyContent,
  alignItems,
  flex,
  flexBasis,
  flexGrow,
  flexWrap,
  flexDirection,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  style,
  debugTrace,
  ...props
}) {
  const { units, colors } = useTheme();
  const getSpacing = useCallback(
    (key?: Spacing) =>
      key === "none" || !key ? 0 : units[key as keyof typeof units],
    [units]
  );

  return (
    <View
      style={{
        justifyContent,
        alignItems,
        flex,
        flexBasis,
        flexGrow,
        flexWrap,
        flexDirection,
        marginRight: getSpacing(marginRight),
        marginTop: getSpacing(marginTop),
        marginBottom: getSpacing(marginBottom),
        marginLeft: getSpacing(marginLeft),
        paddingTop: getSpacing(paddingTop),
        paddingRight: getSpacing(paddingRight),
        paddingBottom: getSpacing(paddingBottom),
        paddingLeft: getSpacing(paddingLeft),
        ...(style as Object),
        ...(debugTrace && {
          // TODO: make sure to only add on dev env
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: "red", // TODO: use destructive color
        }),
      }}
      {...props}
    />
  );
};

export { Frame };
