import Dot from "@/components/Dot";
import { Visitting } from "@/services/types";
import { View, Text, Input, Picker } from "@tarojs/components";
import { useState } from "react";
import "./index.scss";

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
  const [r, setR] = useState(0);
  const [t, setT] = useState("");
  const relationList = ["配偶", "子女", "父母", "兄、弟、姐、妹"];
  const relationEnglish = ['COUPLE','CHILD','PARENT','BRO','ELSE']
  return (
    <View className="index">
      <View className="inf-box">
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">关系</Text>
          <Picker
            className={r !== -1 ? "inf-input-done" : "inf-input"}
            mode="selector"
            value={r}
            range={relationList}
            onChange={(res) => {
              console.log(res);
              setR(Number(res.detail.value))
            }}
          >
            {r !== -1 ? relationList[r] : "请选择与本人关系"}
          </Picker>
        </View>
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">就诊人姓名</Text>
          <Input
            className="inf-input"
            type="text"
            placeholder="请输入就诊人姓名"
            maxlength={10}
          />
        </View>
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">证件类型</Text>
          {t !== "" ? (
            <View className="inf-input-done">{t}</View>
          ) : (
            <View className="inf-input">请选择证件类型</View>
          )}
        </View>
        <View className="inf-little-box">
          <Dot color="blue" />
          <Text className="inf-hint">证件号</Text>
          <Input
            className="inf-input"
            type="idcard"
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
            maxlength={11}
          />
        </View>
      </View>
      <View className="btn">保存</View>
    </View>
  );
}
