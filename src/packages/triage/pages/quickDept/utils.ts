
export const fakeReply = async (str: string) => {
  if (str.includes("不舒服")) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("请描述具体部位");
      }, 1000);
    });
  } else if (str.includes("脑袋")) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("推荐科室：神经科");
      }, 1000);
    });
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("听不懂你在说什么");
      }, 1000);
    });
  }
};
