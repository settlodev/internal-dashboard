import React from 'react'

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
            <span className="mb-4 text-lg font-semibold">You are not authorized to view this page</span>
            <img src="/401.svg" alt="lock" width={250} height={250} />
        </div>
  )
}
