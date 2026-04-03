import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Types
interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  marksObtained: number;
  grade: string;
  remarks?: string | null;
}

interface QuestionPaper {
  id: string;
  teacherId: string;
  teacherName: string;
  fileUrl: string;
  status: string;
  createdAt: string;
}

interface ExamData {
  id: string;
  name: string;
  class: string;
  classId: string;
  subject: string;
  subjectId: string;
  date: string;
  duration: string;
  marks: number;
  type: string;
  status: string;
  resultCount: number;
}

interface ExamDetail extends ExamData {
  totalMarks: number;
  results: ExamResult[];
  questionPapers: QuestionPaper[];
}

interface ExamStatistics {
  upcoming: number;
  ongoing: number;
  completed: number;
}

interface Pagination {
  total: number;
  skip: number;
  take: number;
  pages: number;
}

interface ExamState {
  exams: ExamData[];
  selectedExam: ExamDetail | null;
  searchResults: ExamData[];
  statistics: ExamStatistics | null;
  pagination: Pagination;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  exams: [],
  selectedExam: null,
  searchResults: [],
  statistics: null,
  pagination: { total: 0, skip: 0, take: 10, pages: 0 },
  loading: false,
  searchLoading: false,
  error: null,
};

// Async Thunks
export const fetchExams = createAsyncThunk(
  'exam/fetchExams',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const skip = (page - 1) * limit;
    const response = await axiosInstance.get(`/api/v1/admin/exams`, {
      params: { page, limit, skip, take: limit },
    });
    return response.data;
  }
);

export const fetchExamById = createAsyncThunk('exam/fetchExamById', async (id: string) => {
  const response = await axiosInstance.get(`/api/v1/admin/exams/${id}`);
  return response.data.data;
});

export const searchExams = createAsyncThunk(
  'exam/searchExams',
  async ({ q, limit = 10 }: { q: string; limit?: number }) => {
    const response = await axiosInstance.get(`/api/v1/admin/exams/search`, {
      params: { q, limit },
    });
    return response.data.data || [];
  }
);

export const getExamStatistics = createAsyncThunk('exam/getExamStatistics', async () => {
  const response = await axiosInstance.get(`/api/v1/admin/exams/statistics`);
  return response.data.data;
});

export const getExamsByStatus = createAsyncThunk(
  'exam/getExamsByStatus',
  async (status: 'UPCOMING' | 'ONGOING' | 'COMPLETED') => {
    const response = await axiosInstance.get(`/api/v1/admin/exams/status/${status}`);
    return response.data.data || [];
  }
);

export const getExamsByClass = createAsyncThunk(
  'exam/getExamsByClass',
  async (classId: string) => {
    const response = await axiosInstance.get(`/api/v1/admin/exams/class/${classId}`);
    return response.data.data || [];
  }
);

export const createExam = createAsyncThunk(
  'exam/createExam',
  async (payload: {
    name: string;
    classId: string;
    subjectId: string;
    date: string;
    duration: string;
    totalMarks: number;
    type: string;
    description?: string;
  }) => {
    const response = await axiosInstance.post(`/api/v1/admin/exams`, payload);
    return response.data.data;
  }
);

export const updateExam = createAsyncThunk(
  'exam/updateExam',
  async ({
    id,
    ...payload
  }: {
    id: string;
    name: string;
    date: string;
    duration: string;
    totalMarks: number;
    type: string;
    status: string;
  }) => {
    const response = await axiosInstance.put(`/api/v1/admin/exams/${id}`, payload);
    return response.data.data;
  }
);

export const deleteExam = createAsyncThunk('exam/deleteExam', async (id: string) => {
  await axiosInstance.delete(`/api/v1/admin/exams/${id}`);
  return id;
});

export const exportExamsCSV = createAsyncThunk(
  'exam/exportExamsCSV',
  async ({ search = '', status = '', classId = '' }: { search?: string; status?: string; classId?: string } = {}) => {
    const response = await axiosInstance.get(`/api/v1/admin/exams/export/csv`, {
      params: { search, status, classId },
      responseType: 'blob',
    });
    return response.data;
  }
);

// Slice
const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    clearSelectedExam: (state) => {
      state.selectedExam = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Exams
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.loading = false;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exams';
      });

    // Fetch Exam by ID
    builder
      .addCase(fetchExamById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.selectedExam = action.payload;
        state.loading = false;
      })
      .addCase(fetchExamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exam details';
      });

    // Search Exams
    builder
      .addCase(searchExams.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchExams.fulfilled, (state, action) => {
        state.searchResults = action.payload || [];
        state.searchLoading = false;
      })
      .addCase(searchExams.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Search failed';
      });

    // Get Exam Statistics
    builder
      .addCase(getExamStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });

    // Get Exams by Status
    builder.addCase(getExamsByStatus.fulfilled, (state, action) => {
      state.exams = action.payload;
    });

    // Get Exams by Class
    builder.addCase(getExamsByClass.fulfilled, (state, action) => {
      state.exams = action.payload;
    });

    // Create Exam
    builder
      .addCase(createExam.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create exam';
      });

    // Update Exam
    builder
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update exam';
      });

    // Delete Exam
    builder
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter((e) => e.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete exam';
      });

    // Export CSV
    builder
      .addCase(exportExamsCSV.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportExamsCSV.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportExamsCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export exams';
      });
  },
});

export const { clearSelectedExam, clearSearchResults } = examSlice.actions;
export default examSlice.reducer;
