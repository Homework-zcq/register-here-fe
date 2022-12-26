export default defineAppConfig({
  pages: [
    "pages/home/index",
    "pages/register/index",
    "pages/mine/index",
  ],
  subPackages: [
    {
      // 登录
      root: "packages/login",
      pages: [
        "pages/log/index",
      ]
    },
    {
      // 挂号
      root: "packages/register",
      pages: [
        "pages/hospitalHome/index",
        "pages/hospitalDetail/index",
        "pages/departmentChoose/index"
      ],
    },
    {
      // 我的
      root: "packages/mine",
      pages: [
        "pages/myCollection/index",
      ],
    },
    {
      // 挂号流程
      root: "packages/process",
      pages: [
        "pages/doctorSelect/index",
        "pages/timeSelect/index",
        "pages/registerDetail/index",
      ],
    },
    {
      // 智能分诊
      root: "packages/triage",
      pages: [
        "pages/quickDept/index",
        "pages/selectHospital/index",
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
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/my.png',
        selectedIconPath: 'assets/my_select.png'
      },
    ]
  }
});
