// src/components/credits/PurchasePackageModal.tsx
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Coins } from "lucide-react";
import { CreditPackage } from "@/types/credits";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PurchasePackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchase: (packageId: string, paymentMethod: string) => void;
    selectedPackage: CreditPackage | null;
}

const PurchasePackageModal = ({
    isOpen,
    onClose,
    onPurchase,
    selectedPackage,
}: PurchasePackageModalProps) => {
    const [paymentMethod, setPaymentMethod] = useState<string>("card");

    if (!selectedPackage) return null;

    const handlePurchase = () => {
        onPurchase(selectedPackage.id, paymentMethod);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-800 border border-blue-500/20 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl">Покупка пакета кредитов</DialogTitle>
                    <DialogDescription className="text-blue-300">
                        Выберите способ оплаты для приобретения пакета
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-md border border-blue-500/20 p-4 mb-4 bg-slate-900/50">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{selectedPackage.name}</h3>
                            <div className="text-blue-300 text-sm">
                                {selectedPackage.price_per_credit.toFixed(3)} $ / кредит
                            </div>
                        </div>

                        <div className="flex items-center mt-3">
                            <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                            <div className="text-xl font-semibold">
                                {selectedPackage.credits.toLocaleString()} кредитов
                            </div>
                        </div>

                        <div className="mt-3 text-lg font-bold">
                            {selectedPackage.price} {selectedPackage.currency}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-blue-300">Способ оплаты</Label>
                        <RadioGroup
                            defaultValue={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2 rounded-md border border-blue-500/20 p-3 cursor-pointer hover:bg-slate-900/50">
                                <RadioGroupItem value="card" id="card" />
                                <Label
                                    htmlFor="card"
                                    className="cursor-pointer flex items-center"
                                >
                                    <CreditCard className="w-4 h-4 mr-2 text-blue-400" />
                                    Банковская карта
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 rounded-md border border-blue-500/20 p-3 cursor-pointer hover:bg-slate-900/50">
                                <RadioGroupItem value="crypto" id="crypto" />
                                <Label
                                    htmlFor="crypto"
                                    className="cursor-pointer flex items-center"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2 text-amber-400"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12,3 L20,8.5 L20,15.5 L12,21 L4,15.5 L4,8.5 L12,3 Z" />
                                    </svg>
                                    Криптовалюта
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {paymentMethod === "card" && (
                        <div className="mt-4 space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="card-number" className="text-blue-300">
                                    Номер карты
                                </Label>
                                <Input
                                    id="card-number"
                                    placeholder="0000 0000 0000 0000"
                                    className="bg-slate-900 border-blue-500/20 text-white placeholder:text-slate-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry" className="text-blue-300">
                                        Срок действия
                                    </Label>
                                    <Input
                                        id="expiry"
                                        placeholder="MM/YY"
                                        className="bg-slate-900 border-blue-500/20 text-white placeholder:text-slate-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cvv" className="text-blue-300">
                                        CVV
                                    </Label>
                                    <Input
                                        id="cvv"
                                        placeholder="123"
                                        type="password"
                                        className="bg-slate-900 border-blue-500/20 text-white placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handlePurchase}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                    >
                        Оплатить {selectedPackage.price} {selectedPackage.currency}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PurchasePackageModal;
