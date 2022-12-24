import { Component, PropsWithChildren } from "react";
import { View, Text, CoverImage } from "@tarojs/components";
import hospital from "@/assets/img/hospital.png";
import Tag from "@taroify/core/tag";
import "@taroify/core/tag/style";

import "./index.scss";

export default class Index extends Component<PropsWithChildren> {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='page-doctor-select'>
        
        <View className='hospital-department'>
          <View className='hospital'>
            <CoverImage src={hospital} className='hospital-icon' />
            <Text>杭州中医院</Text>
          </View>
          <View className='department'>内科-神经内科</View>

        </View>

        <View className='hospital-department'>
          <View className='hospital'>
            <CoverImage src={hospital} className='hospital-icon' />
            <Text>杭州中医院</Text>
          </View>
          <View className='department'>内科-神经内科</View>
        </View>
        <Tag color='primary'>标签</Tag>
      </View>
    );
  }
}
