import { useMemo, useState } from "react";
import Taro, { getCurrentInstance, useDidShow, useLoad } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import request from "@/services/request";
import qs from "qs";
import { registerInfo, Visitting } from "@/services/types";
import { roomChinese } from "@/utils/roomicon";
import { getWeekday } from "../timeSelect/utils";
import success from "@/assets/icon/success.png";
import { Loading } from "@taroify/core";

export default function registerSuccess() {
  const { orderId = 1 }: any = getCurrentInstance().router?.params;
  const [registerInf, setRegisterInfo] = useState<registerInfo>();
  const [visittingInfo, setVisittingInfo] = useState<Visitting>({
    id: "",
    attributes: {
      id_num: "",
      name: "",
      phone: "",
      relation: "",
      gender: "",
      age: 0,
    },
  });
  useLoad(() => {
    getRegisterInfo();
  });
  const getRegisterInfo = () => {
    const _query = qs.stringify({
      populate: {
        place: {
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
        },
        visitting: {
          populate: "*",
        },
      },
      filters: {
        id: { $eq: orderId },
      },
    });
    request.get(`/api/orders?${_query}`).then((res) => {
      console.log("====getVL_res", res.data.data);
      setRegisterInfo(res.data.data[0].attributes.place.data);
      setVisittingInfo(res.data.data[0].attributes.visitting.data);
    });
  };
  return (
    <View className="container">
      <View className="success_box">
        <Image className="success_icon" src={success} />
        <Text className="success_text">预约成功</Text>
      </View>
      <View className="register_box">
        {registerInf == null ? (
          <Loading type="spinner" className="custom-color" />
        ) : (
          <>
            <Text className="title">预约信息</Text>
            <View className="item_box">
              <Text className="item_title">就诊医院</Text>
              <Text className="item_text">{`${registerInf?.attributes.department.data.attributes.campus.data.attributes.hospital.data.attributes.name}(${registerInf?.attributes.department.data.attributes.campus.data.attributes.name})`}</Text>
            </View>
            <View className="item_box">
              <Text className="item_title">就诊科室</Text>
              <Text className="item_text">{`${
                roomChinese[
                  registerInf?.attributes.department.data.attributes.category ||
                    ""
                ]
              }-${
                registerInf?.attributes.department.data.attributes.name
              }`}</Text>
            </View>
            <View className="item_box">
              <Text className="item_title">预约医生</Text>
              <Text className="item_text">{`${registerInf?.attributes.doctor.data.attributes.name}(${registerInf?.attributes.doctor.data.attributes.role})`}</Text>
            </View>
            <View className="item_box">
              <Text className="item_title">就诊日期</Text>
              <Text className="item_text">{`${
                registerInf?.attributes.date
              } ${getWeekday(registerInf?.attributes.date)} ${
                registerInf?.attributes.time_period == "am" ? "上午" : "下午"
              }`}</Text>
            </View>
            <View className="item_box">
              <Text className="item_title">挂号费用</Text>
              <Text className="item_text">
                {registerInf?.attributes.price + "元"}
              </Text>
            </View>
            <View className="item_box">
              <Text className="item_title">就诊人　</Text>
              <Text className="item_text">{visittingInfo.attributes.name}</Text>
            </View>
          </>
        )}
      </View>
      <View className="btn_box">
        <View
          className="btn"
          onClick={() => {
            Taro.reLaunch({
              url: `/packages/mine/pages/orderDetail/index?orderId=${orderId}`,
            });
          }}
        >
          <Text className="btn_text">查看凭证</Text>
        </View>
        <View
          className="btn"
          onClick={() => {
            Taro.reLaunch({
              url: "/pages/home/index",
            });
          }}
        >
          <Text className="btn_text">返回主页</Text>
        </View>
      </View>
    </View>
  );
}
