'use client'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { BadgePlus, CheckCircle, Store } from 'lucide-react'

export default function SummaryCard({ metrics }: any) {

  // console.log("The metrics are ", metrics )

  // Define the card data with all needed properties
  const cardData = [
    {
      title: "Total Businesses Owners",
      value: metrics.totalBusinessesOwners,
      icon: Store,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Migrated Business Owners",
      value: metrics.migratedAccounts,
      suffix: `(${!metrics.totalBusinessesOwners || metrics.totalBusinessesOwners === 0
        ? '0'
        : ((metrics.migratedAccounts / metrics.totalBusinessesOwners) * 100).toFixed(1)}%)`,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "New Business Owners",
      value: metrics.newBusinesses,
      suffix: `(${!metrics.totalBusinessesOwners || metrics.totalBusinessesOwners === 0
        ? '0'
        : ((metrics.newBusinesses / metrics.totalBusinessesOwners) * 100).toFixed(1)}%)`,
      icon: BadgePlus,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },

  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8 mt-4">
        {/* Gender Distribution */}
        {Object.keys(metrics.genderDistribution).length === 0 || metrics.totalBusinessesOwners === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Gender Distribution</h2>
            <p className="text-gray-500 text-center py-4">No records for today</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Gender Distribution</h2>
            <div className="space-y-3">
              {Object.entries(metrics.genderDistribution).map(([gender, count]) => (
                <div key={gender} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">{gender}</div>
                  <div className="flex-1 mx-2">
                    <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${gender === 'FEMALE' ? 'bg-pink-500' :
                            gender === 'MALE' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}
                        style={{ width: `${(Number(count) / metrics.totalBusinessesOwners) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium">
                    {((Number(count) / metrics.totalBusinessesOwners) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Completion */}
        {metrics.totalBusinessesOwners === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile Completion</h2>
            <p className="text-gray-500 text-center py-4">No records for today</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile Completion</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Business Information</span>
                  <span className="text-sm font-medium text-gray-700">
                    {metrics.fullyCompleted} of {metrics.totalBusinessesOwners} ({((metrics.businessCompleted / metrics.totalBusinessesOwners) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-green-500"
                    style={{ width: `${(metrics.businessCompleted / metrics.totalBusinessesOwners) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Location Information</span>
                  <span className="text-sm font-medium text-gray-700">
                    {metrics.fullyCompleted} of {metrics.totalBusinessesOwners} ({((metrics.locationCompleted / metrics.totalBusinessesOwners) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-blue-500"
                    style={{ width: `${(metrics.locationCompleted / metrics.totalBusinessesOwners) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Fully Completed Profiles</span>
                  <span className="text-sm font-medium text-gray-700">
                    {metrics.fullyCompleted} of {metrics.totalBusinessesOwners} ({((metrics.fullyCompleted / metrics.totalBusinessesOwners) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-purple-500"
                    style={{ width: `${(metrics.fullyCompleted / metrics.totalBusinessesOwners) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Country Distribution */}
        {/* Geographic Distribution */}
        {Object.keys(metrics.countryDistribution).length === 0 || metrics.totalBusinessesOwners === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Geographic Distribution</h2>
            <p className="text-gray-500 text-center py-4">No records for today</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Geographic Distribution</h2>
            <div className="space-y-3">
              {Object.entries(metrics.countryDistribution).map(([country, count]) => (
                <div key={country} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">{country}</div>
                  <div className="flex-1 mx-2">
                    <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${(Number(count) / metrics.totalBusinessesOwners) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium">
                    {Number(count)} ({((Number(count) / metrics.totalBusinessesOwners) * 100).toFixed(0)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Status */}
        {metrics.totalBusinessesOwners === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Account Status</h2>
            <p className="text-gray-500 text-center py-4">No records for today</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Account Status</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Email Verification</span>
                  <span className="text-sm font-medium text-gray-700">
                    {metrics.emailVerified} of {metrics.totalBusinessesOwners} ({metrics.emailVerifiedPercentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-green-500"
                    style={{ width: `${metrics.emailVerifiedPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Migrated Accounts</span>
                  <span className="text-sm font-medium text-gray-700">
                    {metrics.migratedAccounts} of {metrics.totalBusinessesOwners} ({metrics.migratedPercentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-amber-500"
                    style={{ width: `${metrics.migratedPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Referral Program</span>
                  <span className="text-sm font-medium text-gray-700">
                    {metrics.referredOwners} of {metrics.totalBusinessesOwners} ({metrics.referralPercentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-purple-500"
                    style={{ width: `${metrics.referralPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>

  )
}