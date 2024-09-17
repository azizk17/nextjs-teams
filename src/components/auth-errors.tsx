"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export function AuthErrors() {
    const [open, setOpen] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get('auth') === 'false') {
            setOpen(true)
        }
    }, [searchParams])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Authentication Error</AlertDialogTitle>
                    <AlertDialogDescription>
                        There was an error with your authentication. Please try logging in again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setOpen(false)}>Okay</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}