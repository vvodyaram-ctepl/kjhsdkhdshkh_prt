import { RouteInfo } from "./sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "/user/dashboard",
    title: "Favourites",
    icon: "favourites",
    class: "",
    display: true,
    submenu: []
  },
  {
    path: "/user/clinics",
    title: "Study",
    icon: "study",
    class: "",
    display: false,
    submenu: [
      {
        path: "/user/clinics",
        title: "Study",
        icon: "Icon-open-dashboard",
        class: "",
      },
      {
        path: "/user/clinics/clinical-notification",
        title: "Study Notification",
        icon: "studyNotification",
        class: "",
      }
    ]
  },
  {
    path: "/user/clinical-user",
    title: "Users",
    icon: "users",
    class: "",
    display: false,
    submenu: [
    ]
  },
  {
    path: "/user/plans",
    title: "Plans",
    icon: "plans1",
    class: "",
    display: false,
    submenu: []
  },
  {
    path: "/user/patients",
    title: "Pets",
    icon: "pets",
    class: "",
    display: false,
    submenu: []
  },
  {
    path: "/user/petparent",
    title: "Pet Parent",
    icon: "petParents",
    class: "",
    display: false,
    submenu: [
    ]
  },
  {
    path: "/user/assets/dashboard",
    title: "Assets",
    icon: "assets1",
    class: "",
    display: false,
    submenu: [
      {
        path: "/user/assets/dashboard",
        title: "Dashboard",
        icon: "assetDashboard",
        class: "",
      },
      {
        path: "/user/assets/management",
        title: "Manage Asset",
        icon: "assetManagement",
        class: "",
      },
      {
        path: "/user/assets/reports",
        title: "Reports",
        icon: "assetReports",
        class: "",
      },
      {
        path: "/user/assets/device-information",
        title: "Device Firmware",
        icon: "assetDeviceInfo2",
        class: "",
      },
      {
        path: "/user/assets/firmware-version",
        title: "Manage Firmware",
        icon: "assetManageFw",
        class: "",
      }
    ]
  },
  {
    path: "/user/mobile-app",
    title: "Mobile App",
    icon: "mobileApp",
    class: "",
    display: false,
    submenu: [
      {
        path: "/user/mobile-app/feedback",
        title: "Feedback",
        icon: "feedback",
        class: "",
      },
      {
        path: "/user/mobile-app/onboarding",
        title: "Onboarding",
        icon: "selfOnBoarding",
        class: "",
      },
      {
        path: "/user/mobile-app/timer",
        title: "Timer Log",
        icon: "stopwatch",
        class: "",
      }
    ],
  },
  {
    path: "/user/roles",
    title: "Roles",
    icon: "roles",
    class: "",
    display: false,
    submenu: [],
  },
  {
    path: "/user/support",
    title: "Support",
    icon: "Headphones",
    class: "",
    display: false,
    submenu: [],
  },
  {
    path: "/user/audit",
    title: "Audit Log",
    icon: "audit",
    class: "",
    display: false,
    submenu: [],
  },
  {
    path: "/user/point-tracking",
    title: "Point Tracking",
    icon: "pointTracker",
    class: "",
    display: false,
    submenu: [
    ]
  },
  {
    path: "/user/questionnaire",
    title: "Questionnaire",
    icon: "questionnaire",
    class: "",
    display: false,
    submenu: [
    ]
  }

];
