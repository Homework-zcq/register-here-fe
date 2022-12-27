import { useMemo, useState } from "react";
import Taro, { getCurrentInstance, useDidShow, useLoad } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import request from "@/services/request";
import qs from "qs";
import { registerInfo, Visitting } from "@/services/types";
import { relationList, roomChinese } from "@/utils/roomicon";
import check from "@/assets/icon/check_blue.png";
import check_blank from "@/assets/icon/check_blue_blank.png";
import edit from "@/packages/mine/assets/icon/edit.png";
import add from "@/assets/icon/add_blue.png";
import { getWeekday } from "../timeSelect/utils";

export default function registerConfirm() {
  const { placeId = 1 }: any = getCurrentInstance().router?.params;
  const [visittingList, setVisittingList] = useState<Array<Visitting>>([]);
  const [checkId, setCheckId] = useState(0);
  const [register, setRegister] = useState<registerInfo>();
  useLoad(() => {
    getRegisterInfo();
  });
  useDidShow(() => {
    Taro.getStorage({
      key: "user",
      success: function (res) {
        if (res.data) {
          getVisittingList(res.data.id);
        }
      },
    });
  });
  const submit = () => {
    Taro.showLoading({
      title: "提交中...",
    });
    try {
      const user = Taro.getStorageSync("user");
      const data = {
        data: {
          user: user.id,
          visitting: checkId,
          place: placeId,
          status: "STAY",
          register_time: new Date(),
          certificate: "https://i.328888.xyz/2022/12/27/UCNDp.jpeg",
        },
      };
      request.post("/api/orders", data).then((res) => {
        console.log(res);
        Taro.hideLoading();
        Taro.showToast({
          title: "提交成功",
          icon: "success",
          duration: 2000,
        });
        setTimeout(function () {
          Taro.navigateTo({
            url: `/packages/process/pages/registerSuccess/index?orderId=${res.data.data.id}`,
          });
        }, 1000);
      });
    } catch (err) {
      console.log("====err", err);
    }
  };
  const getRegisterInfo = () => {
    const _query = qs.stringify({
      populate: {
        department: {
          populate: {
            campus: {
              populate: "*",
            },
          },
        },
        doctor: {
          populate: "*",
        },
      },
      filters: {
        id: { $eq: placeId },
      },
    });
    request.get(`/api/places?${_query}`).then((res) => {
      console.log("====getVL_res", res.data.data);
      setRegister(res.data.data[0]);
    });
  };
  // 获取就诊人列表
  const getVisittingList = (_userId: string) => {
    const _query = qs.stringify({
      populate: "*",
      filters: {
        user: {
          id: { $eq: _userId },
        },
      },
    });
    request.get(`/api/visittings?${_query}`).then((res) => {
      console.log("====getVL_res", res.data.data);
      setVisittingList(res.data.data);
      setCheckId(res.data.data[0].id);
    });
  };
  return (
    <View className="container">
      <View className="register_box">
        <Text className="title">就诊信息</Text>
        <View className="item_box">
          <Text className="item_title">就诊医院</Text>
          <Text className="item_text">{`${register?.attributes.department.data.attributes.campus.data.attributes.hospital.data.attributes.name}(${register?.attributes.department.data.attributes.campus.data.attributes.name})`}</Text>
        </View>
        <View className="item_box">
          <Text className="item_title">就诊科室</Text>
          <Text className="item_text">{`${
            roomChinese[
              register?.attributes.department.data.attributes.category || ""
            ]
          }-${register?.attributes.department.data.attributes.name}`}</Text>
        </View>
        <View className="item_box">
          <Text className="item_title">预约医生</Text>
          <Text className="item_text">{`${register?.attributes.doctor.data.attributes.name}(${register?.attributes.doctor.data.attributes.role})`}</Text>
        </View>
        <View className="item_box">
          <Text className="item_title">就诊日期</Text>
          <Text className="item_text">{`${
            register?.attributes.date
          } ${getWeekday(register?.attributes.date)} ${
            register?.attributes.time_period == "am" ? "上午" : "下午"
          }`}</Text>
        </View>
        <View className="item_box">
          <Text className="item_title">挂号费用</Text>
          <Text className="item_text">{register?.attributes.price + "元"}</Text>
        </View>
      </View>
      <View className="visiting_box">
        <View className="title_box">
          <Text className="title">就诊人</Text>
          <View
            className="add_box"
            onClick={() => {
              Taro.navigateTo({
                url: "/packages/mine/pages/createVisitting/index",
              });
            }}
          >
            <Image src={add} className="add_icon" />
            <Text className="add_text">添加就诊人</Text>
          </View>
        </View>
        {visittingList.map((val) => (
          <View className="visiting_item">
            <View style="display: flex;">
              <Image
                className="check_icon"
                onClick={() => setCheckId(Number(val.id))}
                src={Number(val.id) == checkId ? check : check_blank}
              />
              <View className="info_box">
                <View className="top">
                  <Text className="name">
                    {new Array(val.attributes.name.length).join("*") +
                      val.attributes.name.charAt(
                        val.attributes.name.length - 1
                      )}
                  </Text>
                  <Text className="relation">
                    {relationList[val.attributes.relation]}
                  </Text>
                </View>
                <Text className="tip">{`${
                  val.attributes.gender === "FEMALE" ? "女" : "男"
                } ${val.attributes.age}岁，${val.attributes.phone.replace(
                  /(\d{3})\d*(\d{4})/,
                  "$1****$2"
                )}`}</Text>
              </View>
            </View>
            <Image
              src={edit}
              onClick={() =>
                Taro.navigateTo({
                  url: `/packages/mine/pages/visittingDetail/index?visittingId=${val.id}`,
                })
              }
              className="edit_icon"
            />
          </View>
        ))}
      </View>
      <View id="btn" onClick={submit}>
        <Text id="btn_text">确认预约</Text>
      </View>
    </View>
  );
}
