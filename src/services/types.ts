// 用户信息
export type UserInfo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  avatar: any;
  role: string;
};

// 挂号信息 简
export type RegisterInfo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  timePart: string;
};

// 医生信息
export type DoctorInfo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  hspt: string; //医院
  dept: string; //科室
  bio: string; //简介
};

// 收藏医生信息
export type CollectedDoctor = {
  id: string;
  attributes: {
    avatar: string;
    desc: string;
    name: string;
  };
};

// 收藏医院信息
export type CollectedHspt = {
  hId: string; // 医院id
  cId: string; // 院区id
  name: string; // 全名（医院+院区拼接）
  contact: string;
  address: string;
  logo: string;
};

// 院区信息
export type campusInfo = {
  id: number;
  attributes: {
    address: string;
    city: string;
    district: string;
    hospital: {
      data: {
        attributes: {
          desc: object;
          label: string[];
          logo: string;
          name: string;
        };
      };
    };
    name: string;
  };
};

//医院信息
export type hospitalInfo = {
  id: number;
  attributes: {
    address: string;
    campuses: {
      data: {
        attributes: {
          address: string;
          city: string;
          concat: string;
          createdAt: string;
          district: string;
          name: string;
        };
        id: number;
      }[];
    };
    contact: number;
    desc: any;
    label: string[];
    logo: string;
    name: string;
  };
};

// 就诊人信息
export type Visitting = {
  id: string;
  attributes: {
    id_num: string;
    name: string;
    phone: string;
    relation: string;
    gender: string;
    age: number;
  };
};
