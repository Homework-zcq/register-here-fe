import { useMemo, useState } from "react";
import { isNil, get, isEmpty, sortBy } from "lodash";
import { View, Text, Image } from "@tarojs/components";
import Taro, { getCurrentInstance, useLoad } from "@tarojs/taro";
import { Dot, PageLoading } from "@/components";
import { Avatar, Tag, Loading, Button, Empty, Popup } from "@taroify/core";
import { getRenderInfo, getWeekday } from "./utils";
import "./index.scss";
import { roomChinese } from "@/utils/roomicon";
import star from "@/assets/icon/star.png";
import star_no from "@/assets/icon/star_no.png";
import qs from "qs";
import request from "@/services/request";

interface currentPlaceInfo {
  date: string;
  period_info: any;
  available: boolean;
}

export default function TimeSelect() {
  const { doctorId = 1, deptId = 1 }: any = getCurrentInstance().router?.params;
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [doctor, setDoctor] = useState<any>({});
  const [dept, setDept] = useState<any>({});
  const [places, setPlaces] = useState<any>(null);
  const [userJudge, setUserJudge] = useState(false);
  const [currentPlace, setCurrentPlace] = useState<currentPlaceInfo>({
    date: "",
    period_info: null,
    available: true,
  });
  const [favorites, setFavorites] = useState<{
    attributes: {
      doctors: { data: { id: number }[] };
    };
    id: number;
  }>();

  useMemo(async () => {
    getRenderInfo(doctorId, deptId).then((res) => {
      setPlaces(res.dateTimeInfo);
      setDoctor(get(res, "doctorInfo"));
      setDept(get(res, "deptInfo"));
      setLoading(false);
    });
  }, [doctorId]);
  useLoad(() => {
    getDoctors();
  });
  const selectTime = (e) => {
    setCurrentPlace({
      date: e,
      period_info: get(places, e),
      available:
        get(places, e)?.reduce((pre, cur) => pre.count + cur.count) > 0,
    });
  };
  // 获取收藏医生列表
  const getDoctors = async () => {
    const user = Taro.getStorageSync("user");
    if (!user) {
      setUserJudge(false);
      return;
    }
    setUserJudge(true)
    const _query = qs.stringify({
      populate: "*",
      filters: {
        user: {
          id: { $eq: user.id },
        },
      },
    });
    // 获取收藏医生
    await request.get(`/api/favorite-doctors?${_query}`).then((res) => {
      setFavorites(res.data.data[0]);
    });
  };

  const likeDoctor = (id) => {
    const idList: number[] = [];
    const list = favorites?.attributes.doctors.data;
    if (list)
      for (let i = 0; i < list?.length; i++) {
        idList.push(list[i].id);
      }
    const index = idList.findIndex((val) => val == id);
    if (index !== -1) {
      Taro.showLoading({
        title: "取消收藏中...",
      });
      idList.splice(index, 1);
    } else {
      Taro.showLoading({
        title: "收藏中...",
      });
      idList.push(id);
    }
    request
      .put(`/api/favorite-doctors/${favorites?.id}`, {
        data: {
          doctors: idList,
        },
      })
      .then(() => {
        Taro.hideLoading();
        Taro.showToast({
          title: "成功",
          icon: "success",
          duration: 1000,
        });
        getDoctors();
      });
  };
  return (
    <View className="page-time-select">
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <View className="current-doctor">
            <View className="doctor">
              <Avatar
                src="https://i.328888.xyz/2022/12/24/DbJpc.png"
                size="large"
                style={{ marginRight: "12px" }}
              />
              <View className="doctor-details">
                <View className="level">
                  <Text className="name-font">{doctor.name}</Text>
                  <Image
                    onClick={() => {
                      if (!userJudge) {
                        Taro.showToast({
                          title: "未登录",
                          icon: "error",
                          duration: 1000,
                        });
                        return;
                      }
                      likeDoctor(doctorId);
                    }}
                    src={
                      !userJudge ||
                      favorites?.attributes.doctors.data.findIndex(
                        (item: any) => {
                          return item.id == doctorId;
                        }
                      ) == -1
                        ? star_no
                        : star
                    }
                    className="like_star"
                  />
                </View>
                <View className="level">
                  <Text className="level-font">{doctor.role}</Text>
                  <Text className="link-font" onClick={() => setOpen(true)}>
                    {"查看简介 >"}
                  </Text>
                </View>
              </View>
            </View>
            <View className="expert-at">
              <View className="tag-wrapper">
                <Tag color="primary" variant="outlined" size="medium">
                  专业擅长
                </Tag>
              </View>
              <Text className="desc desc-font">{doctor.desc}</Text>
            </View>
            <View className="current-visiting">
              <View className="tag-wrapper">
                <Tag color="warning" variant="outlined" size="medium">
                  选择科室
                </Tag>
              </View>
              <Text className="desc desc-font">{`${
                dept.campus.data.attributes.hospital.data.attributes.name
              }(${dept.campus.data.attributes.name})-${
                roomChinese[dept.category]
              }-${dept.name}`}</Text>
            </View>
          </View>

          <View className="select-time">
            <Dot color="blue" />
            <Text>选择日期</Text>
          </View>
          <View className="pick-date">
            {!isNil(places) ? (
              sortBy(Object.entries(places), (v) => v[0]).map((v, i) => {
                const isAvailable =
                  (v[1] as Array<any>)?.reduce(
                    (pre, cur) => pre.count + cur.count
                  ) > 0;
                return (
                  <View
                    key={i}
                    className={`date-item ${
                      currentPlace.date === v[0] ? "picked" : ""
                    }`}
                    onClick={() => selectTime(v[0])}
                  >
                    <Text className="week">{getWeekday(v[0])}</Text>
                    <Text className="date">{v[0].slice(5)}</Text>
                    <Text className={isAvailable ? "status" : "disabled"}>
                      {isAvailable ? "有号" : "无号"}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Loading type="spinner" className="custom-color" />
            )}
          </View>

          <View className="current-place">
            <View>当前选择：{currentPlace.date || "未选择"}</View>
            {!isEmpty(currentPlace.date) && currentPlace.available ? (
              currentPlace.period_info
                .sort(function (a: any, _b: any) {
                  if (a.time_period == "am") return -1;
                  else return 1;
                })
                .map((v, i) => (
                  <View key={i} className="period-pick">
                    <Text style={{ marginLeft: "12px" }}>
                      {v.time_period === "am" ? "上午" : "下午"}
                    </Text>
                    <View className="details">
                      <Text
                        style={{ marginRight: "12px" }}
                        className="price-font"
                      >
                        ¥{v.price}
                      </Text>
                      <Button
                        size="mini"
                        style={{
                          backgroundColor: "#5C8DEE",
                          color: "#fff",
                          width: "80px",
                          height: "28px",
                        }}
                        shape="round"
                        disabled={!v.count}
                        onClick={() => {
                          if (!userJudge) {
                            Taro.showToast({
                              title: "未登录",
                              icon: "error",
                              duration: 1000,
                            });
                            return;
                          }
                          Taro.navigateTo({
                            url: `/packages/process/pages/registerDetail/index?placeId=${v.id}`,
                          });
                        }}
                      >
                        总30剩{v.count}
                      </Button>
                    </View>
                  </View>
                ))
            ) : (
              <Empty className="empty">
                <Empty.Image
                  className="custom-empty__image"
                  src="https://img.yzcdn.cn/vant/custom-empty-image.png"
                />
                <Empty.Description>
                  {!currentPlace.available
                    ? `${currentPlace.date}号源已被预约完，请选择其他日期或其他医生`
                    : "选择日期"}
                </Empty.Description>
              </Empty>
            )}
          </View>
          <Popup open={open} placement="bottom" style={{ height: "30%" }}>
            {/* <Popup.Close onClick={() => setOpen(false)} /> */}
            <Popup.Backdrop onClick={() => setOpen(false)} />
            <View className="popup-details">
              <Text className="title">医生简介</Text>
              <View className="about">
                <View className="dot">
                  <Dot color="blue" />
                </View>
                <View className="details">
                  <Text className="dot-title">简介</Text>
                  <Text className="desc">{doctor.desc}</Text>
                </View>
              </View>

              <View className="about">
                <View className="dot">
                  <Dot color="blue" />
                </View>
                <View className="details">
                  <Text className="dot-title">擅长</Text>
                  <Text className="desc">{doctor.desc}</Text>
                </View>
              </View>
            </View>
          </Popup>
        </>
      )}
    </View>
  );
}
