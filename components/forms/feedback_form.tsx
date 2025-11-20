
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {FeedbackSchema} from "@/types/owners/feedbackSchema";
import {recordFeedback} from "@/lib/actions/business-owners";
import FollowUpTypeSelector from "@/components/widgets/followUpSelector";
import CancelButton from "@/components/widgets/cancel-button";
import {Separator} from "@radix-ui/react-menu";
import SubmitButton from "@/components/widgets/submit-button";
import {useRouter} from "next/navigation";

type FeedbackFormData = z.infer<typeof FeedbackSchema>

interface RecordFeedbackFormProps {
    ownerId: string
    onSuccess: () => void
}

export function RecordFeedbackForm({ ownerId, onSuccess }: RecordFeedbackFormProps) {
    const [showArchiveCheckbox, setShowArchiveCheckbox] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<FeedbackFormData>({
        resolver: zodResolver(FeedbackSchema),
        defaultValues: {
            userId: ownerId,
            archiveAccountOptions: { archiveAccount: false }
        }
    })


    const selectedFollowUpType = watch('internalFollowUpTypeId')

    // Handle follow-up type selection
    const handleFollowUpTypeChange = (value: string | any) => {
        const followUpTypeId = typeof value === 'object' ? value.id : value
        setValue('internalFollowUpTypeId', followUpTypeId)

        const isArchiveAccount = followUpTypeId === 'a6ae3ebc-359a-4069-b00e-21b1fdb5c467'
        setShowArchiveCheckbox(isArchiveAccount)

        // Auto-check the archive checkbox when Archive Account is selected
        if (isArchiveAccount) {
            setValue('archiveAccountOptions.archiveAccount', true)
        } else {
            setValue('archiveAccountOptions.archiveAccount', false)
        }
    }

    const handleArchiveCheckboxChange = (checked: boolean) => {
        setValue('archiveAccountOptions.archiveAccount', checked)
    }

    const onSubmit = async (data: FeedbackFormData) => {
        setIsSubmitting(true)

        const submitValues = {
         ...data,
         nextFollowUpDate: data.nextFollowUpDate
           ? new Date(data.nextFollowUpDate).toISOString()
           : undefined
  };
        try {
            const result = await recordFeedback(submitValues)

            if (result ) {
                onSuccess()
                router.push('/unverified-emails')
            } else {
                // Handle error case
                console.error('Failed to submit feedback')
            }
        } catch (error) {
            console.error('Error submitting feedback:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Follow-up Type Selector */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Follow-up Type *</label>
                <FollowUpTypeSelector
                    placeholder="Select follow up type"
                    value={selectedFollowUpType}
                    onChange={handleFollowUpTypeChange}
                />
                {errors.internalFollowUpTypeId && (
                    <p className="text-sm text-red-600">{errors.internalFollowUpTypeId.message}</p>
                )}
            </div>

            {/* Archive Account Checkbox - Conditionally Rendered */}
            {showArchiveCheckbox && (
                <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={watch('archiveAccountOptions.archiveAccount')}
                            onChange={(e) => handleArchiveCheckboxChange(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">Archive this account</span>
                    </label>
                    <p className="text-xs text-gray-600">
                        This account will be archived upon submission
                    </p>
                </div>
            )}

            {/* Next Follow-up Date */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Next Follow-up Date</label>
                <input
                    type="date"
                    {...register('nextFollowUpDate')}
                    className="w-full p-2 border rounded-md text-sm"
                />
                {errors.nextFollowUpDate && (
                    <p className="text-sm text-red-600">{errors.nextFollowUpDate.message}</p>
                )}
            </div>

            {/* Remarks */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Remarks *</label>
                <textarea
                    {...register('remarks')}
                    rows={4}
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="Enter your remarks..."
                />
                {errors.remarks && (
                    <p className="text-sm text-red-600">{errors.remarks.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex h-5 items-center space-x-4 mt-10">
                <CancelButton />
                <Separator />
                <SubmitButton isPending={isSubmitting} label="Record" />
                </div>
        </form>
    )
}

export default RecordFeedbackForm