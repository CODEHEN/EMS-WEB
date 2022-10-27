// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['student', 'admin', 'teacher'] },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['student', 'teacher', 'admin'] }
          }
        ]
      },
      // forms
      {
        path: '/studentCourse',
        redirect: '/electiveCourse/center',
        component: RouteView,
        meta: { title: 'menu.electiveCourse', icon: 'form', permission: ['student'] },
        children: [
          {
            path: '/semester',
            name: 'studentCourseSemester',
            component: () => import('../views/list/course/studentCourse'),
            meta: { title: '学期课程', keepAlive: true, permission: ['student'] }
          },
          {
            path: '/electiveCourse/center',
            name: 'electiveCourseCenter',
            component: () => import('../views/list/course/ElectiveCourseInfoTableList'),
            meta: { title: 'menu.electiveCourse.center', keepAlive: true, permission: ['student'] }
          },
          {
            path: '/electiveCourse/result',
            name: 'electiveCourseResult',
            component: () => import('@/views/list/course/elective'),
            meta: { title: 'menu.electiveCourse.result', keepAlive: true, permission: ['student'] }
          }
        ]
      },
      // list
      {
        path: '/list',
        name: 'list',
        component: RouteView,
        redirect: '/list/table-list',
        meta: { title: 'menu.info-list', icon: 'table', permission: ['admin'] },
        children: [
          {
            path: '/list/table-list/:pageNum([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: 'menu.list.table-list', keepAlive: true, permission: ['admin'] }
          },
          {
            path: '/list/teacher-table-list/:pageNum([1-9]\\d*)?',
            name: 'TeacherTableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TeacherTableList'),
            meta: { title: 'menu.list.teacher-table-list', keepAlive: true, permission: ['admin'] }
          },
          {
            path: '/list/admin-table-list/:pageNum([1-9]\\d*)?',
            name: 'AdminTableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/AdminTableList'),
            meta: { title: 'menu.list.admin-table-list', keepAlive: true, permission: ['admin'] }
          },
          {
            path: '/list/class-table-list/:pageNum([1-9]\\d*)?',
            name: 'ClassTableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/ClassTableList'),
            meta: { title: 'menu.list.class-table-list', keepAlive: true, permission: ['admin'] }
          },
          {
            path: '/public/notice',
            name: 'Notice',
            component: () => import('../views/list/notice/NoticeTableList'),
            meta: { title: 'menu.list.notice', permission: ['admin'] }
          },
          {
            path: '/public/reward_punishment',
            name: 'Reward_Punishment',
            component: () => import('../views/list/reward_punishment/Reward_PunishmentTableList'),
            meta: { title: 'menu.list.reward_punishment', permission: ['admin'] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/BasicList'),
            meta: { title: 'menu.list.basic-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: 'menu.list.card-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: 'menu.list.search-list', keepAlive: true, permission: ['table'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: 'menu.list.search-list.articles', permission: ['table'] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: 'menu.list.search-list.projects', permission: ['table'] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: 'menu.list.search-list.applications', permission: ['table'] }
              }
            ]
          }
        ]
      },

      {
        path: '/public',
        name: 'public',
        component: RouteView,
        meta: { title: 'menu.public', icon: 'profile', permission: ['admin'] },
        children: [
          {
            path: '/list/college-major-table-list/:pageNum([1-9]\\d*)?',
            name: 'CollegeMajorTableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/CollegeMajorTableList'),
            meta: { title: 'menu.list.college-major-table-list', keepAlive: true, permission: ['admin'] }
          },
          {
            path: '/public/teach_build_classroom',
            name: 'Teach_Build_Room',
            component: () => import('../views/list/teach_build_classroom/TeachBuildRoom'),
            meta: { title: 'menu.list.teach_build_classroom', permission: ['admin'] }
          },
          {
            path: '/list/search/project',
            name: 'SearchProjects',
            component: () => import('../views/list/search/Projects'),
            meta: { title: 'menu.list.search-list.projects', permission: ['table'] }
          },
          {
            path: '/list/search/application',
            name: 'SearchApplications',
            component: () => import('../views/list/search/Applications'),
            meta: { title: 'menu.list.search-list.applications', permission: ['table'] }
          }
        ]
      },
      {
        path: '/course',
        name: 'course',
        component: RouteView,
        meta: { title: 'menu.course', icon: 'profile', permission: ['admin'] },
        children: [
          {
            path: '/course/info',
            name: 'Course',
            component: () => import('../views/list/course/CourseInfoTableList'),
            meta: { title: 'menu.list.courseInfo', permission: ['admin'] }
          },
          {
            path: '/course/classTask',
            name: 'ClassTask',
            component: () => import('../views/list/classTask/ClassTaskTableList'),
            meta: { title: 'menu.list.classTask', permission: ['admin'] }
          },
          {
            path: '/course/elective',
            name: 'Elective',
            component: () => import('../views/list/course/ElectiveCourseInfoTableList'),
            meta: { title: 'menu.list.ElectiveCourseInfo', permission: ['admin'] }
          }
        ]
      },
      {
        path: '/teacher/course',
        name: 'TeacherCourse',
        component: () => import('@/views/list/teacher/Course'),
        meta: { title: 'menu.teacher.course', icon: 'profile', permission: ['teacher'] }
      },
      // profileu
      {
        path: '/teacher/grade',
        name: 'Grade',
        component: RouteView,
        meta: { title: 'menu.teacher.grade', icon: 'profile', permission: ['teacher', 'student'] },
        children: [
          {
            path: '/teacher/grade/recorded',
            name: 'GradeRecorded',
            component: () => import('@/views/list/teacher/Grade'),
            meta: { title: 'menu.teacher.grade.recorded', icon: 'profile', permission: ['teacher'] }
          },
          {
            path: '/teacher/grade/ranking',
            name: 'Ranking',
            component: () => import('@/views/list/ranking'),
            meta: { title: 'menu.teacher.grade.ranking', icon: 'profile', permission: ['teacher'] }
          },
          {
            path: '/student/grade/course',
            name: 'StudentGrade',
            component: () => import('@/views/list/StudentGrade'),
            meta: { title: '课程成绩', icon: 'profile', permission: ['student'] }
          },
          {
            path: '/student/grade/level',
            name: 'StudentGradeLevel',
            component: () => import('@/views/list/StudentGradeLevel'),
            meta: { title: '等级考试成绩', icon: 'profile', permission: ['student'] }
          }
        ]
      },
      {
        path: '/schedule',
        name: 'schedule',
        component: RouteView,
        redirect: '/schedule/semester',
        meta: { title: 'menu.schedule', icon: 'profile', permission: ['admin', 'teacher', 'student'] },
        children: [
          {
            path: '/schedule/semester',
            name: 'Semester',
            component: () => import('@/views/schedule/Semester'),
            meta: { title: 'menu.schedule.semester', permission: ['admin', 'teacher'] }
          },
          {
            path: '/schedule/teacher',
            name: 'Teacher',
            component: () => import('@/views/schedule/Teacher'),
            meta: { title: 'menu.schedule.teacher', permission: ['admin', 'teacher', 'student'] }
          },
          {
            path: '/schedule/class',
            name: 'Class',
            component: () => import('@/views/schedule/Class'),
            meta: { title: 'menu.schedule.class', permission: ['admin', 'teacher'] }
          },
          {
            path: '/schedule/classroom',
            name: 'ClassRoom',
            component: () => import('@/views/schedule/ClassRoom'),
            meta: { title: 'menu.schedule.classroom', permission: ['admin', 'teacher', 'student'] }
          }
        ]
      },
      {
        path: '/public/reward_punishment',
        name: 'Reward_Punishment',
        component: () => import('../views/list/reward_punishment/Reward_PunishmentTableList'),
        meta: { title: 'menu.list.reward_punishment', icon: 'check-circle-o', permission: ['student'] }
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: { title: 'menu.result', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: 'menu.result.success', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: 'menu.result.fail', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['exception'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        hidden: true,
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['student', 'admin', 'teacher'] },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['student', 'admin', 'teacher'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['student', 'admin', 'teacher'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['student', 'admin', 'teacher']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['student', 'admin', 'teacher'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['student', 'admin', 'teacher'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['student', 'admin', 'teacher']
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
