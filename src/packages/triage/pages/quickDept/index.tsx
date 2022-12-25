import { useState } from 'react';
import Taro from "@tarojs/taro";
import { View, Text } from '@tarojs/components';
import { ChatFeed, Message } from 'react-chat-ui'
import { Field, Input, Button } from '@taroify/core';
import { GuideOutlined, Plus, PlayCircleOutlined } from "@taroify/icons"
import { fakeReply } from './utils';
import './index.scss';

export default function QuickDept() {
  const [value, setValue] = useState<string>('');
  const [showRecommend, setShowRecommend] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    new Message({ id: 1, message: '请问你哪里不舒服', senderName: '路易' }),
  ]);

  const onInputValueChange = (e: any) => {
    setValue(e.detail.value);
  }

  const sendMessage = async () => {
    const newMessage = new Message({
      id: 0,
      message: value,
      senderName: 'qx',
    });
    setMessages(pre => pre.concat(newMessage));
    setValue('');
    fakeReply(value).then(res => {
      const newReply = new Message({ id: 1, message: res as unknown as string, senderName: '路易' });
      setMessages(pre => pre.concat(newReply));
      if ((res as unknown as string)?.includes('推荐')) {
        setShowRecommend((res as unknown as string).slice(5));
      }
    });
  }

  return (
    <View className='page-quick-dept'>
      <Text className='current-time'>{new Date().toLocaleString()}</Text>
      <View className='chat-container'>
        <ChatFeed
          maxHeight={500}
          messages={messages}
          showSenderName
        />
      </View>
      <View className={`recommend-box ${showRecommend ? '' : 'hidden'}`}>
        <Text className='title'>推荐科室：{showRecommend}</Text>
        <View className='link'>
          <PlayCircleOutlined style={{ color: "#2574FF", fontSize: '38px' }} onClick={() =>
            Taro.navigateTo({
              url: `/packages/triage/pages/selectHospital/index?dept=${showRecommend}`,
            })
          }
          />
          <Text style={{ marginRight: '8px' }}>前往选择医院</Text>
        </View>
      </View>
      <Field align='center'>
        <Button size='small' className='field-btn'>
          <Plus style={{ color: "#fff", fontSize: '24px' }} />
        </Button>
        <View className='input'><Input value={value} onChange={onInputValueChange} /></View>
        <Button size='small' className='field-btn' onTap={sendMessage}>
          <GuideOutlined style={{ color: "#fff", fontSize: '24px' }} />
        </Button>
      </Field>
    </View>
  );
}
