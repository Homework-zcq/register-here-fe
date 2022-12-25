import { View } from "@tarojs/components";
import { Loading } from "@taroify/core"
import "./index.scss";

export default function PageLoading() {
  return (
    <View className='loading-page'>
      <Loading type='spinner' className='custom-color' />
    </View>
  );
}
