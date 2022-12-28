import { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button, Image, Input } from "@tarojs/components";
import request from "@/services/request";
import "./index.scss";

export default function Signin() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const login = () => {
    if (username === "") {
        Taro.showToast({ title: "请先输入用户名", icon: "none" });
        return;
      }
    if (account === "") {
      Taro.showToast({ title: "请先输入邮箱号", icon: "none" });
      return;
    }
    if (password === "") {
      Taro.showToast({ title: "请先输入密码", icon: "none" });
      return;
    }
    const data = {
      username: username,
      email: account,
      password: password,
    };
    // 调用接口, 登录
    request.post("/api/auth/local/register", data).then((res) => {
      console.log("=====log_res", res);
      Taro.showToast({ title: "注册成功!", icon: "success", duration:2000 });
      setTimeout(() => {
        Taro.navigateBack();
      }, 2000);
    }).catch((err) => {
      Taro.showToast({ title: "注册失败！", icon: "none" });
      console.log("=====log_err", err);
      return;
    });
  };
  return (
    <View className='container'>
      <Image className='icon' src={require("@/assets/icon/logo.png")} />
      <View className='input_box'>
      <View className='input_little_box'>
          <Input
            placeholder='请输入用户名'
            className='input'
            placeholderStyle='color:#AAA'
            onInput={(event) => {
              setUsername(event.detail.value);
            }}
          />
        </View>
        <View className='input_little_box'>
          <Input
            placeholder='请输入邮箱号'
            className='input'
            placeholderStyle='color:#AAA'
            onInput={(event) => {
              setAccount(event.detail.value);
            }}
          />
        </View>
        <View className='input_little_box' style='border:0px'>
          <Input
            type='safe-password'
            password
            placeholder='请输入账号密码'
            className='input'
            placeholderStyle='color:#AAA'
            onInput={(event) => {
              setPassword(event.detail.value);
            }}
          />
        </View>
      </View>
      <View className='btn_group'>
        <Button className='weapp_login' onClick={login}>
          <Text>注册</Text>
        </Button>
      </View>
    </View>
  );
}
