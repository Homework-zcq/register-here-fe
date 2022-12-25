import { Component, PropsWithChildren, useState } from "react";
import { View, Text, Image, Input } from "@tarojs/components";
import "./index.less";
import "./index.scss";
import room_logo from "@/assets/icon/room_logo.png"
import qs from "qs";
import { getCurrentInstance, useLoad } from "@tarojs/taro";
import { hospitalInfo } from "@/services/types";
import request from "@/services/request";

export default function hospitalDetail() {
  const { campuseId }: any = getCurrentInstance().router?.params;
  const [hospital, setHospital] = useState<hospitalInfo>();
  const [more1, setMore1] = useState(false);
  const [more2, setMore2] = useState(false);
  useLoad(() => {
    getCampuses();
  });
  const getCampuses = () => {
    const query = qs.stringify({
      populate: {
        hospital: {
          populate: "*",
        },
      },
      filters: {
        id: { $eq: campuseId },
      },
    });
    request.get(`/api/campuses?${query}`).then((res) => {
      setHospital(res.data.data[0].attributes.hospital.data);
    });
  };

  return (
    <View className="container">
      <View className="detail_box">
        <View className="info">
          <Image
            src={hospital?.attributes.logo ? hospital?.attributes.logo : ""}
            className="logo"
          />
          <Text className="name">{hospital?.attributes.name || ""}</Text>
          <View className="hospital_lables">
            {hospital?.attributes.label &&
              hospital?.attributes.label.slice(0, 3).map((val, index) => (
                <View
                  className={"hospital_lable_box"}
                  style={
                    index == 0
                      ? "background: #5FC4A2;"
                      : index == 1
                      ? "background: #3C9DE9;"
                      : "background: #A17A5A;"
                  }
                  key={"lable" + index}
                >
                  <Text className={"hospital_lable_text1"}>{val}</Text>
                </View>
              ))}
          </View>
          <View className="line"></View>
          <Text
            className="detail"
            style={more1 ? "max-height: fit-content;" : ""}
          >
            {hospital?.attributes.desc["医院介绍"] || ""}
          </Text>
          <View
            className="shou"
            style={!more1 ? "display:none" : ""}
            onClick={() => setMore1(false)}
          >
            <Text className="shou_text">收起</Text>
          </View>
        </View>
        <View
          className="more"
          style={more1 ? "display:none" : ""}
          onClick={() => setMore1(true)}
        >
          <Text className="more_text">展示更多∨</Text>
        </View>
      </View>
      <View className="room_box">
        <View className="info">
          <View>
            <Image src={room_logo} className="name_logo"/>
          <Text className="name">特色科室</Text>

          </View>
          <Text
            className="detail"
            style={more2 ? "max-height: fit-content;" : ""}
          >
            {hospital?.attributes.desc["特色科室"] || ""}
          </Text>
          <View
            className="shou"
            style={!more2 ? "display:none" : ""}
            onClick={() => setMore2(false)}
          >
            <Text className="shou_text">收起</Text>
          </View>
        </View>
        <View
          className="more"
          style={more2 ? "display:none" : ""}
          onClick={() => setMore2(true)}
        >
          <Text className="more_text">展示更多∨</Text>
        </View>
      </View>
    </View>
  );
}
