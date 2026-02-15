import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { formatSemesterNumber } from '@/lib/formatters'
import type { BatchDetailResponse } from '@repo/schemas'

interface BatchInfoCardsProps {
  batch: BatchDetailResponse
}

function BatchInfoCards({ batch }: BatchInfoCardsProps) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Batch Year</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{batch.batchYear}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Current Semester</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {batch.currentSemester
              ? `${formatSemesterNumber(batch.currentSemester.semesterNumber)} Semester `
              : 'No Semester for this batch'}{' '}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Students</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{batch.totalStudents}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Status</CardDescription>
        </CardHeader>
        <CardContent>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${
              batch.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {batch.isActive ? 'Active' : 'Inactive'}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}

export { BatchInfoCards }
