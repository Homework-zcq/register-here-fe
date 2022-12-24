import { View } from "@tarojs/components";
import "./index.scss";

export default function Dot({ color }: { color: string }) {
  return (
    <View className="dot">
      <View
        className="big"
        style={
          color == "blue"
            ? "background: rgba(0,56,255,.4)"
            : "background: rgba(255,184,0,.4)"
        }
      ></View>
      <View
        className="small"
        style={
          color == "blue"
            ? "background: rgba(0,56,255,1)"
            : "background: rgba(255,184,0,1)"
        }
      ></View>
    </View>
  );
}
