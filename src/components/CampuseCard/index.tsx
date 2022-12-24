import { Image, Text, View } from "@tarojs/components";
import "./index.scss";

export default function CampuseCard({
  logo,
  name,
  address,
  lables,
  distance,
  id
}: {
  logo: any;
  name: string;
  address: string;
  lables: string[];
  distance: string;
  id: number;
}) {
  return (
    <View className="Campuse-part">
      <Image src={logo} className="Campuse-logo" />
      <View className="Campuse-right">
        <Text className="Campuse-name">{name}</Text>
        <Text className="Campuse-address">{address}</Text>
        <View className="Campuse-last">
          <View className="Campuse-labels">
            {lables.map((val, index) => (
              <View className="Campuse-label-box" key={id + "lable" + index}>
                <Text className="Campuse-label-text">{val}</Text>
              </View>
            ))}
          </View>
          <Text className="Campuse-distance">{distance}</Text>
        </View>
      </View>
    </View>
  );
}
