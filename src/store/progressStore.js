import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useProgressStore = create(
  persist(
    (set, get) => ({
      // { "course1": [0, 1, 5] }
      completed: {},

      markComplete: (courseId, lessonIndex) => {
        const current = get().completed[courseId] || []
        if (!current.includes(lessonIndex)) {
          set({
            completed: {
              ...get().completed,
              [courseId]: [...current, lessonIndex],
            },
          })
        }
      },

      markIncomplete: (courseId, lessonIndex) => {
        const current = get().completed[courseId] || []
        set({
          completed: {
            ...get().completed,
            [courseId]: current.filter((i) => i !== lessonIndex),
          },
        })
      },

      isComplete: (courseId, lessonIndex) => {
        const current = get().completed[courseId] || []
        return current.includes(lessonIndex)
      },

      getProgress: (courseId, total) => {
        const current = get().completed[courseId] || []
        return { completed: current.length, total }
      },
    }),
    { name: 'course-progress' }
  )
)

export default useProgressStore
