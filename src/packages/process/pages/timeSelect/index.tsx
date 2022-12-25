import { useMemo, useState } from "react";
import { isNil, get, isEmpty } from "lodash";
import { View, Text, } from "@tarojs/components";
import { Dot } from '@/components';
import { Avatar, Tag, Loading, Button, Empty, Popup } from '@taroify/core';
import { getRenderInfo, getWeekday } from './utils';
import "./index.scss";

const id = '1';

interface currentPlaceInfo {
  date: string;
  period_info: any;
  available: boolean;
}

export default function TimeSelect() {
  const [open, setOpen] = useState<boolean>(false);
  const [doctor, setDoctor] = useState<any>();
  const [dept, setDept] = useState<any>();
  const [places, setPlaces] = useState<any>(null);
  const [currentPlace, setCurrentPlace] = useState<currentPlaceInfo>({ date: '', period_info: null, available: true });

  useMemo(async () => {
    getRenderInfo(id).then(res => {
      setPlaces(res.dateTimeInfo);
      setDoctor(get(res, 'doctorInfo'));
      setDept(get(res, 'deptInfo'));
    });
  }, [id]);

  const selectTime = (e) => {
    setCurrentPlace({
      date: e,
      period_info: get(places, e),
      available: get(places, e)?.reduce((pre, cur) => pre.count + cur.count) > 0,
    });
  }

  return (
    <View className='page-time-select'>
      <View className='current-doctor'>
        <View className='doctor'>
          <Avatar src='https://i.328888.xyz/2022/12/24/DbJpc.png' size='large' style={{ marginRight: "12px" }} />
          <View className='doctor-details'>
            <Text className='name-font'>陈伟明</Text>
            <View className='level'>
              <Text className='level-font'>主任医生</Text>
              <Text className='link-font' onClick={() => setOpen(true)}>{"查看简介 >"}</Text>
            </View>
          </View>
        </View>
        <View className='expert-at'>
          <View className='tag-wrapper'><Tag color='primary' variant='outlined' size='medium'>专业擅长</Tag></View>
          <Text className='desc desc-font'>擅长：擅长周围神经病、肌病、遗传病、脑血管病和神经系统疑难罕见病的诊治。</Text>
        </View>
        <View className='current-visiting'>
          <View className='tag-wrapper'><Tag color='warning' variant='outlined' size='medium'>选择科室</Tag></View>
          <Text>杭州市中医院-内科-神经内科</Text>
        </View>
      </View>

      <View className='select-time'>
        <Dot color='blue' />
        <Text>选择日期</Text>
      </View>
      <View className='pick-date'>
        {!isNil(places) ? (Object.entries(places).map((v, i) => {
          const isAvailable = (v[1] as Array<any>)?.reduce((pre, cur) => pre.count + cur.count) > 0;
          return (
            <View key={i} className={`date-item ${currentPlace.date === v[0] ? 'picked' : ''}`} onClick={() => selectTime(v[0])}>
              <Text className='week'>{getWeekday(v[0])}</Text>
              <Text className='date'>{v[0].slice(5)}</Text>
              <Text className={isAvailable ? 'status' : 'disabled'}>{isAvailable ? '有号' : '无号'}</Text>
            </View>
          )
        })) : <Loading type='spinner' className='custom-color' />}
      </View>

      <View className='current-place'>
        <View>当前选择：{currentPlace.date || '未选择'}</View>
        {(!isEmpty(currentPlace.date) && currentPlace.available) ? (currentPlace.period_info?.map((v, i) => (
          <View key={i} className='period-pick'>
            <Text style={{ marginLeft: "12px" }}>{v.time_period === 'am' ? '上午' : '下午'}</Text>
            <View className='details'>
              <Text style={{ marginRight: "12px" }} className='price-font'>¥50</Text>
              <Button size='mini' style={{ backgroundColor: "#5C8DEE", color: "#fff", width: '80px', height: '28px' }} shape='round' disabled={!v.count}>总30剩{v.count}</Button>
            </View>
          </View>))) :
          <Empty className='empty'>
            <Empty.Image
              className='custom-empty__image'
              src='https://img.yzcdn.cn/vant/custom-empty-image.png'
            />
            <Empty.Description>{!currentPlace.available ? `${currentPlace.date}号源已被预约完，请选择其他日期或其他医生` : '选择日期'}</Empty.Description>
          </Empty>
        }
      </View>
      <Popup open={open} placement='bottom' style={{ height: '30%' }} >
        {/* <Popup.Close onClick={() => setOpen(false)} /> */}
        <Popup.Backdrop onClick={() => setOpen(false)} />
        <View className='popup-details'>
          <Text className='title'>医生简介</Text>

          <View className='about'>
            <View className='dot'><Dot color='blue' /></View>
            <View className='details'>
              <Text className='dot-title'>简介</Text>
              <Text className='desc'>擅长周围神经病、肌病、遗传病、脑血管病和神经系统疑难罕见病的诊治。</Text>
            </View>
          </View>

          <View className='about'>
            <View className='dot'><Dot color='blue' /></View>
            <View className='details'>
              <Text className='dot-title'>擅长</Text>
              <Text className='desc'>擅长周围神经病、肌病、遗传病、脑血管病和神经系统疑难罕见病的诊治。</Text>
            </View>
          </View>
        </View>
      </Popup>
    </View>
  );
}
