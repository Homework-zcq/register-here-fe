import request from "@/services/request";
import qs from "qs";
import { pick, get, groupBy } from "lodash";

export const getRenderInfo = async (docId: string) => {
  const _query = qs.stringify({
    populate: "*",
    filters: {
      doctor: {
        id: { $eq: docId },
      },
    },
  });

  return await request.get(`/api/places?${_query}`).then((res) => {
    return Promise.resolve({
      doctorInfo: get(res, "data.data[0].attributes.doctor.data.attributes"),
      deptInfo: get(res, "data.data[0].attributes.department.data.attributes"),
      dateTimeInfo: groupBy(
        res.data.data.map((v: { attributes: any; id: any; }) => ({
          ...pick(v.attributes, ["count", "date", "time_period"]),
          id: v.id,
        })),
        (v) => v.date
      ),
    });
  });
};

export const getWeekday = (date) => {
  let weekArray = ["日", "一", "二", "三", "四", "五", "六"];
  let week = weekArray[new Date(date).getDay()];
  return `周${week}`;
};
