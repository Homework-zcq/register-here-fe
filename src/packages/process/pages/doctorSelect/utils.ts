import request from "@/services/request";
import qs from "qs";
import { pick, get } from "lodash";

export const getRenderInfo = async (deptId: string) => {
  const _query = qs.stringify({
    populate: "*",
    filters: {
      department: {
        id: { $eq: deptId },
      },
    },
  });

  return await request.get(`/api/sum-places?${_query}`).then((res) => {
    return Promise.resolve({
      deptInfo: get(res, "data.data[0].attributes.department.data.attributes"),
      expertList: res.data.data.map((v: { attributes: any }) => ({
        ...pick(v.attributes, ["total", "price"]),
        ...v.attributes.doctor.data.attributes,
        id: v.attributes.doctor.data.id,
      })),
    });
  });
};

export const getCampuses = async (campuseId) => {
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
  return await request.get(`/api/campuses?${query}`).then((res) => {
    return Promise.resolve({
      name: get(res, 'data.data[0].attributes.hospital.data.attributes.name'),
      logo: get(res, 'data.data[0].attributes.hospital.data.attributes.logo'),
      campus: get(res, 'data.data[0].attributes.name'),
    })
  });
};
