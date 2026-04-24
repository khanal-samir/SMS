'use client'

import { useParams } from 'next/navigation'
import { useMyStudentDetail, useStudentDetail } from '@/hooks/useUser'
import { StudentDetailView } from '@/components/student/student-detail-view'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'

interface StudentDetailPageBaseProps {
  backButton?: {
    href: string
    label: string
  }
  title?: string
  description: string
  loadingMessage: string
  notFoundTitle: string
  notFoundMessage: string
}

interface ParamStudentDetailPageProps extends StudentDetailPageBaseProps {
  studentIdParam?: 'id' | 'studentId'
  backButtonFromParam?: {
    prefix: string
    param: 'id' | 'studentId'
    label: string
  }
}

function StudentDetailPageContent({
  student,
  isLoading,
  backButton,
  title,
  description,
  loadingMessage,
  notFoundTitle,
  notFoundMessage,
}: StudentDetailPageBaseProps & {
  student: ReturnType<typeof useStudentDetail>['data']
  isLoading: boolean
}) {
  if (isLoading) {
    return <LoadingState message={loadingMessage} />
  }

  if (!student) {
    return <NotFoundState title={notFoundTitle} message={notFoundMessage} backButton={backButton} />
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title={title ?? student.name}
          description={description}
          backButton={backButton}
        />
        <StudentDetailView student={student} />
      </div>
    </div>
  )
}

export function ParamStudentDetailPage({
  studentIdParam = 'id',
  backButton,
  backButtonFromParam,
  ...props
}: ParamStudentDetailPageProps) {
  const params = useParams()
  const studentId = params[studentIdParam] as string
  const query = useStudentDetail(studentId)

  const resolvedBackButton =
    backButton ??
    (backButtonFromParam
      ? {
          href: `${backButtonFromParam.prefix}/${params[backButtonFromParam.param] as string}`,
          label: backButtonFromParam.label,
        }
      : undefined)

  return (
    <StudentDetailPageContent
      student={query.data}
      isLoading={query.isLoading}
      backButton={resolvedBackButton}
      {...props}
    />
  )
}

export function SelfStudentDetailPage(props: StudentDetailPageBaseProps) {
  const query = useMyStudentDetail()

  return <StudentDetailPageContent student={query.data} isLoading={query.isLoading} {...props} />
}
