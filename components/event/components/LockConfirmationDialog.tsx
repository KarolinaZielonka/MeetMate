"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDate } from "./utils";

interface LockConfirmationDialogProps {
	isOpen: boolean;
	selectedDate: string | null;
	isLocking: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function LockConfirmationDialog({
	isOpen,
	selectedDate,
	isLocking,
	onClose,
	onConfirm,
}: LockConfirmationDialogProps) {
	const t = useTranslations("optimalDates");

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("lockConfirm.title")}</DialogTitle>
					<DialogDescription>
						{selectedDate &&
							t("lockConfirm.description", {
								date: formatDate(selectedDate),
							})}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isLocking}>
						{t("lockConfirm.cancel")}
					</Button>
					<Button onClick={onConfirm} disabled={isLocking}>
						<Lock className="mr-2 h-4 w-4" />
						{isLocking ? t("lockingButton") : t("lockConfirm.confirm")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
