import React from 'react'
import { Card, CardContent } from '../ui/card'
import { AlertTriangle, CheckCircle, Store, Tag } from 'lucide-react'

export default function SummaryCard({metrics}: any) {
    
  // Define the card data with all needed properties
  const cardData = [
    {
      title: "Total Businesses",
      value: metrics.totalBusinesses,
      icon: Store,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Active Subscription",
      value: metrics.activeSubscription,
      // suffix: `(${((metrics.activeSubscription / metrics.totalBusinesses) * 100).toFixed(1)}%)`,
      suffix: `(${!metrics.activeSubscription || metrics.totalBusinesses === 0
        ? '0'
        : ((metrics.activeSubscription / metrics.totalBusinesses) * 100).toFixed(1)}%)`,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Trial Subscription",
      value: metrics.trialSubscription,
      suffix: `(${!metrics.trialSubscription || metrics.totalBusinesses === 0
        ? '0'
        : ((metrics.trialSubscription / metrics.totalBusinesses) * 100).toFixed(1)}%)`,
      icon: Tag,
      bgColor: "bg-gray-100",
      textColor: "text-red-300"
    },

    {
      title: "Almost Due Subscription",
      value: metrics.almostDueSubscription,
      suffix: `(${!metrics.almostDueSubscription || metrics.totalBusinesses === 0
        ? '0'
        : ((metrics.almostDueSubscription / metrics.totalBusinesses) * 100).toFixed(1)}%)`,
      icon: AlertTriangle,
      bgColor: "bg-yellow-600",
      textColor: "text-white"
    },
    {
      title: "Due Subscription",
      value: metrics.dueSubscription,
      suffix: `(${!metrics.dueSubscription || metrics.totalBusinesses === 0
        ? '0'
        : ((metrics.dueSubscription / metrics.totalBusinesses) * 100).toFixed(1)}%)`,
      icon: AlertTriangle,
      bgColor: "bg-orange-500",
      textColor: "text-white"
    },
    {
      title: "Expired Subscription",
      value: metrics.expiredSubscription,
      suffix: `(${!metrics.expiredSubscription || metrics.totalBusinesses === 0
        ? '0'
        : ((metrics.expiredSubscription / metrics.totalBusinesses) * 100).toFixed(1)}%)`,
      icon: AlertTriangle,
      bgColor: "bg-red-600",
      textColor: "text-white"
    },

    // {
    //   title: "Businesses With VDF",
    //   value: metrics.businessesWithVFD,
    //   suffix: `(${((metrics.businessesWithVFD / metrics.totalBusinesses) * 100).toFixed(1)}%)`,
    //   icon: CheckCircle,
    //   bgColor: "bg-green-100",
    //   textColor: "text-green-600"
    // },
   
    
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-2">
      {cardData.map((card, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold">
                  {card.value}
                  {card.suffix && <span className="hidden md:block lg:block text-sm text-gray-500"> {card.suffix}</span>}
                </h3>
              </div>
              <div className={`hidden md:block lg:block ${card.bgColor} p-3 rounded-full`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}