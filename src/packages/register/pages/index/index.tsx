import { Component, PropsWithChildren } from "react";
import { View, Text, Image, Input } from "@tarojs/components";
import "./index.less";
import "./index.scss";
import search from "@/assets/img/search.png";
import fen from "@/assets/img/fen.png";
import xun from "@/assets/img/xun.png";
import gu from "@/assets/img/gu.png";
import kou from "@/assets/img/kou.png";
import pi from "@/assets/img/pi.png";
import fu from "@/assets/img/fu.png";
import gang from "@/assets/img/gang.png";
const roomList = [
  { img: gu, name: "骨科" },
  { img: kou, name: "口腔科" },
  { img: pi, name: "皮肤科" },
  { img: fu, name: "妇产科" },
  { img: gang, name: "肛肠科" },
];
export default function Index() {
  return (
    <View className="index">
      <View className="search_box">
        <Image className="search_icon" src={search} />
        <Input className="search_input" type="text" placeholder="搜索医院..." />
      </View>
      <View className="ask_box">
        <View className="ask_img_box">
          <Image className="ask_img" src={fen} />
        </View>
        <View className="ask_img_box">
          <Image className="ask_img" src={xun} />
        </View>
      </View>
      <View className="room_box">
        <Text className="title">按科室挂号</Text>
        <View className="room_class">
          {roomList.map((val) => (
            <View className="room_card" key="room">
              <Image className="room_icon" src={val.img} />
              <Text className="room_name">{val.name}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="title_box">
        <Text className="title">按医院挂号</Text>
        <Text className="title_tip">共{100}家医院</Text>
      </View>
    </View>
  );
}
