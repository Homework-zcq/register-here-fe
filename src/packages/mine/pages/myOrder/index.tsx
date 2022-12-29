import request from "@/services/request";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import qs from "qs";
import { useState } from "react";
import order_empty from "@/packages/mine/assets/img/order_empty.png";
import "./index.scss";
import { useEffect } from "react";
import { registerInfo, Visitting } from "@/services/types";
import { roomChinese } from "@/utils/roomicon";
import { getWeekday } from "@/packages/process/pages/timeSelect/utils";

export default function MyOrder() {
  const [type, setType] = useState("全部");
  const [orders, setOrders] = useState<
    {
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
    }[]
  >([]);
  useDidShow(() => {
    setType("全部");
    Taro.getStorage({
      key: "user",
      success: function (res) {
        if (res.data) {
          getOrders(res.data.id, "全部");
        }
      },
    });
  });
  useEffect(() => {
    Taro.getStorage({
      key: "user",
      success: function (res) {
        if (res.data) {
          getOrders(res.data.id, type);
        }
      },
    });
  }, [type]);

  const getOrders = (_userId: string, _type: string) => {
    Taro.showLoading({
      title: "加载中...",
    });
    if (_type == "全部") {
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
          user: {
            id: { $eq: _userId },
          },
        },
      });
      // 获取订单列表
      request.get(`/api/orders?${_query}`).then((res) => {
        Taro.hideLoading();
        setOrders(res.data.data);
      });
    } else {
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
          user: {
            id: { $eq: _userId },
          },
          status: {
            $eq: type == "待就诊" ? "STAY" : "CANCELED",
          },
        },
      });
      request.get(`/api/orders?${_query}`).then((res) => {
        Taro.hideLoading();
        setOrders(res.data.data);
      });
    }
  };

  return (
    <View className="index">
      <View className="nav-box">
        <View
          className={type === "全部" ? "nav-choosed" : "nav-unchoosed"}
          onClick={() => setType("全部")}
        >
          全部
        </View>
        <View
          className={type === "待就诊" ? "nav-choosed" : "nav-unchoosed"}
          onClick={() => setType("待就诊")}
        >
          待就诊
        </View>
        <View
          className={type === "已取消" ? "nav-choosed" : "nav-unchoosed"}
          onClick={() => setType("已取消")}
        >
          已取消
        </View>
      </View>
      {/* 订单列表 */}
      {orders.length === 0 ? (
        <View className="null-box">
          <Image src={order_empty} className="null-img" />
          <Text className="null-font">暂时还没有订单哟</Text>
        </View>
      ) : (
        <View className="order_box">
          {orders.map((val) => (
            <View
              key={"order" + val.id}
              className="order_item"
              onClick={() => {
                Taro.navigateTo({
                  url: `/packages/mine/pages/orderDetail/index?orderId=${val.id}`,
                });
              }}
              style={
                val.attributes.status == "CANCELED"
                  ? "background: #EEEEEE;"
                  : "background: #EEF4FF;"
              }
            >
              <Text className="order_title">{`${val.attributes.place.data.attributes.department.data.attributes.campus.data.attributes.hospital.data.attributes.name}(${val.attributes.place.data.attributes.department.data.attributes.campus.data.attributes.name})`}</Text>
              <View className="order_line"></View>
              <Text className="order_place">{`${
                roomChinese[
                  val.attributes.place.data.attributes.department.data
                    .attributes.category || ""
                ]
              }-${
                val.attributes.place.data.attributes.department.data.attributes
                  .name
              }`}</Text>
              <View className="order_tip_box">
                <Text className="order_tip_title">就诊时间</Text>
                <Text className="order_tip_text">{`${
                  val.attributes.place.data.attributes.date
                } ${getWeekday(val.attributes.place.data.attributes.date)} ${
                  val.attributes.place.data.attributes.time_period == "am"
                    ? "上午"
                    : "下午"
                }`}</Text>
              </View>
              <View className="order_tip_box">
                <Text className="order_tip_title">订单创建时间</Text>
                <Text className="order_tip_text">
                  {new Date(val.attributes.register_time).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
