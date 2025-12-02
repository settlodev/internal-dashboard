// location-detail-client.tsx
'use client'
import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Settings,
  Check,
  X,
  Store,
  ShoppingCart,
  Bell,
  ClipboardList,
  Lock,
  Users,
  DollarSign,
  Warehouse,
  Calendar,
  Box,
} from 'lucide-react';
import { ActiveSubscription } from "@/types/location/type";
// import { useState } from "react";
// import { SubscriptionDialog } from "./dialog";
// import { LocationSubscriptions } from "./subscriptionPaymentsTable";
// import { getLocationSubscriptionPayments } from "@/lib/actions/location";
import { LocationStatistics } from "./location-stats";
import { LocationActivity } from "./location-logs";
import { ProtectedComponent } from "../auth/protectedComponent";

const FeatureItem = ({ enabled, title, icon: Icon }: { enabled: boolean; title: string; icon: any }) => (
  <div className="flex items-center gap-2 text-sm">
    {enabled ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-gray-300" />
    )}
    <div className="flex items-center gap-1">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className={enabled ? "text-gray-900" : "text-gray-400"}>{title}</span>
    </div>
  </div>
);

const LocationDetailClient = ({ location, activeSubscription, statistics, activityLogs }: { location: any; activeSubscription: ActiveSubscription | null, statistics: any, activityLogs: any }) => {
  // const [, setIsModalOpen] = useState<boolean>(false);
  // const [, setInitialPayments] = useState(payments);
  const breadcrumbItems = [
    { title: "locations", link: "/locations" },
    { title: location.name, link: "" },
  ];





  const getSubscriptionStatusBadge = (status: string) => {
    switch (status) {
      case 'OK':
        return {
          text: 'ACTIVE',
          variant: 'default'
        };
      case 'DUE':
        return {
          text: 'DUE',
          variant: 'destructive'
        };
      case 'ALMOST_DUE':
        return {
          text: 'ALMOST DUE',
          variant: 'warning'
        };
      case 'SUSPENDED':
        return {
          text: 'SUSPENDED',
          variant: 'outline'
        };
      default:
        return {
          text: status,
          variant: 'secondary'
        };
    }
  };

  const statusBadge = getSubscriptionStatusBadge(location.subscriptionStatus);



  return (
    <div className="flex-1 space-y-4 px-2 sm:px-4 md:px-8 pt-4">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-2">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
            {/* Left - Business Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Store className="w-9 h-9 text-gray-600" />
              </div>
              <div>
                <CardTitle className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{location.businessName}</span>
                  <span className="text-xl font-medium lg:text-2xl">{location.name}</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{location.locationBusinessTypeName}</Badge>
                  <Badge variant={statusBadge.variant as 'default' | 'destructive' | 'outline' | 'secondary'}>
                    {statusBadge.text}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right - Subscription Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
              <div>
                <CardTitle className="text-xl lg:text-2xl font-medium">Subscription status</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant={statusBadge.variant as 'default' | 'destructive' | 'outline' | 'secondary'}>
                    {statusBadge.text}
                  </Badge>
                  {activeSubscription?.subscription ? (
                    <>
                      <Badge variant="secondary">
                        {Intl.NumberFormat().format(activeSubscription.subscription.amount)}
                      </Badge>
                      <Badge variant="outline">{activeSubscription.subscription.packageName}</Badge>
                    </>
                  ) : (
                    <Badge variant="secondary">No active subscription</Badge>
                  )}
                </div>
              </div>

            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8">
          {/* Contact Info & System Settings */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Info */}
            <Card className="w-full">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Contact Information
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{location.phone}</span>
                </div>
                {location.email && location.email !== 'null' && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{location.email}</span>
                  </div>
                )}
                {(location.address || location.street || location.city || location.region) && (
                  <div className="flex items-start gap-2 capitalize">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      {location.street && <div>{location.street}</div>}
                      {location.city && <div>{location.city}</div>}
                      {location.region && <div>{location.region}</div>}
                      {location.address && <div>{location.address}</div>}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{location.openingTime} - {location.closingTime}</span>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="w-full">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-2 mb-4">
                  <div>
                    <span className="text-gray-500 text-sm">Currency</span>
                    <p className="font-medium">{location.settings.currencyCode}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Min Settlement</span>
                    <p className="font-medium">{location.settings.minimumSettlementAmount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card className="w-full">
            <CardHeader>
              <h3 className="font-semibold">Enabled Features</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FeatureItem enabled={location.settings.ecommerceEnabled} title="E-commerce" icon={ShoppingCart} />
                <FeatureItem enabled={location.settings.enableNotifications} title="Notifications" icon={Bell} />
                <FeatureItem enabled={location.settings.useRecipe} title="Recipe System" icon={ClipboardList} />
                <FeatureItem enabled={location.settings.usePasscode} title="Passcode Security" icon={Lock} />
                <FeatureItem enabled={location.settings.useDepartments} title="Departments" icon={Users} />
                <FeatureItem enabled={location.settings.useCustomPrice} title="Custom Pricing" icon={DollarSign} />
                <FeatureItem enabled={location.settings.useWarehouse} title="Warehouse" icon={Warehouse} />
                <FeatureItem enabled={location.settings.useShifts} title="Shift Management" icon={Calendar} />
                <FeatureItem enabled={location.settings.useKds} title="Kitchen Display" icon={Box} />
              </div>
            </CardContent>
          </Card>

          {/* Stats, Activity, Subscriptions */}
          <ProtectedComponent
            requiredPermissions={['view:location-statistics']}
          >
            <LocationStatistics statistics={statistics} />
          </ProtectedComponent>

          <LocationActivity activityLogs={activityLogs} />
          {/* <LocationSubscriptions payments={payments} onPageChange={handlePageChange} /> */}
        </CardContent>
      </Card>
    </div>

  );
};

export default LocationDetailClient;