import { useMemo, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { PageLoading } from "@/components";
import { View, Text, Image } from "@tarojs/components";
import { Avatar, Tag, Button, Loading } from "@taroify/core";
import "./index.scss";

export default function registerDetail() {
  const [read, setRead] = useState(false);
  return (
    <View className="container">
      <Text className="title">关于网络挂号须知</Text>
      <Text className="content">
        1、预约挂号只适用于已排班的专家、专病和专科门诊（本小程序提供一周内号源）。
        {"\n"}
        2、预约挂号一律采用实名制，请预约时注册个人的真实姓名、身份证号、电话号码。
        {"\n"}
        3、预约成功后，患者手机会收到预约短信通知。{"\n"}
        4、如专家因故临时变更出诊时间，门诊办应及时在HIS系统上操作停诊，患者将会收到系统发送的停诊短信通知，如患者因故未能收到停诊短信并来到医院就诊，分诊护士则安排其他同等专业及水平的专家为其就诊，如患者不同意则由导医帮助预约下次该专家的出诊。
        {"\n"}
        5、预约成功后，请于就诊当天在预约时间段前到挂号处出示预约短信并挂号，到相应科室候诊区等候叫号就诊。如果患者因故迟到未能在预约时间段到院挂号就诊，则按普通挂号候诊（迟到不计入黑名单）。
        {"\n"}
        6、一个预约挂号凭证只能挂一个号。{"\n"}
        7、如患者因故不能前来就诊，应在就诊前一天下午17：00(北京时间)以前通知患者服务中心或在网络上操作取消预约。未取消预约且不能前来就诊的患者，将作为失约处理，失约3次者，将会被系统拉入黑名单，3月后解除。
        8、预约挂号就诊时间为上午{"\n"}
        8:00—12：00，下午14:00—17:00。以上下午分别为一个预约时间段。{"\n"}
      </Text>

      <View className="footer">
        {read ? (
          <Image
            className="read_btn"
            src={require("@/assets/icon/check.png")}
            onClick={() => setRead(false)}
          />
        ) : (
          <Image
            className="read_btn"
            src={require("@/assets/icon/check_blank.png")}
            onClick={() => setRead(true)}
          />
        )}
        <Text className="gray_text" onClick={() => {}}>
          我已阅读并同意<Text className="blue_text">《关于网络挂号须知》</Text>
        </Text>
      </View>
      <Button className="btn">
        <Text className="btn_text">选择就诊人</Text>
      </Button>
    </View>
  );
}
