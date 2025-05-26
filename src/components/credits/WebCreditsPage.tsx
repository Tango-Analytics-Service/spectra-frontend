// src/components/credits/WebCreditsPage.tsx
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  typography,
  spacing,
  animations,
  createCardStyle,
} from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, History, Tag } from "lucide-react";
import { useCredits } from "@/contexts/CreditsContext";
import CreditBalanceCard from "./CreditBalanceCard";
import CreditTransactionsList from "./CreditTransactionsList";
import CreditPackagesGrid from "./CreditPackagesGrid";
import CreditCostsList from "./CreditCostsList";
import PurchasePackageModal from "./PurchasePackageModal";
import { LoadingSpinner } from "@/components/ui/loading";

const WebCreditsPage: React.FC = () => {
  // Get data and methods from context
  const {
    balance,
    transactions,
    packages,
    costs,
    isBalanceLoading,
    isTransactionsLoading,
    isPackagesLoading,
    isCostsLoading,
    fetchBalance,
    fetchTransactions,
    fetchPackages,
    fetchCosts,
    purchasePackage,
  } = useCredits();

  // Purchase modal state
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Load all data on component mount
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    fetchPackages();
    fetchCosts();
  }, [fetchBalance, fetchTransactions, fetchPackages, fetchCosts]);

  const handlePurchaseClick = (packageId) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setIsPurchaseModalOpen(true);
    }
  };

  const handlePurchaseConfirm = async (packageId, paymentMethod) => {
    if (!selectedPackage) return;

    setPurchaseLoading(true);
    try {
      const success = await purchasePackage(packageId, paymentMethod);
      if (success) {
        setIsPurchaseModalOpen(false);
      }
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <div className={cn("container mx-auto", animations.fadeIn)}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={typography.h1}>Управление кредитами</h1>
          <p className={cn(typography.small, "text-gray-300 mt-1")}>
            Просматривайте баланс, пополняйте кредиты и следите за расходами
          </p>
        </div>
      </div>

      {/* Credit balance */}
      <div className="mb-8">
        {isBalanceLoading ? (
          <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
            <CardContent className="p-6 flex justify-center">
              <LoadingSpinner size="lg" />
            </CardContent>
          </Card>
        ) : balance ? (
          <CreditBalanceCard balance={balance} />
        ) : (
          <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
            <CardContent className="p-6 text-center">
              Не удалось загрузить баланс
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="bg-[#0a2a5e]/50 border border-[#4395d3]/20">
          <TabsTrigger value="packages">
            <CreditCard className="h-4 w-4 mr-2" />
            Пакеты кредитов
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <History className="h-4 w-4 mr-2" />
            История транзакций
          </TabsTrigger>
          <TabsTrigger value="costs">
            <Tag className="h-4 w-4 mr-2" />
            Стоимость действий
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="mt-6">
          {isPackagesLoading ? (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-6 flex justify-center">
                <LoadingSpinner size="lg" />
              </CardContent>
            </Card>
          ) : packages.length > 0 ? (
            <CreditPackagesGrid
              packages={packages}
              onPurchase={handlePurchaseClick}
            />
          ) : (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-6 text-center">
                Нет доступных пакетов кредитов
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          {isTransactionsLoading ? (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-6 flex justify-center">
                <LoadingSpinner size="lg" />
              </CardContent>
            </Card>
          ) : transactions.length > 0 ? (
            <CreditTransactionsList transactions={transactions} />
          ) : (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-6 text-center">
                Нет истории транзакций
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="costs" className="mt-6">
          {isCostsLoading ? (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-6 flex justify-center">
                <LoadingSpinner size="lg" />
              </CardContent>
            </Card>
          ) : costs.length > 0 ? (
            <CreditCostsList costs={costs} />
          ) : (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-6 text-center">
                Не удалось загрузить стоимость действий
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Purchase modal */}
      <PurchasePackageModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onPurchase={handlePurchaseConfirm}
        selectedPackage={selectedPackage}
        isLoading={purchaseLoading}
      />
    </div>
  );
};

export default WebCreditsPage;
