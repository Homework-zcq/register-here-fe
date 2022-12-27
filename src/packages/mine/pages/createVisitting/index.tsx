import Dot from "@/components/Dot";
import request from "@/services/request";
import { Visitting } from "@/services/types";
import { View, Text, Input, Picker } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import "./index.scss";
const analyzeIDCard = (IDCord: string) => {
  var sexAndAge = { sex: "", age: 0 };
  //获取用户身份证号码
  var userCard = IDCord;
  //如果用户身份证号码为undefined则返回空
  if (!userCard) {
    return sexAndAge;
  }

  // 获取性别
  if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
    sexAndAge.sex = "MALE";
  } else {
    sexAndAge.sex = "FEMALE";
  }

  // 获取出生日期
  // userCard.substring(6,10) + "-" + userCard.substring(10,12) + "-" + userCard.substring(12,14)
  var yearBirth = userCard.substring(6, 10);
  var monthBirth = userCard.substring(10, 12);
  var dayBirth = userCard.substring(12, 14);
  // 获取当前年月日并计算年龄
  var myDate = new Date();
  var monthNow = myDate.getMonth() + 1;
  var dayNow = myDate.getDate();
  var age = myDate.getFullYear() - Number(yearBirth);
  if (
    monthNow < Number(monthBirth) ||
    (monthNow == Number(monthBirth) && dayNow < Number(dayBirth))
  ) {
    age--;
  }
  // 得到年龄
  sexAndAge.age = age;
  // 返回 性别和年龄
  return sexAndAge;
};
export default function CreateVisitting() {
  const [visitting, setVisitting] = useState<Visitting>({
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
  const [r, setR] = useState("");
  const [t, setT] = useState("");
  const [name, setName] = useState("");
  const [IDNum, setIDNum] = useState("");
  const [phone, setPhone] = useState("");
  const relationList = ["配偶", "子女", "父母", "兄、弟、姐、妹", "其他"];
  const relationEnglish = ["COUPLE", "CHILD", "PARENT", "BRO", "ELSE"];
  const commit = () => {
    if (name == "") {
      Taro.showToast({
        title: "姓名为空",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    if (r == "") {
      Taro.showToast({
        title: "未选择关系",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    if (t == "") {
      Taro.showToast({
        title: "未选择证件类型",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    if (IDNum == "") {
      Taro.showToast({
        title: "证件号为空",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    if (phone == "") {
      Taro.showToast({
        title: "手机号为空",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    if (IDNum.length !== 18 && IDNum.length !== 15) {
      Taro.showToast({
        title: "证件号有误",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    try {
      const user = Taro.getStorageSync("user");
      Taro.showLoading();
      const a_g = analyzeIDCard(IDNum);
      const data = {
        data: {
          user: user.id,
          name: name,
          id_num: IDNum,
          phone: phone,
          relation: relationEnglish[relationList.findIndex((val) => val == r)],
          age: a_g.age,
          gender: a_g.sex,
        },
      };
      request.post("/api/visittings", data).then((_res: any) => {
        Taro.hideLoading();
        Taro.showToast({
          title: "提交成功",
          icon: "success",
          duration: 2000,
        });
        setTimeout(function () {
          Taro.navigateBack();
        }, 1000);
      });
    } catch (err) {
      console.log("====err", err);
    }
  };
  return (
    <View className="index">
      <View className="inf-box">
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">关系</Text>
          <Picker
            className={r !== "" ? "inf-input-done" : "inf-input"}
            mode="selector"
            range={relationList}
            onChange={(res) => {
              setR(relationList[Number(res.detail.value)]);
            }}
          >
            {r !== "" ? r : "请选择与本人关系"}
          </Picker>
        </View>
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">就诊人姓名</Text>
          <Input
            className="inf-input"
            type="text"
            placeholder="请输入就诊人姓名"
            onInput={(e): void => {
              const { value } = e.detail;
              setName(value);
            }}
            maxlength={10}
          />
        </View>
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">证件类型</Text>
          <Picker
            className={t !== "" ? "inf-input-done" : "inf-input"}
            mode="selector"
            range={["身份证"]}
            onChange={() => {
              setT("身份证");
            }}
          >
            {t !== "" ? t : "请选择证件类型"}
          </Picker>
        </View>
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">证件号</Text>
          <Input
            className="inf-input"
            type="idcard"
            onInput={(e): void => {
              const { value } = e.detail;
              setIDNum(value);
            }}
            placeholder="请输入证件号码"
          />
        </View>
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">联系电话</Text>
          <Input
            className="inf-input"
            type="number"
            placeholder="用于接收短信通知"
            onInput={(e): void => {
              const { value } = e.detail;
              setPhone(value);
            }}
            maxlength={11}
          />
        </View>
      </View>
      <View className="btn" onClick={commit}>
        保存
      </View>
    </View>
  );
}
