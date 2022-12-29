import { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button, Image, Input } from "@tarojs/components";
import request from "@/services/request";
import { UserInfo } from "@/services/types";
import "./index.scss";

export default function Login() {
  const [read, setRead] = useState(false);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (!read) {
      Taro.showToast({ title: "请阅读并同意底部政策协议", icon: "none" });
      return;
    }
    if (account === "") {
      Taro.showToast({ title: "请先输入账号", icon: "none" });
      return;
    }
    if (password === "") {
      Taro.showToast({ title: "请先输入密码", icon: "none" });
      return;
    }
    const data = {
      identifier: account,
      password: password,
    };
    // 调用接口, 登录
    request
      .post("/api/auth/local", data)
      .then((res) => {
        const tmp = res.data.user;
        if (res.statusCode === 200 && tmp) {
          const user: UserInfo = {
            id: tmp.id ? tmp.id : "",
            createdAt: tmp.createdAt ? tmp.createdAt : "",
            updatedAt: tmp.updatedAt ? tmp.updatedAt : "",
            name: tmp.username ? tmp.username : "",
            avatar: tmp.avatar ? tmp.avatar : "",
            role: tmp.u_role ? tmp.u_role : "",
          };
          Taro.setStorageSync("user", user);
          // 存储token，方便做用户校验
          Taro.setStorageSync("token", res.data.jwt);
        } else {
          throw "get url error";
        }
        Taro.navigateBack();
      })
      .catch((err) => {
        Taro.showToast({ title: "登录失败！", icon: "none" });
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
            placeholder='请输入账号'
            className='input'
            placeholderStyle='color:#AAA'
            onInput={(event) => {
              setAccount(event.detail.value);
            }}
          />
        </View>
        <View className='input_little_box' style='border:0px'>
          <Input
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
          <Text>登录</Text>
        </Button>
        <Button
          className='phone_login'
          onClick={() =>
            Taro.navigateTo({ url: "/packages/login/pages/sign/index" })
          }
        >
          暂无账号，去注册
        </Button>
      </View>
      <View className='footer'>
        {read ? (
          <Image
            className='read_btn'
            src={require("@/assets/icon/check.png")}
            onClick={() => setRead(false)}
          ></Image>
        ) : (
          <Image
            className='read_btn'
            src={require("@/assets/icon/check_blank.png")}
            onClick={() => setRead(true)}
          ></Image>
        )}
        <Text className='gray_text' onClick={() => {}}>
          我已阅读并同意<Text className='blue_text'>《浙么挂用户协议》</Text>
        </Text>
      </View>
    </View>
  );
}
