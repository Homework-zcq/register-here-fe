import request from "@/services/request";
import { CollectedDoctor, CollectedHspt } from "@/services/types";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import qs from "qs";
import { useState } from "react";
import collected_empty from "@/packages/mine/assets/img/collected_empty.png";
import "./index.scss";

export default function Collection() {
  const [type, setType] = useState("我的医院");
  const [doctorList, setDoctorList] = useState<Array<CollectedDoctor> | null>(
    null
  );
  const [hsptList, setHsptList] = useState<Array<CollectedHspt> | null>(null);

  useDidShow(() => {
    Taro.getStorage({
      key: "user",
      success: function (res) {
        if (res.data) {
          getDoctors(res.data.id);
          getHospitals(res.data.id);
        }
      },
    });
  });

  // 获取收藏医院列表
  const getHospitals = async (_userId: string) => {
    const _query = qs.stringify({
      populate: {
        campuses: {
          populate: "*",
        },
        user: {
          populate: "*",
        },
      },
      filters: {
        user: {
          id: { $eq: _userId },
        },
      },
    });
    // 获取收藏医院
    await request.get(`/api/favorite-hospitals?${_query}`).then((res) => {
      console.log("====hos", res.data.data[0].attributes.campuses.data);
      let tmpList: Array<CollectedHspt> | null = null;
      // 数据处理
      res.data.data[0].attributes.campuses.data.map((val) => {
        console.log(val.attributes.hospital.data.attributes.name);
        if (tmpList) {
          tmpList = [
            ...tmpList,
            {
              hId: val.attributes.hospital.data.id, // 医院id
              cId: val.id, // 院区id
              name: val.attributes.name
                ? val.attributes.hospital.data.attributes.name +
                  "(" +
                  val.attributes.name +
                  ")"
                : val.attributes.hospital.data.attributes.name, // 全名（医院+院区拼接）如果院区没有名字则忽略
              contact: val.attributes.concat,
              address: val.attributes.address,
              logo: val.attributes.hospital.data.attributes.logo,
            },
          ];
        } else {
          tmpList = [
            {
              hId: val.attributes.hospital.data.id, // 医院id
              cId: val.id, // 院区id
              name: val.attributes.name
                ? val.attributes.hospital.data.attributes.name +
                  "(" +
                  val.attributes.name +
                  ")"
                : val.attributes.hospital.data.attributes.name, // 全名（医院+院区拼接）如果院区没有名字则忽略
              contact: val.attributes.concat
                ? val.attributes.concat
                : val.attributes.hospital.data.attributes.concat, // 优先取医院电话，院区电话次之
              address: val.attributes.hospital.data.attributes.address // 优先取医院地址，院区地址次之
                ? val.attributes.hospital.data.attributes.address
                : val.attributes.address,
              logo: val.attributes.hospital.data.attributes.logo,
            },
          ];
        }
      });
      setHsptList(tmpList);
    });
  };

  // 获取收藏医生列表
  const getDoctors = async (_userId: string) => {
    const _query = qs.stringify({
      populate: "*",
      filters: {
        user: {
          id: { $eq: _userId },
        },
      },
    });
    // 获取收藏医生
    await request.get(`/api/favorite-doctors?${_query}`).then((res) => {
      console.log(res);
      if (res.data.data[0].attributes.doctors.data) {
        setDoctorList(res.data.data[0].attributes.doctors.data);
      }
    });
  };

  return (
    <View className="index">
      <View className="nav-box">
        <View
          className={type === "我的医院" ? "nav-choosed" : "nav-unchoosed"}
          onClick={() => setType("我的医院")}
        >
          我的医院
        </View>
        <View
          className={type === "我的医生" ? "nav-choosed" : "nav-unchoosed"}
          onClick={() => setType("我的医生")}
        >
          我的医生
        </View>
      </View>
      {/* 医生列表 */}
      {type === "我的医生" &&
        doctorList !== null &&
        doctorList?.map((val, key) => {
          return (
            <View
              key={"doctor" + key}
              className="doctor-box"
              onClick={() => {
                Taro.reLaunch({
                  url: `/packages/process/pages/timeSelect/index?doctorId=${val.id}&deptId=1`,
                });
              }}
            >
              <Image src={val.attributes.avatar} className="doctor-avatar" />
              <Text className="doctor-name">{val.attributes.name}</Text>
              <Text className="doctor-intro">{val.attributes.desc}</Text>
            </View>
          );
        })}
      {/* 医院列表 */}
      {type === "我的医院" &&
        hsptList !== null &&
        hsptList?.map((val, key) => {
          return (
            <View
              key={"hsp" + key}
              className="hspt-box"
              onClick={() =>
                Taro.reLaunch({
                  url: `/packages/register/pages/departmentChoose/index?campuseId=${val.cId}`,
                })
              }
            >
              <Image src={val.logo} className="hspt-logo" />
              <Text className="hspt-address">{"地址：" + val.address}</Text>
              <Text className="hspt-name">{val.name}</Text>
              <Text className="hspt-phone">{"联系方式：" + val.contact}</Text>
            </View>
          );
        })}
      {/* 为空 */}
      {((type === "我的医生" && doctorList === null) ||
        (type === "我的医院" && hsptList === null)) && (
        <View className="null-box">
          <Image src={collected_empty} className="null-img" />
          <Text className="null-font">暂时还没有收藏哟</Text>
        </View>
      )}
    </View>
  );
}
