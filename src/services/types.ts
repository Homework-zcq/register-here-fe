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