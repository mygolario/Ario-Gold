"use client"

import Link from "next/link"
import { DocumentStatus, DocumentType } from "@prisma/client"
import { useFormState } from "react-dom"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { uploadDocumentAction, type UploadActionState } from "./actions"

const statusLabels: Record<DocumentStatus, string> = {
  DOC_PENDING: "در صف بررسی",
  DOC_APPROVED: "تایید شده",
  DOC_REJECTED: "رد شده",
}

const statusVariants: Record<DocumentStatus, "default" | "secondary" | "destructive"> = {
  DOC_PENDING: "default",
  DOC_APPROVED: "secondary",
  DOC_REJECTED: "destructive",
}

const initialState: UploadActionState = { status: "idle", message: "" }

export function UploadCard(props: {
  type: DocumentType
  title: string
  description: string
  document?: { status: DocumentStatus; fileUrl: string }
}) {
  const [state, formAction] = useFormState(uploadDocumentAction, initialState)

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center justify-between text-base">
          {props.title}
          {props.document && (
            <Badge variant={statusVariants[props.document.status]}>{statusLabels[props.document.status]}</Badge>
          )}
        </CardTitle>
        <p className="text-sm text-slate-500">{props.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {props.document?.fileUrl && (
          <Link href={props.document.fileUrl} target="_blank" className="text-sm text-blue-600">
            مشاهده فایل ارسال شده
          </Link>
        )}
        <form action={formAction} encType="multipart/form-data" className="space-y-3" dir="rtl">
          <input type="hidden" name="type" value={props.type} />
          <div className="space-y-2">
            <Label htmlFor={`document-${props.type}`}>انتخاب فایل</Label>
            <Input id={`document-${props.type}`} name="document" type="file" accept="image/*,.pdf" required />
          </div>
          {state.status !== "idle" && (
            <Alert variant={state.status === "success" ? "default" : "destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            ارسال مدرک
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
