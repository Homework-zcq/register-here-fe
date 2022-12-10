export default defineAppConfig({
  pages: [
    "pages/home/index",
    "pages/register/index",
    "pages/my/index",
  ],
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
  tabBar: {
    color: '#C8DBFF',
    selectedColor: '#5C8DEE',
    position: 'bottom',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home_select.png'
      },
      {
        pagePath: 'pages/register/index',
        text: '挂号',
        iconPath: 'assets/register.png',
        selectedIconPath: 'assets/register_select.png'
      },
      {
        pagePath: 'pages/my/index',
        text: '我的',
        iconPath: 'assets/my.png',
        selectedIconPath: 'assets/my_select.png'
      },
    ]
  }
});