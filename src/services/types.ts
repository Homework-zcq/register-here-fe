// 用户信息
export type UserInfo = {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    avatar: any
    role: string
}

// 挂号信息 简
export type RegisterInfo = {
    id: string
    createdAt: string
    updatedAt: string
    date: string
    timePart: string
}

// 医生信息
export type DoctorInfo = {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    hspt: string //医院
    dept: string //科室
    bio: string //简介
}

// 收藏医生信息
export type CollectedDoctor = {
    id: string,
    attributes: {
        avatar: string,
        desc: string,
        name: string,
    }
}

// 收藏医院信息
export type CollectedHspt = {
    hId: string, // 医院id
    cId: string, // 院区id
    name: string, // 全名（医院+院区拼接）
    contact: string,
    address: string,
    logo: string
}