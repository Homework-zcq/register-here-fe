import { View, Text, Image, Input } from "@tarojs/components";
import search from "@/assets/img/search.png";
import fen from "@/assets/img/fen.png";
import xun from "@/assets/img/xun.png";
import choose from "@/assets/icon/choose.png";
import { useState } from "react";
import Taro, { useLoad } from "@tarojs/taro";
import request from "@/services/request";
import { campusInfo } from "@/services/types";
import CampuseCard from "@/components/CampuseCard";

import { roomList } from "@/utils/roomicon";
import "./index.less";
import "./index.scss";

export default function Index() {
  const [campuses, setCampuses] = useState<campusInfo[]>([]);
  useLoad(() => {
    getCampuses();
  });
  const getCampuses = () => {
    request.get("/api/campuses?populate=hospital").then((res) => {
      setCampuses(res.data.data);
    });
  };
  return (
    <View className='index'>
      <View className='search_box'>
        <Image className='search_icon' src={search} />
        <Input className='search_input' type='text' placeholder='搜索医院...' />
      </View>
      <View className='ask_box'>
        <View className='ask_img_box' onClick={() => {
          Taro.navigateTo({
            url: `/packages/triage/pages/quickDept/index`,
          })
        }}
        >
          <Image className='ask_img' src={fen} />
        </View>
        <View className='ask_img_box'>
          <Image className='ask_img' src={xun} />
        </View>
      </View>
      <View className='room_box'>
        <Text className='title'>按科室挂号</Text>
        <View className='room_class'>
          {roomList.map((val) => (
            <View className='room_card' key={"room" + val.name} onClick={() => {
              Taro.navigateTo({
                url: `/packages/triage/pages/selectHospital/index?dept=${val.name}`,
              })
            }}>
              <Image className='room_icon' src={val.img} />
              <Text className='room_name'>{val.name}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className='campuse_box'>
        <View className='title_box'>
          <Text className='title'>按医院挂号</Text>
          <Text className='title_tip'>共{100}家医院</Text>
        </View>
        <View className='choose_box'>
          <Text className='choose_text'>杭州市-全部区</Text>
          <Image className='choose_icon' src={choose} />
        </View>
        <View>
          {campuses.map((val, index) => (
            <View key={"campuse" + val.id}>
              {index != 0 && <View className='campuse_border'></View>}
              <View
                onClick={() =>
                  Taro.navigateTo({
                    url: `/packages/register/pages/hospitalHome/index?campuseId=${val.id}`,
                  })
                }
              >
                <CampuseCard
                  id={val.id}
                  logo={val.attributes.hospital.data.attributes.logo}
                  name={
                    val.attributes.hospital.data.attributes.name +
                    val.attributes.name
                  }
                  address={val.attributes.address}
                  lables={val.attributes.hospital.data.attributes.label}
                  distance='3.6km'
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
