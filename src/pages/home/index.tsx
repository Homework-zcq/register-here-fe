import {
  DoctorInfo,
  registerInfo,
  RegisterInfo,
  Visitting,
} from "@/services/types";
import { View, Text, Image, Swiper, SwiperItem } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useState } from "react";
import hint from "@/assets/img/hint.png";
import banner1 from "@/assets/img/banner1.png";
import banner2 from "@/assets/img/banner2.png";
import banner3 from "@/assets/img/banner3.png";
import gold from "@/assets/icon/gold.png";
import silver from "@/assets/icon/silver.png";
import bronze from "@/assets/icon/bronze.png";
import ask from "@/assets/img/home_ask.png";
import "./index.scss";
import request from "@/services/request";
import qs from "qs";

export default function Home() {
  const [orderInfo, setOrderInfo] = useState<{
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
  } | null>();
  const [welcome, setWelcome] = useState("Hi, 你好～");
  const [avatar, setAvatar] = useState("");
  const [register, setRegister] = useState("");
  const [doctorList, setDoctorList] = useState<Array<DoctorInfo> | null>(null);
  const getRegister = (_userId) => {
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
          $eq: "STAY",
        },
      },
    });
    request.get(`/api/orders?${_query}`).then((res) => {
      const list = res.data.data;
      list.sort(function (
        a: {
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
        },
        b: {
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
        }
      ) {
        const date1 = new Date(a.attributes.place.data.attributes.date);
        const date2 = new Date(b.attributes.place.data.attributes.date);
        if (date1 == date2) {
          return a.attributes.place.data.attributes.time_period == "pm"
            ? 1
            : -1;
        } else {
          return date1 > date2 ? 1 : -1;
        }
      });
      setOrderInfo(list[0]);
    });
  };
  useDidShow(() => {
    // 获取用户信息，存头像字段
    try {
      const user = Taro.getStorageSync("user");
      if (user.avatar != null) {
        setAvatar(user.avatar);
      }
      if (user.id != null) {
        getRegister(user.id);
      }
    } catch (err) {
      console.log("====err", err);
    }
    const hour = new Date().getHours();
    // 设置欢迎导语
    switch (true) {
      case hour >= 6 && hour < 13:
        setWelcome("Hi, 早上好～");
        break;
      case hour >= 13 && hour <= 18:
        setWelcome("Hi, 下午好～");
        break;
    }
    // 设置热门医生
    setDoctorList([
      {
        id: "0",
        createdAt: "2022-12-4",
        updatedAt: "2022-12-4",
        name: "赵天扬",
        hspt: "杭州牛逼医院",
        dept: "外科",
        bio: "全杭州最牛逼的医生",
      },
      {
        id: "2",
        createdAt: "2022-12-4",
        updatedAt: "2022-12-4",
        name: "勤骁",
        hspt: "杭州牛逼医院",
        dept: "神经病",
        bio: "全杭州no.2牛逼的医生",
      },
      {
        id: "1",
        createdAt: "2022-12-4",
        updatedAt: "2022-12-4",
        name: "陈伟明",
        hspt: "杭州牛逼医院",
        dept: "神经病",
        bio: "全杭州最傻逼的医生",
      },
    ]);
  });
  useEffect(() => {
    if (orderInfo != null) {
      // 设置预约提示导语
      if (
        new Date().getFullYear() ===
          Number(
            orderInfo?.attributes.place.data.attributes.date.slice(0, 4)
          ) &&
        new Date().getMonth() + 1 ===
          Number(
            orderInfo?.attributes.place.data.attributes?.date.slice(5, 7)
          ) &&
        -new Date().getDate() +
          Number(
            orderInfo?.attributes.place.data.attributes?.date.slice(8, 10)
          ) <=
          1 &&
        -new Date().getDate() +
          Number(
            orderInfo?.attributes.place.data.attributes?.date.slice(8, 10)
          ) >=
          0
      ) {
        switch (
          -new Date().getDate() +
          Number(orderInfo?.attributes.place.data.attributes?.date.slice(8, 10))
        ) {
          case 0:
            setRegister(
              "您在今日" +
                (orderInfo?.attributes.place.data.attributes.time_period == "am"
                  ? "上午"
                  : "下午") +
                "有预约 >"
            );
            break;
          case 1:
            setRegister(
              "您在明日" +
                (orderInfo?.attributes.place.data.attributes.time_period == "am"
                  ? "上午"
                  : "下午") +
                "有预约 >"
            );
            break;
        }
      } else if (
        new Date().getFullYear() ===
          Number(
            orderInfo?.attributes.place.data.attributes.date.slice(0, 4)
          ) &&
        new Date().getMonth() + 1 ===
          Number(
            orderInfo?.attributes.place.data.attributes.date.slice(5, 7)
          ) &&
        -new Date().getDate() +
          Number(
            orderInfo?.attributes.place.data.attributes.date.slice(8, 10)
          ) >
          1
      ) {
        setRegister(
          "您在" +
            orderInfo?.attributes.place.data.attributes.date.slice(5) +
            (orderInfo?.attributes.place.data.attributes.time_period == "am"
              ? "上午"
              : "下午") +
            "有预约 >"
        );
      }
    }
  }, [orderInfo]);

  return (
    <View className="index">
      {/* 欢迎栏 */}
      <View className="welcome-bar">
        <Text className="welcome-font">{welcome}</Text>
        {avatar && (
          <Image
            src={avatar}
            className="avatar"
            onClick={() =>
              Taro.switchTab({
                url: "/pages/mine/index",
              })
            }
          />
        )}
      </View>
      {/* 预约栏 */}
      {register != "" && (
        <View
          className="register-hint-bar"
          onClick={() => {
            Taro.navigateTo({
              url: `/packages/mine/pages/orderDetail/index?orderId=${orderInfo?.id}`,
            });
          }}
        >
          <Image src={hint} className="register-hint-img" />
          <Text className="register-hint-font">{register}</Text>
        </View>
      )}
      {/* 广告位 */}
      <Swiper
        className="swiper"
        circular
        autoplay
        indicatorDots
        indicatorActiveColor="#317CF4"
        indicatorColor="rgba(49, 124, 244, .55)"
      >
        <SwiperItem className="ad-box">
          <Image src={banner1} className="ad-img" />
        </SwiperItem>
        <SwiperItem className="ad-box">
          <Image src={banner2} className="ad-img" />
        </SwiperItem>
        <SwiperItem className="ad-box">
          <Image src={banner3} className="ad-img" />
        </SwiperItem>
      </Swiper>
      {/* 热门医生 */}
      <View className="recommend-box">
        <View className="recommend-title-box">
          <Text className="recommend-title-header">热门医生</Text>
          <Text
            className="recommend-hint"
            onClick={() =>
              Taro.switchTab({
                url: "/pages/register/index",
              })
            }
          >
            {"前往挂号预约>"}
          </Text>
        </View>
        {doctorList?.map((val, index) => {
          return (
            <View
              key={index}
              className="recommend-little-box"
              onClick={() => {
                Taro.reLaunch({
                  url: `/packages/process/pages/timeSelect/index?doctorId=${val.id}&deptId=1`,
                });
              }}
            >
              {index === 0 && <Image src={gold} className="recommend-icon" />}
              {index === 1 && <Image src={silver} className="recommend-icon" />}
              {index === 2 && <Image src={bronze} className="recommend-icon" />}
              <Text className="recommend-font">
                {val.name + "-" + val.dept + "专家"}
              </Text>
            </View>
          );
        })}
      </View>
      {/* 在线问诊入口 */}
      <View
        className="ask-box"
        onClick={() => {
          Taro.showToast({
            title: "暂不支持",
            icon: "error",
            duration: 1000,
          });
        }}
      >
        <Image src={ask} className="ask-img" />
        <Text className="ask-header">在线问诊</Text>
        <Text className="ask-hint">感冒头疼、疑难杂症统统全搞定～</Text>
      </View>
      {/* 缓冲问诊图片带margin-bottom造成的底部留白 */}
      <View style="height:82px"></View>
    </View>
  );
}
