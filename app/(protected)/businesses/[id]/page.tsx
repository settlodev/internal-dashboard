import { BreadcrumbNav } from "@/components/layout/breadcrumbs";
import { getBusiness } from "@/lib/actions/business";
import { UUID } from "crypto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Settings,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Store
} from 'lucide-react';
import { Location } from "@/types/location/type";


const BusinessDetailPage =async ({params}:{params:{id:string}}) => {
    const business = await getBusiness(params.id as UUID)
    const breadcrumbItems = [
        { title: "Businesses", link: "/businesses" },
        { title: business.name, link: "" },
    ]
    return (
        <div className={`flex-1 space-y-2 md:p-8 pt-4`}>
            <div className={`flex items-center justify-between mb-2`}>
                <div className={`relative flex-1 md:max-w-md`}>
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>

            <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            {business.logo ? (
              <img 
                src={business.logo} 
                alt={business.name} 
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl">{business.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant={business.status ? "outline" : "destructive"} className="">
                  {business.status ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary">{business.businessTypeName}</Badge>
                {business.vfdRegistrationState && (
                  <Badge variant="outline">VFD Registered</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Business Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Business Information</h3>
              <div className="space-y-2 text-sm">
                <p>Prefix: {business.prefix}</p>
                <p>Business ID: {business.id}</p>
                {business.identificationNumber && (
                  <p>ID Number: {business.identificationNumber}</p>
                )}
                {business.tax && <p>Tax: {business.tax}</p>}
                {business.vrn && <p>VRN: {business.vrn}</p>}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Contact & Social</h3>
              <div className="space-y-2">
                {business.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a href={business.website} className="text-blue-600 hover:underline">{business.website}</a>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  {business.facebook && <Facebook className="w-5 h-5 text-gray-600" />}
                  {business.twitter && <Twitter className="w-5 h-5 text-gray-600" />}
                  {business.instagram && <Instagram className="w-5 h-5 text-gray-600" />}
                  {business.linkedin && <Linkedin className="w-5 h-5 text-gray-600" />}
                  {business.youtube && <Youtube className="w-5 h-5 text-gray-600" />}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Location Details</h3>
              <p className="text-sm">Total Locations: {business.totalLocations}</p>
              <p className="text-sm">Country: {business.countryName}</p>
            </div>
          </div>

          {/* Locations */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Business Locations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {business.allLocations.map((location:Location) => (
                <Card key={location.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{location.name}</h4>
                        <div className="space-y-2 mt-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{location.phone}</span>
                          </div>
                          {location.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{location.email}</span>
                            </div>
                          )}
                          {location.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{location.address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{location.openingTime} - {location.closingTime}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={location.status ? "outline" : "destructive"}>
                        {location.status ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Location Settings */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span className="font-medium">Settings</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <span>Currency: {location.settings.currencyCode}</span>
                        <span>Min Settlement: {location.settings.minimumSettlementAmount}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {location.settings.ecommerceEnabled && (
                          <Badge variant="outline">E-commerce</Badge>
                        )}
                        {location.settings.useRecipe && (
                          <Badge variant="outline">Recipe</Badge>
                        )}
                        {location.settings.useDepartments && (
                          <Badge variant="outline">Departments</Badge>
                        )}
                        {location.settings.useWarehouse && (
                          <Badge variant="outline">Warehouse</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
            
        </div>
    );
};

export default BusinessDetailPage