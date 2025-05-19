// src/components/credits/CreditsPage.tsx
import React, { useState, useEffect } from "react";
import CreditBalanceCard from "./CreditBalanceCard";
import CreditTransactionsList from "./CreditTransactionsList";
import CreditPackagesGrid from "./CreditPackagesGrid";
import CreditCostsList from "./CreditCostsList";
import PurchasePackageModal from "./PurchasePackageModal";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useCredits } from "@/contexts/CreditsContext";
import { CreditPackage } from "@/services/creditService";

const CreditsPage = () => {
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
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null,
  );
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Load all data on component mount
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    fetchPackages();
    fetchCosts();
  }, [fetchBalance, fetchTransactions, fetchPackages, fetchCosts]);

  const handlePurchaseClick = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setIsPurchaseModalOpen(true);
    }
  };

  const handlePurchaseConfirm = async (
    packageId: string,
    paymentMethod: string,
  ) => {
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0F172A] to-[#131c2e] text-white">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 flex items-center relative z-10">
        <div className="text-xl font-semibold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            SPECTRA
          </span>
          <Badge
            className="ml-2 bg-gradient-to-r from-[#358ee4] to-[#3b82f6] shadow-[0_0_8px_rgba(53,142,228,0.3)]"
            variant="default"
          >
            BETA
          </Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-hidden flex flex-col">
        {/* Title */}
        <div className="mt-3 sm:mt-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Управление кредитами
          </h1>
          <p className="text-xs sm:text-sm text-blue-300 mt-1">
            Просматривайте баланс, пополняйте кредиты и следите за расходами
          </p>
        </div>

        {/* Credit balance */}
        <div className="mt-4">
          {isBalanceLoading ? (
            <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : balance ? (
            <CreditBalanceCard balance={balance} />
          ) : (
            <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl text-center">
              Не удалось загрузить баланс
            </div>
          )}
        </div>

        {/* Credit packages */}
        <div className="mt-6">
          {isPackagesLoading ? (
            <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : packages.length > 0 ? (
            <CreditPackagesGrid
              packages={packages}
              onPurchase={handlePurchaseClick}
            />
          ) : (
            <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl text-center">
              Нет доступных пакетов кредитов
            </div>
          )}
        </div>

        {/* Two columns layout on larger screens */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions */}
          {isTransactionsLoading ? (
            <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : transactions.length > 0 ? (
            <CreditTransactionsList transactions={transactions} />
          ) : (
            <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl text-center">
              Нет истории транзакций
            </div>
          )}

          {/* Costs */}
          {isCostsLoading ? (
            <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : costs.length > 0 ? (
            <CreditCostsList costs={costs} />
          ) : (
            <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl text-center">
              Не удалось загрузить стоимость действий
            </div>
          )}
        </div>
      </main>

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

export default CreditsPage;
