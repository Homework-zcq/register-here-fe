import { useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Loading, Search } from '@taroify/core';

import { getRenderInfo } from './utils';
import './index.scss';

const id = '1';

export default function SelectHospital() {
  const { dept }: any = getCurrentInstance().router?.params;
  const [searchValue, setSearchValue] = useState<string>(dept);
  const [hospitals, setHospitals] = useState<any>();

  useMemo(async () => {
    getRenderInfo().then(res => {
      console.log(res);
      setHospitals(res.hospitals);
    });
  }, [id]);

  return (
    <View className='page-select-hospital'>
      <Search
        value={searchValue}
        placeholder='请输入搜索关键词'
        className='search-box'
        onChange={(e) => setSearchValue(e.detail.value)}
      />
      <View className='hospitals'>
        {isEmpty(hospitals) ? <Loading type='spinner' className='custom-color' /> : hospitals?.map((v, i) => {
          return (
            <View className='hospital_box' key={i}>
              <Image
                className='hospital_logo'
                src={v.logo || ''}
              />
              <View className='hospital_right'>
                <Text className='hospital_name'>
                  {v.name || '医院名称'}
                </Text>
                <Text className='hospital_detail'>
                  {v.desc['医院介绍'] || '医院介绍'}
                </Text>
                <View className='hospital_lables'>
                  {v.label &&
                    v.label.slice(0, 3).map((val, index) => (
                      <View
                        className={
                          val == '三甲'
                            ? 'hospital_lable_box1'
                            : 'hospital_lable_box2'
                        }
                        key={'lable' + index}
                      >
                        <Text
                          className={
                            val == '三甲'
                              ? 'hospital_lable_text1'
                              : 'hospital_lable_text2'
                          }
                        >
                          {val}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          )
        })}
      </View>

    </View>
  );
}
