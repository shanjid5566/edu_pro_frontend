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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
