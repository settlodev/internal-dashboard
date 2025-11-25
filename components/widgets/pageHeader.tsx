'use client'

interface PageHeaderProps {
    title: string
    description: string
    totalCount: number
    badgeColor?: 'red' | 'orange' | 'blue' | 'green'
}

const badgeStyles = {
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
}

export function PageHeader({
                               title,
                               description,
                               totalCount,
                               badgeColor = 'blue',
                           }: PageHeaderProps) {
    return (
        <div className='flex flex-col lg:flex-row items-start gap-6 lg:items-center lg:justify-between w-full'>
            {/* Header Content */}
            <div className='flex flex-col gap-3 flex-1 min-w-0'>
                <div className='flex items-baseline gap-3 flex-wrap'>
                    <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
                        {title}
                    </h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${badgeStyles[badgeColor]}`}>
                        {totalCount.toLocaleString()}
                    </span>
                </div>

                <div className='flex flex-col gap-1.5'>
                    <p className='text-sm text-muted-foreground leading-relaxed'>
                        {description}
                    </p>

                </div>
            </div>

        </div>
    )
}