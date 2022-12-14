import { DoctorInfo, RegisterInfo } from "@/services/types";
import { View, Text, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState } from "react";
import hint from "@/assets/img/hint.png";
import ad from "@/assets/img/ad.png";
import gold from "@/assets/icon/gold.png";
import silver from "@/assets/icon/silver.png";
import bronze from "@/assets/icon/bronze.png";
import ask from "@/assets/img/home_ask.png";
import "./index.scss";

export default function Home() {
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo | null>({
    id: "",
    createdAt: "2022-12-09",
    updatedAt: "2022-12-09",
    date: "2022-12-15",
    timePart: "上午",
  });
  const [welcome, setWelcome] = useState("Hi, 你好～");
  const [avatar, setAvatar] = useState("");
  const [register, setRegister] = useState("");
  const [doctorList, setDoctorList] = useState<Array<DoctorInfo> | null>(null);

  useDidShow(() => {
    console.log("=====register", registerInfo);
    setAvatar(Taro.getStorageSync("user").avatar);
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
    // 设置预约提示导语
    if (
      new Date().getFullYear() === Number(registerInfo?.date.slice(0, 4)) &&
      new Date().getMonth() + 1 === Number(registerInfo?.date.slice(5, 7)) &&
      -new Date().getDate() + Number(registerInfo?.date.slice(8, 10)) <= 1
    ) {
      switch (-new Date().getDate() + Number(registerInfo?.date.slice(8, 10))) {
        case 0:
          setRegister("您在今日" + registerInfo?.timePart + "有预约 >");
          break;
        case 1:
          setRegister("您在明日" + registerInfo?.timePart + "有预约 >");
          break;
      }
    } else {
      setRegister(
        "您在" + registerInfo?.date + registerInfo?.timePart + "有预约 >"
      );
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
        id: "1",
        createdAt: "2022-12-4",
        updatedAt: "2022-12-4",
        name: "卢易",
        hspt: "杭州牛逼医院",
        dept: "心理学科",
        bio: "全杭州no.2牛逼的医生",
      },
      {
        id: "2",
        createdAt: "2022-12-4",
        updatedAt: "2022-12-4",
        name: "陈伟明",
        hspt: "杭州牛逼医院",
        dept: "脑科",
        bio: "全杭州最傻逼的医生",
      },
    ]);
  });

  return (
    <View className='index'>
      {/* 欢迎栏 */}
      <View className='welcome-bar'>
        <Text className='welcome-font'>{welcome}</Text>
        {avatar && <Image src={avatar} className='avatar' />}
        {!avatar && <View className='avatar'></View>}
      </View>
      {/* 预约栏 */}
      {registerInfo != null && (
        <View className='register-hint-bar'>
          <Image src={hint} className='register-hint-img' />
          <Text className='register-hint-font'>{register}</Text>
        </View>
      )}
      {/* 广告位 */}
      <View className='ad-box'>
        <Text className='ad-font'>广告位</Text>
        <Image src={ad} className='ad-img' />
      </View>
      {/* 热门医生 */}
      <View className='recommend-box'>
        <View
          className='recommend-title-box'
          onClick={() =>
            Taro.switchTab({
              url: "/pages/register/index",
            })
          }
        >
          <Text className='recommend-title-header'>热门医生</Text>
          <Text className='recommend-hint'>{"前往挂号预约>"}</Text>
        </View>
        {doctorList?.map((val, index) => {
          return (
            <View key={index} className='recommend-little-box'>
              {index === 0 && <Image src={gold} className='recommend-icon' />}
              {index === 1 && <Image src={silver} className='recommend-icon' />}
              {index === 2 && <Image src={bronze} className='recommend-icon' />}
              <Text className='recommend-font'>
                {val.name + "-" + val.dept + "专家"}
              </Text>
            </View>
          );
        })}
      </View>
      {/* 在线问诊入口 */}
      <View className='ask-box'>
        <Image src={ask} className='ask-img' />
        <Text className='ask-header'>在线问诊</Text>
        <Text className='ask-hint'>感冒头疼、疑难杂症统统全搞定～</Text>
      </View>
      {/* 缓冲问诊图片带margin-bottom造成的底部留白 */}
      <View style='height:82px'></View>
    </View>
  );
}
