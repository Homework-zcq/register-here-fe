import React, { Component, PropsWithChildren } from "react";
import { View, Text } from "@tarojs/components";
import { Test } from "../../components/qxtest";
import "./index.less";

export default class Index extends Component<PropsWithChildren> {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Test />
      </View>
    );
  }
}
