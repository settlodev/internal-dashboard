'use client'
import BusinessTypeForm from '@/components/forms/business_type_form'
import { BreadcrumbNav } from '@/components/layout/breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getBusinessType } from '@/lib/actions/business-types'
import { BusinessType } from '@/types/business/types'
import { UUID } from 'crypto'
import React from 'react'

export default async function BusinessTypePage({params}:{params:{id:string}}) {
  const isNewItem = params.id === "new"
  let item: BusinessType | null | undefined = null

  if (!isNewItem) {
    try {
      item = await getBusinessType(params.id as UUID)
    } catch (error) {
      console.log(error)
      throw new Error("Failed to load business type details")
    }
  }
  const breadCrumbItems = [
    { title: "Business Types", link: "/business-types" },
    { title: isNewItem ? "New" : "Edit", link: "" },
  ]
  return (
    
    <div className={`flex-1 space-y-4 p-4 md:p-8 pt-6`}>
    <div className={`flex items-center justify-between mb-2`}>
        <div className={`relative flex-1 `}>
            <BreadcrumbNav items={breadCrumbItems}/>
        </div>
    </div>
    <BusinessTypeCard isNewItem={isNewItem} item={item}/>
</div>
  )
}

const BusinessTypeCard =({isNewItem,item}:{
  isNewItem:boolean,
  item: BusinessType | null | undefined
}) =>(
  <Card>
     <CardHeader>
         <CardTitle>
             {isNewItem ? "Add Business Type" : "Edit business type"}
         </CardTitle>
         <CardDescription>
             {isNewItem ? "Add business type": "Edit business type details"}
         </CardDescription>
     </CardHeader>
      <CardContent>
          <BusinessTypeForm item={item}/>
      </CardContent>
  </Card>
)
