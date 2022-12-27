import request from "@/services/request";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import qs from "qs";
import { useState } from "react";
import order_empty from "@/packages/mine/assets/img/order_empty.png";
import "./index.scss";

export default function Order() {
  const [type, setType] = useState("全部");
  const [allOrders, setAllOrders] = useState(null);
  const [stayOrders, setStayOrders] = useState(null);
  const [cancelOrders, setCancelOrders] = useState(null);

  useDidShow(() => {
    Taro.getStorage({
      key: "user",
      success: function (res) {
        if (res.data) {
            getOrders(res.data.id)
        }
      },
    });
  });

  const getOrders = async (_userId: string) => {
    const _query = qs.stringify({
        populate: {
            place: {
              populate: "*"
            }
        },
        filters: {
          user: {
            id: { $eq: _userId },
          },
        },
      });
      // 获取订单列表
      await request.get(`/api/orders?${_query}`).then((res) => {
        console.log(res)
      });
  }

  return (
    <View className='index'>
      <View className='nav-box'>
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
      {/* 医生列表 */}

      {/* 医院列表 */}

      {/* 为空 */}
      {((type === "全部" && allOrders === null) ||
        (type === "待就诊" && stayOrders === null) ||
        (type === "已取消" && cancelOrders === null)) && (
        <View className='null-box'>
          <Image src={order_empty} className='null-img' />
          <Text className='null-font'>暂时还没有订单哟</Text>
        </View>
      )}
    </View>
  );
}
