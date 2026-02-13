export const formatShortDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const semesterLabelMap: Record<string, string> = {
  FIRST: '1st',
  SECOND: '2nd',
  THIRD: '3rd',
  FOURTH: '4th',
  FIFTH: '5th',
  SIXTH: '6th',
  SEVENTH: '7th',
  EIGHTH: '8th',
}

export const formatSemesterNumber = (semesterNumber: string) =>
  semesterLabelMap[semesterNumber] ?? semesterNumber
