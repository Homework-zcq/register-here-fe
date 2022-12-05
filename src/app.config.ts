export default defineAppConfig({
  pages: ["pages/index/index"],
  subPackages: [
    {
      // 测试
      root: "packages/moduleQx",
      pages: [
        "pages/index/index",
      ],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
});
