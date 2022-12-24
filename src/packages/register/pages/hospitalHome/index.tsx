import { Component, PropsWithChildren, useState } from "react";
import { View, Text, Image, Input, Button } from "@tarojs/components";
import "./index.less";
import "./index.scss";
import { getCurrentInstance, useLoad } from "@tarojs/taro";
import request from "@/services/request";
import phone from "@/assets/icon/phone.png";
import star from "@/assets/icon/star.png";
import star_no from "@/assets/icon/star_no.png";
import { hospitalInfo } from "@/services/types";
import qs from "qs";
import Taro from "@tarojs/taro";
import Dot from "@/components/Dot";

export default function HospitalHome() {
  const { campuseId }: any = getCurrentInstance().router?.params;

  const [hospital, setHospital] = useState<hospitalInfo>();
  const [favorites, setFavorites] = useState([]);
  useLoad(() => {
    getCampuses();
    getFavorite();
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
  const getFavorite = () => {
    const user = Taro.getStorageSync("user");
    const _query = qs.stringify({
      populate: "*",
      filters: {
        user: {
          id: { $eq: user.id },
        },
      },
    });
    // 获取收藏医院
    request.get(`/api/favorite-hospitals?${_query}`).then((res) => {
      console.log(res.data.data);
      setFavorites(res.data.data);
    });
  };
  return (
    <View className="container">
      <View className="hospital_box">
        <Image
          className="hospital_logo"
          src={hospital?.attributes.logo || ""}
        />
        <View className="hospital_right">
          <Text className="hospital_name">
            {hospital?.attributes.name || "医院名称"}
          </Text>
          <Text className="hospital_detail">
            {hospital?.attributes.desc["医院介绍"] || "医院介绍"}
          </Text>
          <View className="hospital_lables">
            {hospital?.attributes.label &&
              hospital?.attributes.label.slice(0, 3).map((val, index) => (
                <View
                  className={
                    val == "三甲"
                      ? "hospital_lable_box1"
                      : "hospital_lable_box2"
                  }
                  key={"lable" + index}
                >
                  <Text
                    className={
                      val == "三甲"
                        ? "hospital_lable_text1"
                        : "hospital_lable_text2"
                    }
                  >
                    {val}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>
      <View className="campuses_box">
        <View className="campuses_top">
          <Text className="campuses_title">院区</Text>
          <View className="campuses_phone">
            <Image className="campuses_icon" src={phone} />
            <Text className="campuses_phone_text">致电</Text>
          </View>
        </View>
        <View>
          {hospital?.attributes.campuses.data &&
            hospital?.attributes.campuses.data.map((val) => (
              <View className="campuse_box" key={"campuse" + val.id}>
                <View className="campuse_info">
                  <Image
                    className="campuse_logo"
                    src={hospital?.attributes.logo || ""}
                  />
                  <View className="campuse_info_right">
                    <View className="campuse_info_rifht_top">
                      <Text className="campuse_name">
                        {val.attributes.name}
                      </Text>
                      <Text className="campuse_distance">3.6km</Text>
                      <Image
                        src={
                          favorites.findIndex((item: any) => {
                            return item.id == val.id;
                          }) == -1
                            ? star_no
                            : star
                        }
                        className="campuse_star"
                      />
                    </View>
                    <Text className="campuse_address">
                      {val.attributes.address}
                    </Text>
                  </View>
                </View>
                <Button className="campuse_button">
                  <Text className="campuse_button_text">去挂号</Text>
                </Button>
              </View>
            ))}
        </View>
      </View>
      <View></View>
    </View>
  );
}
