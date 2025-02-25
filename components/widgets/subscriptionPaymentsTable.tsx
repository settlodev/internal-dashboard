'use client'
import { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge, Calendar, Check, CreditCard, X } from "lucide-react";
import { Payment } from "@/types/location/type";
import { Card, CardContent, CardHeader } from "../ui/card";

interface PaginationInfo {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  }
  
  interface SubscriptionPaymentsProps {
    payments: {
      content: Payment[];
      pageable: {
        pageNumber: number;
        pageSize: number;
      };
      totalPages: number;
      totalElements: number;
    };
    onPageChange: (page: number) => void;
  }
  
  const SubscriptionPaymentsTable: React.FC<SubscriptionPaymentsProps> = ({ 
    payments, 
    onPageChange 
  }) => {
    const { content, pageable, totalPages, totalElements } = payments;
    const [currentPage, setCurrentPage] = useState(pageable.pageNumber);
    
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      onPageChange(page);
    };
    
    // Function to format currency based on location settings
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'TZS', // This should come from location settings
        minimumFractionDigits: 0,
      }).format(amount);
    };
  
    // Generate pagination items
    const renderPaginationItems = () => {
      const items = [];
      const maxVisiblePages = 5;
      
      // Always show first page
      items.push(
        <PaginationItem key="first">
          <PaginationLink 
            onClick={() => handlePageChange(0)}
            isActive={currentPage === 0}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Show ellipsis if needed
      if (currentPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Calculate range of pages to show
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);
      
      // Adjust if at edges
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 2, maxVisiblePages - 2);
      } else if (currentPage >= totalPages - 3) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Show ellipsis if needed
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page if there is more than one page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key="last">
            <PaginationLink 
              onClick={() => handlePageChange(totalPages - 1)}
              isActive={currentPage === totalPages - 1}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      return items;
    };
  
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">No.</TableHead>
                <TableHead className="w-[180px]">Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No subscription payments found
                  </TableCell>
                </TableRow>
              ) : (
                content.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{payment.externalTransactionId ? payment.externalTransactionId.substring(0, 8) : "Migrated"}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {payment.dateCreated
                        ? new Date(payment.dateCreated).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="capitalize">
                      {payment.provider === "migration" ? "Manual" : payment.provider}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{payment.phone}</span>
                        <span className="text-xs text-gray-500">{payment.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{payment.quantity} months</TableCell>
                    <TableCell className="text-center">
                      {payment.status === "SUCCESS" ? (
                        <span className=" p-2 gap-1 bg-emerald-400 text-white rounded-sm">
                          Success
                        </span>
                      ) : (
                        <span className=" p-2 gap-1 bg-red-500 text-white rounded-sm">
                          Failed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
  
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {pageable.pageNumber * pageable.pageSize + 1} to{" "}
              {Math.min((pageable.pageNumber + 1) * pageable.pageSize, totalElements)} of{" "}
              {totalElements} entries
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                    className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    );
  };
  export const LocationSubscriptions = ({ payments, onPageChange }: SubscriptionPaymentsProps) => {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Location Subscriptions
          </h3>
        </CardHeader>
        <CardContent>
          <SubscriptionPaymentsTable payments={payments} onPageChange={onPageChange} />
        </CardContent>
      </Card>
    );
  };