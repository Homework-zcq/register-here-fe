import { useState } from "react";
import { View, Text, Image, Input } from "@tarojs/components";
import "./index.less";
import "./index.scss";
import qs from "qs";
import search from "@/assets/img/search.png";
import Taro, { getCurrentInstance, useLoad } from "@tarojs/taro";
import { campusInfo } from "@/services/types";
import request from "@/services/request";
import { TreeSelect } from "@taroify/core";
import { roomChinese } from "@/utils/roomicon";

export default function departmentChoose() {
  const { campuseId }: any = getCurrentInstance().router?.params;
  const [campuse, setCampuse] = useState<campusInfo>();
  const [departments, setDepartments] = useState<
    {
      name: string;
      department: { name: string; id: number }[];
    }[]
  >([]);
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState(0);
  useLoad(() => {
    getCampuses();
    getDepartments();
  });
  const getCampuses = () => {
    const query = qs.stringify({
      populate: {
        hospital: {
          populate: "*",
        },
      },
      filters: {
        id: { $eq: campuseId },
      },
    });
    request.get(`/api/campuses?${query}`).then((res) => {
      setCampuse(res.data.data[0]);
    });
  };
  const getDepartments = () => {
    const query = qs.stringify({
      populate: "*",
      filters: {
        campus: {
          id: { $eq: campuseId },
        },
      },
    });
    request.get(`/api/departments?${query}`).then((res) => {
      console.log(res.data.data);
      const list: {
        attributes: {
          category: string;
          name: string;
        };
        id: number;
      }[] = res.data.data;
      const objList: {
        name: string;
        department: { name: string; id: number }[];
      }[] = [];
      for (let i = 0; i < list.length; i++) {
        const n = objList.findIndex(
          (searchElement: {
            name: string;
            department: { name: string; id: number }[];
          }) => {
            return searchElement.name == list[i].attributes.category;
          }
        );
        if (n == -1) {
          objList.push({
            name: list[i].attributes.category,
            department: [{ name: list[i].attributes.name, id: list[i].id }],
          });
        } else {
          objList[n].department.push({
            name: list[i].attributes.name,
            id: list[i].id,
          });
        }
      }
      setDepartments(objList);
    });
  };

  return (
    <View className="container">
      <View className="detail_box">
        <Image
          src={
            campuse?.attributes.hospital.data?.attributes.logo
              ? campuse?.attributes.hospital.data?.attributes.logo
              : ""
          }
          className="logo"
        />
        <Text className="name">
          {campuse?.attributes.hospital.data?.attributes.name +
            "-" +
            campuse?.attributes.name || ""}
        </Text>
      </View>
      <View className="search_box">
        <Image className="search_icon" src={search} />
        <Input className="search_input" type="text" placeholder="搜索科室..." />
      </View>
      <View className="select">
        <Text className="select_title">去挂号</Text>
        <TreeSelect
          tabValue={tabValue}
          value={value}
          onTabChange={(res) => {
            setTabValue(res);
          }}
          onChange={(res) => {
            setValue(res);
            Taro.navigateTo({
              url: `/packages/process/pages/doctorSelect/index?deptId=${res}&campuseId=${campuseId}`,
            })
          }}
        >
          {departments.map((val) => (
            <TreeSelect.Tab title={roomChinese[val.name]} key={val.name}>
              {val.department.map((item) => (
                <TreeSelect.Option key={item.id + "department"} value={item.id}>
                  {item.name}
                </TreeSelect.Option>
              ))}
            </TreeSelect.Tab>
          ))}
        </TreeSelect>
      </View>
    </View>
  );
}
