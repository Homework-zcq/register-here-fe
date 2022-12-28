import { useState } from "react";
import { getCurrentInstance, useLoad } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import "./index.scss";
import request from "@/services/request";
import qs from "qs";
import { registerInfo, Visitting } from "@/services/types";
import { roomChinese } from "@/utils/roomicon";
import { Loading } from "@taroify/core";
import { getWeekday } from "@/packages/process/pages/timeSelect/utils";
import cancelQC from "@/assets/icon/qcCode.png";
import Taro from "@tarojs/taro";

export default function OrderDetail() {
  const { orderId = 1 }: any = getCurrentInstance().router?.params;
  const [order, setOrder] = useState<{
    attributes: {
      cancel_time: string;
      certificate: string;
      createdAt: string;
      place: { data: registerInfo };
      publishedAt: string;
      register_time: string;
      status: string;
      updatedAt: string;
      visitting: { data: Visitting };
    };
    id: number;
  }>();
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
      setOrder(res.data.data[0]);
    });
  };
  const cancelOrder = () => {
    Taro.showLoading({
      title: "取消中...",
    });
    request
      .put(`/api/orders/${order?.id}`, {
        data: {
          status: "CANCELED",
        },
      })
      .then((_res: any) => {
        request
          .put(`/api/places/${order?.attributes.place.data.id}`, {
            data: {
              count: order?.attributes.place.data.attributes.count
                ? order?.attributes.place.data.attributes.count + 1
                : 20,
            },
          })
          .then((_r: any) => {
            Taro.hideLoading();
            Taro.showToast({
              title: "取消成功",
              icon: "success",
              duration: 2000,
            });
            getRegisterInfo();
          })
          .catch((err) => {
            console.log(err);
            Taro.hideLoading();
            Taro.showToast({
              title: "发送错误",
              icon: "error",
              duration: 1000,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        Taro.hideLoading();
        Taro.showToast({
          title: "发送错误",
          icon: "error",
          duration: 1000,
        });
      });
  };
  return (
    <View className="container">
      {order == null ? (
        <Loading type="spinner" className="custom-color" />
      ) : (
        <Text className="status">
          {order?.attributes.status == "CANCELED"
            ? "已取消"
            : order?.attributes.status == "STAY"
            ? "待就诊"
            : "已完成"}
        </Text>
      )}
      <View className="register_box">
        {order == null ? (
          <Loading type="spinner" className="custom-color" />
        ) : (
          <>
            <Text className="title">就诊信息</Text>
            <View className="item_box">
              <Text className="item_title">就诊医院</Text>
              <Text className="item_text">{`${order?.attributes.place.data.attributes.department.data.attributes.campus.data.attributes.hospital.data.attributes.name}(${order?.attributes.place.data.attributes.department.data.attributes.campus.data.attributes.name})`}</Text>
            </View>
            <View className="item_box">
              <Text className="item_title">就诊科室</Text>
              <Text className="item_text">{`${
                roomChinese[
                  order?.attributes.place.data.attributes.department.data
                    .attributes.category || ""
                ]
              }-${
                order?.attributes.place.data.attributes.department.data
                  .attributes.name
              }`}</Text>
            </View>
            <View className="item_box">
              <Text className="item_title">预约医生</Text>
              <Text className="item_text">{`${order?.attributes.place.data.attributes.doctor.data.attributes.name}(${order?.attributes.place.data.attributes.doctor.data.attributes.role})`}</Text>
            </View>
            <View className="item_box">
              <Text className="item_title">就诊日期</Text>
              <Text className="item_text">{`${
                order?.attributes.place.data.attributes.date
              } ${getWeekday(order?.attributes.place.data.attributes.date)} ${
                order?.attributes.place.data.attributes.time_period == "am"
                  ? "上午"
                  : "下午"
              }`}</Text>
            </View>
            <View className="item_box">
              <Text className="item_title">挂号费用</Text>
              <Text className="item_text">
                {order?.attributes.place.data.attributes.price + "元"}
              </Text>
            </View>
            <View className="item_box">
              <Text className="item_title">就诊人　</Text>
              <Text className="item_text">
                {order.attributes.visitting.data.attributes.name}
              </Text>
            </View>
            {order.attributes.status == "CANCELED" ? (
              <View className="item_box">
                <Text className="item_title">取消时间</Text>
                <Text className="item_text">
                  {new Date(order.attributes.cancel_time).toLocaleString()}
                </Text>
              </View>
            ) : (
              <View className="item_box">
                <Text className="item_title">预约时间</Text>
                <Text className="item_text">
                  {new Date(order.attributes.register_time).toLocaleString()}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
      {order?.attributes.status !== "USED" && (
        <View className="register_box">
          <Text className="title">就诊凭证</Text>
          {order == null ? (
            <Loading type="spinner" className="custom-color" />
          ) : (
            <View className="cert_box">
              <Image
                className="cert_img"
                src={
                  order?.attributes.status == "CANCELED"
                    ? cancelQC
                    : order?.attributes.certificate || ""
                }
              />
            </View>
          )}
        </View>
      )}
      {order?.attributes.status == "STAY" ? (
        <Button
          className="btn"
          style="background: #FF5C4D;"
          onClick={() => {
            Taro.showModal({
              title: "确定取消预约吗？",
              content: "取消预约后号源随之消失",
              cancelText: "继续就诊",
              cancelColor:"#016EFC",
              confirmText: "确认取消",
              confirmColor: "#DE3A3A",
              success: function (res) {
                if (res.confirm) {
                  console.log("用户点击确定");
                  cancelOrder();
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              },
            });
          }}
        >
          <Text className="btn_text">取消预约</Text>
        </Button>
      ) : (
        <Button
          className="btn"
          style="background: #5C8DEE;"
          onClick={() => {
            Taro.reLaunch({
              url: `/packages/process/pages/timeSelect/index?doctorId=${order?.attributes.place.data.attributes.doctor.data.id}&deptId=${order?.attributes.place.data.attributes.department.data.id}`,
            });
          }}
        >
          <Text className="btn_text">再次预约</Text>
        </Button>
      )}
    </View>
  );
}
