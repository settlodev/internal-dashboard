import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { UUID } from "crypto";
import { getLocation } from "@/lib/actions/location";
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
  Ban,
  ShoppingCart,
  Bell,
  ClipboardList,
  Lock,
  Users,
  DollarSign,
  Warehouse,
  Calendar,
  Box
} from 'lucide-react';


const LocationDetailPage =async ({params}:{params:{id:string}}) => {
    const location = await getLocation(params.id as UUID)
  
    const breadcrumbItems = [
        { title: "locations", link: "/locations" },
        { title: location.name, link: "" },
    ]

    const FeatureItem = ({ enabled, title, icon: Icon }: { enabled: boolean, title: string, icon: any }) => (
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
    return (
        <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>

            <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Store className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{location.name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant={location.status ? "default" : "destructive"}>
                    {location.status ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="secondary">{location.locationBusinessTypeName}</Badge>
                  <Badge variant="outline">{location.subscriptionStatus}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8">
          {/* Contact & Location Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
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
                  <div className="flex items-start gap-2">
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
                  <span>
                    {location.openingTime} - {location.closingTime}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Settings Overview */}
            <Card>
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

          {/* Features Grid */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Enabled Features</h3>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
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

          <Card>
        <CardHeader>
          <h3 className="font-semibold">Location Subscriptions</h3>
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>
        </CardContent>
        
      </Card>

      
      
        
        </div>
    );
};

export default LocationDetailPage