"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import qs from 'qs'

export function ProjectFilterForm({ trigger }: { trigger: React.ReactNode }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

    useEffect(() => {
        const platformParam = searchParams.get('platform')
        setSelectedPlatforms(platformParam ? platformParam.split(',') : [])
    }, [searchParams])

    const platforms = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube']

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const currentParams = qs.parse(searchParams.toString())
        const newParams = {
            ...currentParams,
            platform: selectedPlatforms.join(',')
        }
        const queryString = qs.stringify(newParams, { arrayFormat: 'comma' })
        router.push(`?${queryString}`)
    }

    function handlePlatformChange(platform: string, checked: boolean) {
        setSelectedPlatforms(prev =>
            checked
                ? [...prev, platform.toLowerCase()]
                : prev.filter(p => p !== platform.toLowerCase())
        )
    }

    return (
        <Dialog>
            <DialogTrigger >
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <Label className="text-base">Social Media Platforms</Label>
                        <div className="mt-2 space-y-2">
                            {platforms.map((platform) => (
                                <div key={platform} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={platform}
                                        checked={selectedPlatforms.includes(platform.toLowerCase())}
                                        onCheckedChange={(checked) =>
                                            handlePlatformChange(platform, checked as boolean)
                                        }
                                    />
                                    <Label htmlFor={platform} className="font-normal">
                                        {platform}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Apply Filters
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}