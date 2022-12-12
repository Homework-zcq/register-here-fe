import { View, Text, Image } from "@tarojs/components";
import default_avatar from "@/assets/img/avatar.png";
import doctor from "@/assets/img/doctor.png";
import { useEffect, useState } from "react";
import { UserInfo } from "@/services/types";
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
    </View>
  );
}
