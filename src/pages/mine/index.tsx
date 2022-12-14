import { View, Text, Image } from "@tarojs/components";
import default_avatar from "@/assets/img/avatar.png";
import doctor from "@/assets/img/doctor.png";
import { useEffect, useState } from "react";
import { UserInfo } from "@/services/types";
import register from "@/assets/img/register.png";
import ask from "@/assets/img/ask.png";
import "./index.scss";

export default function Mine() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>({
    id: "Ex20200132an",
    createdAt: "2020-02-24",
    updatedAt: "2020-12-13",
    name: "Avril",
    avatar: {default_avatar},
    role: "Expert",
  });

  useEffect(() => {
    console.log("======userInfo: ",userInfo)
  },[])

  return (
    <View className='index'>

      <View className='inf-box'>
        {/* 头像&&用户名&&账号 */}
        <View className='inf-detail-box'>
          <Image
            src={default_avatar}
            className='avatar'
          />
          <Text className='inf-detail-header'>{"Hi, " + userInfo?.name}</Text>
          <Text className='inf-detail-font'>{"账号: " + userInfo?.id}</Text>
        </View>
        {/* role */}
        {
          userInfo && userInfo?.role === "Expert" &&
          <View className='role-box'>
            <Text className='role-header'>资深专家</Text>
            <Text className='role-font'>{"优先推荐中>>"}</Text>
          </View>
        }
        {
          (!userInfo || userInfo?.role !== "Expert") &&
          <View className='role-box'>
            <Text className='role-header'>普通用户</Text>
            <Text className='role-font'></Text>
          </View>
        }
        <Image src={doctor} className='img' />
      </View>

      <View className='gray-line'></View>
  
      <View className='func-box'>
        {/* 我的收藏&&就诊人管理 */}
        <View className='func-line-box'>
          <View className='func-line-little-box'>
            <Text className='func-num-font'>27</Text>
            <Text className='func-name-font'>我的收藏</Text>
          </View>
          <View className='fuc-gray-line'></View>
          <View className='func-line-little-box'>
            <Text className='func-num-font'>3</Text>
            <Text className='func-name-font'>就诊人管理</Text>
          </View>
        </View>
        {/* 订单管理 */}
        <View className='func-color-box'>
          <View className='func-color-little-box'>
            <Text className='func-color-font'>挂号记录</Text>
            <Image src={register} className='func-color-img register-img' />
          </View>
          <View className='func-color-little-box'>
            <Text className='func-color-font'>问诊记录</Text>
            <Image src={ask} className='func-color-img ask-img' />
          </View>
        </View>
        {/* 退出登录按钮 */}
        <View className='log-out-btn'>退出登录</View>
      </View>
    </View>
  );
}
