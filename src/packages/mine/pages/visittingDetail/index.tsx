import request from "@/services/request";
import { Visitting } from "@/services/types";
import { Loading } from "@taroify/core";
import { View, Text } from "@tarojs/components";
import Taro, { getCurrentInstance, useDidShow } from "@tarojs/taro";
import { isEmpty } from "lodash";
import qs from "qs";
import { useState } from "react";
import "./index.scss";

declare var wx: any;

export default function VisittingDetail() {
  const { visittingId }: any = getCurrentInstance().router?.params;
  const [visitting, setVisitting] = useState<Visitting>();

  useDidShow(() => {
    getVisitting();
    console.log("=======", isEmpty(visitting));
  });

  // 获取就诊人信息
  const getVisitting = () => {
    const _query = qs.stringify({
      populate: "*",
      filters: {
        id: { $eq: visittingId },
      },
    });
    request.get(`/api/visittings?${_query}`).then((res) => {
      const tmp = res.data.data[0];
      tmp.attributes.gender = tmp.attributes.gender === "FEMALE" ? "女" : "男";
      setVisitting(tmp);
    });
  };

  // 删除就诊人
  const deleteVisitting = () => {
    request.delete(`/api/visittings/${visittingId}`).then((res) => {
      if (res.statusCode === 200) {
        Taro.showToast({
          title: "删除成功",
          icon: "success",
          duration: 2000,
        });
        Taro.navigateBack();
      }
    });
  };

  // 编辑就诊人信息
  const editVisitting = (_phone: string) => {
    request
      .put(`/api/visittings/${visittingId}`, {
        data: { phone: Number(_phone) },
      })
      .then((res) => {
        if (res.statusCode === 200) {
          Taro.hideLoading();
          Taro.showToast({
            title: "修改成功",
            icon: "success",
            duration: 2000,
          });
        } else {
          throw "err";
        }
      })
      .catch(() => {
        Taro.showToast({
          title: "修改失败",
          icon: "error",
          duration: 2000,
        });
      });
  };

  return (
    <View className='index'>
      {isEmpty(visitting) ? (
        <Loading type='spinner' className='custom-color loading' />
      ) : (
        <View className='inf-box'>
          <View className='base-inf-box'>
            <Text className='name-font'>{visitting.attributes.name}</Text>
            {visitting.attributes.relation === "SELF" && (
              <Text className='visitting-relation wrap'>本人</Text>
            )}
            {visitting.attributes.relation === "ELSE" && (
              <Text className='visitting-relation wrap'>其他</Text>
            )}
            {visitting.attributes.relation === "BRO" && (
              <Text className='visitting-relation wrap'>兄、弟、姐、妹</Text>
            )}
            {visitting.attributes.relation === "PARENT" && (
              <Text className='visitting-relation wrap'>父母</Text>
            )}
            {visitting.attributes.relation === "CHILD" && (
              <Text className='visitting-relation wrap'>子女</Text>
            )}
            {visitting.attributes.relation === "COUPLE" && (
              <Text className='visitting-relation wrap'>配偶</Text>
            )}
            <Text className='inf-font wrap'>
              {visitting.attributes.gender +
                " " +
                visitting.attributes.age +
                "岁"}
            </Text>
            <Text className='inf-font'>
              {visitting.attributes.id_num.replace(
                /(\d{1})\d*(\d{1})/,
                "$1****************$2"
              )}
            </Text>
          </View>
          <View
            className='phone-box'
            onClick={() => {
              wx.showModal({
                title: "请输入新手机号",
                cancelText: "取消",
                cancelColor: "#016EFC",
                confirmText: "保存",
                confirmColor: "#DE3A3A",
                placeholderText: "该手机号用于接收就诊短信通知",
                editable: true,
                showCancel: true,
                success(res) {
                  if (res.confirm) {
                    if (res.content.length !== 11) {
                      Taro.showToast({
                        title: "手机号不合法",
                        icon: "error",
                        duration: 2000,
                      });
                    } else {
                      Taro.showLoading({
                        title: "修改中",
                      });
                      editVisitting(res.content);
                    }
                  }
                },
              });
            }}
          >
            <Text className='phone-font'>手机号码</Text>
            <Text className='hint-font'>用于接收就诊短信通知</Text>
            <Text className='phone-font'>
              {visitting.attributes.phone.replace(
                /(\d{3})\d*(\d{4})/,
                "$1****$2"
              )}
            </Text>
            <Text className='phone-btn'>修改手机</Text>
          </View>
        </View>
      )}
      {!isEmpty(visitting) && (
        <View
          className='btn'
          onClick={() =>
            wx.showModal({
              title: "确定删除该就诊人？",
              cancelText: "取消",
              cancelColor: "#016EFC",
              confirmText: "确定删除",
              confirmColor: "#DE3A3A",
              content: "删除后该就诊人的就诊相关记录将会消失，确定删除吗？",
              showCancel: true,
              success(res) {
                if (res.confirm) {
                  deleteVisitting();
                }
              },
            })
          }
        >
          删除就诊人
        </View>
      )}
    </View>
  );
}
