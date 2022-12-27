import { useState } from "react";
import { View, Text, Image, Button, Picker } from "@tarojs/components";
import "./index.less";
import "./index.scss";
import { getCurrentInstance, useLoad } from "@tarojs/taro";
import request from "@/services/request";
import phone from "@/assets/icon/phone.png";
import close from "@/assets/icon/close.png";
import star from "@/assets/icon/star.png";
import star_no from "@/assets/icon/star_no.png";
import { hospitalInfo } from "@/services/types";
import choose from "@/assets/icon/choose.png";
import qs from "qs";
import Taro from "@tarojs/taro";
import { roomList } from "@/utils/roomicon";
import "@taroify/core/dropdown-menu/style";
import Dot from "@/components/Dot";

export default function HospitalHome() {
  const { campuseId }: any = getCurrentInstance().router?.params;

  const [hospital, setHospital] = useState<hospitalInfo>();
  const [favorites, setFavorites] = useState([]);
  const [campuseChoosed, setCampuseChoosed] = useState(0);
  const [modal, setModal] = useState(false);
  const [selector, setSelector] = useState<string[]>([]);
  const [campuses, setCampuses] = useState<
    {
      attributes: {
        address: string;
        city: string;
        concat: string;
        createdAt: string;
        district: string;
        name: string;
      };
      id: number;
    }[]
  >([]);
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
      let t: any[] = [];
      const list =
        res.data.data[0].attributes.hospital.data.attributes.campuses.data;
      for (let i = 0; i < list.length; i++) {
        t.push(list[i].attributes.name);
        if (res.data.data[0].attributes.name == list[i].attributes.name)
          setCampuseChoosed(i);
      }
      console.log(list);
      setSelector(t);
      setCampuses(list);
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
      setFavorites(res.data.data);
    });
  };
  return (
    <>
      <View
        className="modal"
        style={modal ? "display: flex;" : "display: none;"}
      >
        <View className="modal_box">
          <View className="modal_top">
            <View></View>
            <Text className="modal_text">各院区电话</Text>
            <Image
              src={close}
              className="modal_close"
              onClick={() => setModal(false)}
            />
          </View>
          <View className="modal_low">
            {campuses &&
              campuses.map((val, index) => (
                <View key={"phone" + val.id}>
                  {index != 0 && <View className="line"></View>}
                  <View className="phone_item">
                    <View className="info_box">
                      <View className="dot_box">
                        <Dot color="blue" />
                      </View>
                      <View className="info">
                        <Text className="name">{val.attributes.name}</Text>
                        <Text className="phone">{val.attributes.concat}</Text>
                      </View>
                    </View>
                    <View
                      className="campuses_phone"
                      onClick={() =>
                        Taro.makePhoneCall({
                          phoneNumber: val.attributes.concat,
                        })
                      }
                    >
                      <Image className="campuses_icon" src={phone} />
                      <Text className="campuses_phone_text">致电</Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </View>
      <View className="container">
        <View className="hospital_box">
          <View className="hospital_left">
            <Image
              className="hospital_logo"
              src={hospital?.attributes.logo || ""}
            />
            <View
              onClick={() =>
                Taro.navigateTo({
                  url: `/packages/register/pages/hospitalDetail/index?campuseId=${campuseId}`,
                })
              }
            >
              <Text className="hospital_go">查看详情{">"}</Text>
            </View>
          </View>
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
            <View className="campuses_phone" onClick={() => setModal(true)}>
              <Image className="campuses_icon" src={phone} />
              <Text className="campuses_phone_text">致电</Text>
            </View>
          </View>
          <View>
            {campuses &&
              campuses.map((val) => (
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
                  <Button
                    className="campuse_button"
                    onClick={() =>
                      Taro.navigateTo({
                        url: `/packages/register/pages/departmentChoose/index?campuseId=${val.id}`,
                      })
                    }
                  >
                    <Text className="campuse_button_text">去挂号</Text>
                  </Button>
                </View>
              ))}
          </View>
        </View>
        <View className="room_box">
          <View className="room_box_top">
            <Text className="title">热门科室</Text>
            <Picker
              mode="selector"
              range={selector}
              onChange={(val) => {
                setCampuseChoosed(Number(val.detail.value));
              }}
              className="choose_box"
            >
              <Text className="choose_text">{selector[campuseChoosed]}</Text>
              <Image className="choose_icon" src={choose} />
            </Picker>
          </View>
          <View className="room_class">
            {roomList.map((val) => (
              <View className="room_card" key={"room" + val.name}>
                <Image className="room_icon" src={val.img} />
                <Text className="room_name">{val.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}
