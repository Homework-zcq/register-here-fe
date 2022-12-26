import request from "@/services/request";
import { pick } from "lodash";

export const getRenderInfo = async () => {
  return await request.get("/api/campuses?populate=hospital").then((res) => {
    console.log(res.data.data);
    return res.data.data;
  });
  return await request.get("/api/hospitals").then((res) => {
    return Promise.resolve({
      hospitals: res.data.data.map((v: { attributes: any }) =>
        pick(v.attributes, ["desc", "label", "logo", "name"]),
      ),
    });
  });
};
