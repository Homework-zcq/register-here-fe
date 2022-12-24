import React from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import "./index.less";

const Test: React.FC = () => {
  const test = () => {
    Taro.navigateTo({
      url: "/packages/register/pages/index/index",
    });
  }

  return (
    <View className='view-highlight'>
      <Button onClick={test}>to module</Button>
    </View>
  );
};

export default Test;
