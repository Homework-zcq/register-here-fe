import { Component, PropsWithChildren } from "react";
import { View, Text } from "@tarojs/components";
import { Test } from "@/components";
import "./index.less";
import "./index.scss";

export default class Index extends Component<PropsWithChildren> {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='index'>
        <Text className='test'>这是home</Text>
        <Test />
      </View>
    );
  }
}
