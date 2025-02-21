import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

import React from "react"

  interface BreadcrumbItemType {
    title:string,
    link:string
  }

  interface BreadcrumbNavProps {
    items: BreadcrumbItemType[]
  }
  
  export function BreadcrumbNav({items}: BreadcrumbNavProps) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {
            items.map((item) => (
              <React.Fragment key={item.title}>
                 <BreadcrumbSeparator />  
              <BreadcrumbItem key={item.title}>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
               </React.Fragment>
            ))
          }
    
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
  