// src/components/credits/CreditsPage.tsx
import React, { useState } from "react";
import CreditBalanceCard from "./CreditBalanceCard";
import CreditTransactionsList from "./CreditTransactionsList";
import CreditPackagesGrid from "./CreditPackagesGrid";
import CreditCostsList from "./CreditCostsList";
import PurchasePackageModal from "./PurchasePackageModal";
import { Badge } from "@/components/ui/badge";
import {
  mockCreditBalance,
  mockCreditTransactions,
  mockCreditPackages,
  mockCreditCosts,
} from "@/mocks/creditsMock";
import { CreditPackage } from "@/types/credits";

const CreditsPage = () => {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null,
  );
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const handlePurchaseClick = (packageId: string) => {
    const pkg = mockCreditPackages.find((p) => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setIsPurchaseModalOpen(true);
    }
  };

  const handlePurchaseConfirm = (packageId: string, paymentMethod: string) => {
    console.log(
      `Покупка пакета ${packageId} с методом оплаты ${paymentMethod}`,
    );
    // В реальном приложении здесь будет вызов API
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
          <CreditBalanceCard balance={mockCreditBalance} />
        </div>

        {/* Credit packages */}
        <div className="mt-6">
          <CreditPackagesGrid
            packages={mockCreditPackages}
            onPurchase={handlePurchaseClick}
          />
        </div>

        {/* Two columns layout on larger screens */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreditTransactionsList transactions={mockCreditTransactions} />
          <CreditCostsList costs={mockCreditCosts} />
        </div>
      </main>

      {/* Purchase modal */}
      <PurchasePackageModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onPurchase={handlePurchaseConfirm}
        selectedPackage={selectedPackage}
      />
    </div>
  );
};

export default CreditsPage;
