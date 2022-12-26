import { useMemo, useState } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { PageLoading } from '@/components';
import { View, Text, CoverImage } from '@tarojs/components';
import { Avatar, Tag, Button, Loading } from '@taroify/core';
import { getCampuses, getRenderInfo } from './utils';
import './index.scss';

export default function DoctorSelect() {
  const { deptId = 1, campuseId = 1 }: any =
    getCurrentInstance().router?.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [deptInfo, setDeptInfo] = useState<any>({});
  const [campus, setCampus] = useState<any>({});
  const [expertList, setExpertList] = useState<Array<any>>([]);

  useMemo(async () => {
    getRenderInfo(deptId).then((res) => {
      setDeptInfo(res.deptInfo);
      setExpertList(res.expertList);
    });
    getCampuses(campuseId).then((res) => {
      setCampus(res);
      setLoading(false);
    });
  }, [deptId, campuseId]);

  const onTapDoctor = (e: number) => {
    Taro.navigateTo({
      url: `/packages/process/pages/timeSelect/index?doctorId=${e}&deptId=${deptId}`,
    })
  };

  return (
    <View className='page-doctor-select'>
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <View className='hospital-department'>
            <View className='hospital'>
              <CoverImage src={campus.logo} className='hospital-icon' />
              <View className='campus-name'>
                <Text>{campus.name}</Text>
                <Text className='campus'>{campus.campus}</Text>
              </View>
            </View>
            <View className='department'>{deptInfo.name}</View>
          </View>

          <View className='normal-visiting'>
            <View className='visiting'>
              <Text>普通号</Text>
              <Tag color='primary' variant='outlined'>
                有号
              </Tag>
            </View>
            <View className='doctor'>
              <View className='details'>
                <Avatar
                  src='https://i.328888.xyz/2022/12/24/DbJpc.png'
                  size='medium'
                />
                <Text style={{ marginLeft: '12px' }}>普通医生</Text>
              </View>

              <View className='details'>
                <Text
                  className='price price-font'
                  style={{ marginRight: '12px' }}
                >
                  ¥20
                </Text>
                <Button
                  size='mini'
                  style={{
                    backgroundColor: '#5C8DEE',
                    color: '#fff',
                    width: '80px',
                    height: '28px',
                  }}
                  shape='round'

                >
                  立即预约
                </Button>
              </View>
            </View>
          </View>

          <View className='expert-visiting'>
            <View className='visiting'>
              <Text>专家号</Text>
            </View>
            {expertList.length > 0 ? (
              expertList.map((v, i) => (
                <View key={i} className='expert'>
                  <View className='avatar'>
                    <Avatar src={v.avatar} size='medium' />
                  </View>
                  <View className='details'>
                    <View className='title'>
                      <Text className='name-font'>{v.name}</Text>
                      <Text className='level-font'>主任医生</Text>
                    </View>
                    <View className='subTitle desc-font'>{v.desc}</View>
                    <View className='price'>
                      <Tag
                        color={v.total ? 'primary' : 'default'}
                        variant='outlined'
                      >
                        {v.total ? '有号' : '无号'}
                      </Tag>
                      <View className='price-des'>
                        <Text
                          style={{ marginRight: '12px' }}
                          className='price-font'
                        >
                          ¥{v.price}
                        </Text>
                        <Button
                          size='mini'
                          style={{
                            backgroundColor: '#5C8DEE',
                            color: '#fff',
                            width: '80px',
                            height: '28px',
                          }}
                          shape='round'
                          disabled={!v.total}
                          onTap={() => onTapDoctor(v.id)}
                        >
                          立即预约
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Loading type='spinner' className='custom-color' />
            )}
          </View>
        </>
      )}
    </View>
  );
}
