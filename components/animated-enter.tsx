import type { PropsWithChildren } from "react";
import { Platform, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type AnimatedEnterProps = PropsWithChildren<{
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function AnimatedEnter({
  children,
  delay = 0,
  distance = 18,
  duration = 450,
  style,
}: AnimatedEnterProps) {
  if (Platform.OS === "web") {
    return <View style={style}>{children}</View>;
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(duration).delay(delay).springify().damping(18).withInitialValues({
        opacity: 0,
        transform: [{ translateY: distance }],
      })}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
