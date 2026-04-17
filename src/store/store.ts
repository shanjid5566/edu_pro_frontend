import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import studentReducer from './slices/studentSlice';
import teacherReducer from './slices/teacherSlice';
import parentReducer from './slices/parentSlice';
import classReducer from './slices/classSlice';
import classScheduleReducer from './slices/classScheduleSlice';
import examReducer from './slices/examSlice';
import attendanceReducer from './slices/attendanceSlice';
import noticeReducer from './slices/noticeSlice';
import settingsReducer from './slices/settingsSlice';
import teacherDashboardReducer from './slices/teacherDashboardSlice';
import teacherClassesReducer from './slices/teacherClassesSlice';
import teacherAttendanceReducer from './slices/teacherAttendanceSlice';
import teacherNoticesReducer from './slices/teacherNoticesSlice';
import studentDashboardReducer from './slices/studentDashboardSlice';
import studentClassesReducer from './slices/studentClassesSlice';
import studentExamsReducer from './slices/studentExamsSlice';
import studentResultsReducer from './slices/studentResultsSlice';
import studentFeesReducer from './slices/studentFeesSlice';
import parentDashboardReducer from './slices/parentDashboardSlice';
import parentProgressReducer from './slices/parentProgressSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    student: studentReducer,
    teacher: teacherReducer,
    parent: parentReducer,
    class: classReducer,
    classSchedule: classScheduleReducer,
    exam: examReducer,
    attendance: attendanceReducer,
    notice: noticeReducer,
    settings: settingsReducer,
    teacherDashboard: teacherDashboardReducer,
    teacherClasses: teacherClassesReducer,
    teacherAttendance: teacherAttendanceReducer,
    teacherNotices: teacherNoticesReducer,
    studentDashboard: studentDashboardReducer,
    studentClasses: studentClassesReducer,
    studentExams: studentExamsReducer,
    studentResults: studentResultsReducer,
    studentFees: studentFeesReducer,
    parentDashboard: parentDashboardReducer,
    parentProgress: parentProgressReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
