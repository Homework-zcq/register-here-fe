import { useState } from "react";
import { View, Text, CoverImage } from "@tarojs/components";
import hospital from "@/assets/img/hospital.png";
import { Avatar, Tag, Button } from '@taroify/core';

import "@taroify/core/tag/style";
import "@taroify/core/avatar/style";
import "@taroify/core/button/style";

import mock from './mock';
import "./index.scss";


export default function DoctorSelect() {
  const [expertList, setExpertList] = useState<Array<any>>(mock);

  return (
    <View className='page-doctor-select'>

      <View className='hospital-department'>
        <View className='hospital'>
          <CoverImage src={hospital} className='hospital-icon' />
          <Text>杭州中医院</Text>
        </View>
        <View className='department'>内科-神经内科</View>

      </View>

      <View className='normal-visiting'>
        <View className='visiting'>
          <Text>普通号</Text>
          <Tag color='primary' variant='outlined'>有号</Tag>
        </View>
        <View className='doctor'>
          <View className='details'>
            <Avatar src='https://i.328888.xyz/2022/12/24/DbJpc.png' size='medium' />
            <Text style={{ marginLeft: "12px" }}>普通医生</Text>
          </View>

          <View className='details'>
            <Text className='price price-font' style={{ marginRight: "12px" }} >¥20</Text>
            <Button size='mini' style={{ backgroundColor: "#5C8DEE", color: "#fff", width: '80px', height: '28px' }} shape='round'>立即预约</Button>
          </View>

        </View>
      </View>

      <View className='expert-visiting'>
        <View className='visiting'>
          <Text>专家号</Text>
        </View>
        {expertList.length > 0 ?
          expertList.map(v => (
            <View key={v.id} className='expert'>
              <View className='avatar'><Avatar src={v.avatar} size='medium' /></View>
              <View className='details'>
                <View className='title'>
                  <Text className='name-font'>{v.name}</Text>
                  <Text className='level-font'>{v.level}</Text>
                </View>
                <View className='subTitle desc-font'>{v.des}</View>
                <View className='price'>
                  <Tag color={v.isFree ? 'primary' : 'default'} variant='outlined'>{v.isFree ? '有号' : '无号'}</Tag>
                  <View className='price-des'>
                    <Text style={{ marginRight: "12px" }} className='price-font'>¥{v.price}</Text>
                    <Button size='mini' style={{ backgroundColor: "#5C8DEE", color: "#fff", width: '80px', height: '28px' }} shape='round' disabled={!v.isFree}>立即预约</Button>
                  </View>
                </View>
              </View>
            </View>
          )) : <View>空</View>}
      </View>
    </View>
  );
}