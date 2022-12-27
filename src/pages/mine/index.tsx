import { View, Text, Image } from "@tarojs/components";
import unlogged_avatar from "@/assets/img/avatar_unlogged.png";
import doctor from "@/assets/img/doctor.png";
import { useState } from "react";
import { UserInfo } from "@/services/types";
import register from "@/assets/img/register.png";
import ask from "@/assets/img/ask.png";
import Taro, { useDidShow } from "@tarojs/taro";
import request from "@/services/request";
import qs from "qs";
import "./index.scss";

export default function Mine() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [collected, setCollected] = useState(0);
  const [visittings, setVisittings] = useState(0);

  // 页面加载 获取用户数据 重新渲染
  useDidShow(() => {
    // 获取用户信息
    Taro.getStorage({
      key: "user",
      success: function (res) {
        if (res.data) {
          console.log(res.data);
          setUserInfo(res.data);
          getCollected(res.data.id);
          getVisittings(res.data.id);
        }
      },
    });
  });

  // 统计收藏数量
  const getCollected = async (_userId: string) => {
    let collectedHosp = 0;
    let collectedDoc = 0;
    const _query = qs.stringify({
      populate: "*",
      filters: {
        user: {
          id: { $eq: _userId },
        },
      },
    });
    // 获取收藏医院
    await request.get(`/api/favorite-hospitals?${_query}`).then((res) => {
      // console.log("====getCollected_hospiatls_res", res.data.data[0].attributes.campuses.data[0]);
      if (res.data.data[0]) {
        collectedHosp = res.data.data[0].attributes.campuses.data.length;
      }
    });
    // 获取收藏医生
    await request.get(`/api/favorite-doctors?${_query}`).then((res) => {
      // console.log("====getCollected_doctors_res", res.data.data[0].attributes.doctors.data[0]);
      if (res.data.data[0]) {
        collectedDoc = res.data.data[0].attributes.doctors.data.length;
      }
    });
    await setCollected(collectedDoc + collectedHosp);
  };

  // 统计就诊人数量
  const getVisittings = async (_userId: string) => {
    const _query = qs.stringify({
      populate: "*",
      filters: {
        user: {
          id: { $eq: _userId },
        },
      },
    });
    await request.get(`/api/visittings?${_query}`).then((res) => {
      setVisittings(res.data.data.length);
    });
  };

  // 退出登录
  const logout = () => {
    setTimeout(() => {
      Taro.showToast({
        title: "退出登录成功",
        icon: "success",
        duration: 1000,
      });
    }, 100);
    Taro.clearStorageSync();
    // 强制刷新，同步退出登录状态
    setUserInfo(null);
  };

  return (
    <View className='index'>
      {userInfo !== null && (
        <>
          <View className='inf-box'>
            {/* 头像&&用户名&&账号 */}
            <View className='inf-detail-box'>
              <Image
                src={userInfo?.avatar ? userInfo.avatar : unlogged_avatar}
                className='avatar'
              />
              <Text className='inf-detail-header'>
                {"Hi, " + userInfo?.name}
              </Text>
              <Text className='inf-detail-font'>{"账号: " + userInfo?.id}</Text>
            </View>
            {/* role */}
            {userInfo && userInfo?.role === "Expert" && (
              <View className='role-box'>
                <Text className='role-header'>资深专家</Text>
                <Text className='role-font'>{"优先推荐中>>"}</Text>
              </View>
            )}
            {(!userInfo || userInfo?.role !== "Expert") && (
              <View className='role-box'>
                <Text className='role-header'>普通用户</Text>
                <Text className='role-font'>{"点击认证专家>>"}</Text>
              </View>
            )}
            <Image src={doctor} className='img' />
          </View>
          <View className='gray-line'></View>
          <View className='func-box'>
            {/* 我的收藏&&就诊人管理 */}
            <View className='func-line-box'>
              <View
                className='func-line-little-box'
                onClick={() =>
                  Taro.navigateTo({
                    url: `/packages/mine/pages/myCollection/index`,
                  })
                }
              >
                <Text className='func-num-font'>{collected}</Text>
                <Text className='func-name-font'>我的收藏</Text>
              </View>
              <View className='fuc-gray-line'></View>
              <View
                className='func-line-little-box'
                onClick={() =>
                  Taro.navigateTo({
                    url: "/packages/mine/pages/visittings/index",
                  })
                }
              >
                <Text className='func-num-font'>{visittings}</Text>
                <Text className='func-name-font'>就诊人管理</Text>
              </View>
            </View>
            {/* 订单管理 */}
            <View className='func-color-box'>
              <View
                className='func-color-little-box'
                onClick={() =>
                  Taro.navigateTo({ url: "/packages/mine/pages/myOrder/index" })
                }
              >
                <Text className='func-color-font'>挂号记录</Text>
                <Image src={register} className='func-color-img register-img' />
              </View>
              <View className='func-color-little-box'>
                <Text className='func-color-font'>问诊记录</Text>
                <Image src={ask} className='func-color-img ask-img' />
              </View>
            </View>
            {/* 退出登录按钮 */}
            <View className='log-out-btn' onClick={() => logout()}>
              退出登录
            </View>
          </View>
        </>
      )}
      {/* 未登录 */}
      {userInfo === null && (
        <>
          <View className='inf-box'>
            {/* 头像&&用户名&&账号 */}
            <View className='inf-detail-box'>
              <Image src={unlogged_avatar} className='avatar' />
              <Text className='inf-detail-header'>Hi, 你好～</Text>
            </View>
            {/* role */}
            <View
              className='role-box'
              onClick={() => {
                console.log(111);
                Taro.navigateTo({ url: "/packages/login/pages/log/index" });
              }}
            >
              <Text className='role-header'>未登录</Text>
              <Text className='role-font'>{"点击去登录>>"}</Text>
            </View>
            <Image src={doctor} className='img' />
          </View>
          <View className='gray-line'></View>
        </>
      )}
    </View>
  );
}
