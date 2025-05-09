import React from 'react'
import { Card, CardContent } from '../ui/card'
import { AlertTriangle, CheckCircle, Store, Tag } from 'lucide-react'

import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

export default function SummaryCard({metrics}: any) {
    
  // Define the card data with all needed properties and descriptions
  const cardData = [
    {
      title: "Total Locations",
      value: metrics.totalLocations,
      icon: Store,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: "The complete count of all locations in the system, regardless of their subscription status."
    },
    {
      title: "Active Locations",
      value: metrics.activeLocations,
      suffix: `(${!metrics.activeLocations || metrics.totalLocations === 0
        ? '0'
        : ((metrics.activeLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      description: "Locations with a current, paid subscription that is in good standing."
    },
    {
      title: "Trial Locations",
      value: metrics.trialLocations,
      suffix: `(${!metrics.trialLocations || metrics.totalLocations === 0
        ? '0'
        : ((metrics.trialLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
      icon: Tag,
      bgColor: "bg-gray-100",
      textColor: "text-red-300",
      description: "Locations that are currently in a trial period, testing the service before committing to a paid subscription."
    },  
    {
      title: "Almost Due Locations",
      value: metrics.almostDueLocations,
      suffix: `(${!metrics.almostDueLocations || metrics.totalLocations === 0
        ? '0'
        : ((metrics.almostDueLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
      icon: AlertTriangle,
      bgColor: "bg-yellow-500",
      textColor: "text-white",
      description: "Locations with subscriptions that will expire soon and require attention to prevent interruption of service."
    },
    {
      title: "Due Locations",
      value: metrics.dueLocations,
      suffix: `(${!metrics.dueLocations || metrics.totalLocations === 0
        ? '0'
        : ((metrics.dueLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
      icon: AlertTriangle,
      bgColor: "bg-orange-500",
      textColor: "text-white",
      description: "Locations whose subscriptions have reached their renewal date but haven't yet been renewed. They may be in a grace period."
    },
    {
      title: "Expired Locations",
      value: metrics.expiredLocations,
      // suffix: `(${((metrics.expiredLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
      suffix: `(${!metrics.expiredLocations || metrics.totalLocations === 0
        ? '0'
        : ((metrics.expiredLocations / metrics.totalLocations) * 100).toFixed(1)}%)`,
      icon: AlertTriangle,
      bgColor: "bg-red-500",
      textColor: "text-white",
      description: "Locations whose subscriptions have lapsed beyond any grace period and are no longer receiving service."
    }
  ]

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {cardData.map((card, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{card.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <h3 className="text-2xl font-bold">
                    {card.value}
                    {card.suffix && <span className="text-sm text-gray-500 hidden md:block lg:block"> {card.suffix}</span>}
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
    </TooltipProvider>
  )
}