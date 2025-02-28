import React from 'react'
import { Card, CardContent } from '../ui/card'
import { AlertTriangle, CheckCircle, Store, Tag } from 'lucide-react'

export default function SummaryCard({metrics}: any) {
    
  // Define the card data with all needed properties
  const cardData = [
    {
      title: "Total Locations",
      value: metrics.totalLocations,
      icon: Store,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Active Locations",
      value: metrics.activeLocations,
      suffix: `(${((metrics.activeLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
        title: "Trial Locations",
        value: metrics.trialLocations,
        suffix: `(${((metrics.trialLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
        icon: Tag,
        bgColor: "bg-gray-100",
        textColor: "text-red-300"
      },
      {
        title: "Expired Locations",
        value: metrics.expiredLocations,
        suffix: `(${((metrics.expiredLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
        icon: AlertTriangle,
        bgColor: "bg-red-500",
        textColor: "text-white"
      },
    
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {cardData.map((card, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold">
                  {card.value}
                  {card.suffix && <span className="text-sm text-gray-500"> {card.suffix}</span>}
                </h3>
              </div>
              <div className={`${card.bgColor} p-3 rounded-full`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}