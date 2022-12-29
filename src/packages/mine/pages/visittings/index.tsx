import request from "@/services/request";
import { Visitting } from "@/services/types";
import { View, Text, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import qs from "qs";
import { useState } from "react";
import edit from "@/packages/mine/assets/icon/edit.png";
import "./index.scss";

export default function Visittings() {
  const [visittingList, setVisittingList] = useState<Array<Visitting> | null>(
    null
  );

  useDidShow(() => {
    Taro.getStorage({
      key: "user",
      success: function (res) {
        if (res.data) {
          getVisittingList(res.data.id);
        }
      },
    });
  });

  // 获取就诊人列表
  const getVisittingList = (_userId: string) => {
    const _query = qs.stringify({
      populate: "*",
      filters: {
        user: {
          id: { $eq: _userId },
        },
      },
    });
    request.get(`/api/visittings?${_query}`).then((res) => {
      setVisittingList(res.data.data);
    });
  };

  return (
    <View className="index">
      <View className="visittings-box">
        {visittingList &&
          visittingList.map((val, index) => {
            const data = val.attributes;
            data.gender = data.gender === "FEMALE" ? "女" : "男";
            const id = val.id;
            return (
              <View
                key={index}
                className='visitting-box'
                onClick={() =>
                  Taro.navigateTo({
                    url: `/packages/mine/pages/visittingDetail/index?visittingId=${id}`,
                  })
                }
              >
                <View className='visitting-inf-box'>
                  <Text className='visitting-name'>
                    {new Array(data.name.length).join("*") +
                      data.name.charAt(data.name.length - 1)}
                  </Text>
                  {data.relation === "SELF" && (
                    <Text className="visitting-relation">本人</Text>
                  )}
                  {data.relation === "ELSE" && (
                    <Text className="visitting-relation">其他</Text>
                  )}
                  {data.relation === "BRO" && (
                    <Text className="visitting-relation">兄、弟、姐、妹</Text>
                  )}
                  {data.relation === "PARENT" && (
                    <Text className="visitting-relation">父母</Text>
                  )}
                  {data.relation === "CHILD" && (
                    <Text className="visitting-relation">子女</Text>
                  )}
                  {data.relation === "COUPLE" && (
                    <Text className="visitting-relation">配偶</Text>
                  )}
                  <Text className='visitting-detail-inf'>
                    {data.gender +
                      " " +
                      data.age +
                      "岁，" +
                      data.phone.replace(/(\d{3})\d*(\d{4})/, "$1****$2")}
                  </Text>
                </View>
                <Image src={edit} className="edit-icon" />
              </View>
            );
          })}
      </View>

      <View
        className='button'
        onClick={() => {
          Taro.navigateTo({
            url: "/packages/mine/pages/createVisitting/index",
          });
        }}
      >
        添加就诊人
      </View>
    </View>
  );
}
