'use client'
import { getRole } from '@/lib/role-action'
import { UUID } from 'crypto'
import React from 'react'

export default async function RolePage({params}:{params:{id:string}}) {
    
    const item = await getRole(params.id as UUID)
    console.log(item)
  return (
    <div>
      <p>{item.name}</p>
    </div>
  )
}
